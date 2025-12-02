const { Op, Transaction } = require('sequelize');
const sequelize = require('../Data/config');
const Queue = require('../Data/Tables/Queue');
const RestaurantTables = require('../Data/Tables/RestaurantTables');
const QueueSettings = require('../Data/Tables/QueueSettings');
const QueueDailyStats = require('../Data/Tables/QueueDailyStats');
const { QUEUE_STATUS, QUEUE_PRIORITY } = require('../Data/Tables/Queue');
const { TABLE_STATUS } = require('../Data/Tables/RestaurantTables');

// ============================================================
// CONSTANTES
// ============================================================
const ACTIVE_STATUSES = Object.freeze([
    QUEUE_STATUS.WAITING,
    QUEUE_STATUS.CALLED
]);

const ERROR_MESSAGES = Object.freeze({
    QUEUE_CLOSED: 'Fila fechada no momento',
    QUEUE_FULL: 'Fila cheia',
    PHONE_ALREADY_IN_QUEUE: 'Este telefone já está na fila',
    ENTRY_NOT_FOUND: 'Entrada não encontrada na fila',
    ENTRY_ALREADY_FINISHED: 'Esta entrada já foi finalizada',
    ONLY_WAITING_CAN_EDIT: 'Só é possível editar entradas aguardando',
    NO_CUSTOMER_IN_QUEUE: 'Nenhum cliente na fila',
    TABLE_NOT_FOUND: 'Mesa não encontrada',
    TABLE_CANNOT_ACCOMMODATE: 'Mesa não comporta o grupo ou não está disponível'
});

// ============================================================
// SERVIÇO DE FILA
// ============================================================

/**
 * Serviço para gerenciamento da fila de espera
 * Contém toda a lógica de negócio relacionada à fila
 */
class QueueService {
    // ========================================================
    // MÉTODOS PÚBLICOS (CLIENTE)
    // ========================================================

    /**
     * Obtém informações públicas da fila
     * @returns {Promise<Object>} Informações da fila
     */
    async getQueueInfo() {
        const settings = await QueueSettings.getSettings();
        const waitingCount = await Queue.count({
            where: { status: QUEUE_STATUS.WAITING }
        });

        const isOpen = settings.isOpenNow();
        const isFull = waitingCount >= settings.max_queue_size;

        return {
            isOpen,
            isFull,
            canJoin: isOpen && !isFull,
            currentWaiting: waitingCount,
            maxQueueSize: settings.max_queue_size,
            estimatedWaitMinutes: await this.calculateAverageWaitTime(),
            openingTime: settings.opening_time,
            closingTime: settings.closing_time
        };
    }

    /**
     * Adiciona cliente à fila com tratamento de concorrência
     * Usa transação para garantir atomicidade
     * @param {Object} customerData - Dados do cliente
     * @returns {Promise<Object>} Entrada criada na fila
     * @throws {Error} Se fila fechada, cheia ou telefone duplicado
     */
    async joinQueue(customerData) {
        const { customer_name, phone_number, party_size } = customerData;

        // Validação de input
        this._validateCustomerData(customerData);

        // Transação para garantir consistência em alta concorrência
        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        });

        try {
            // Validações de negócio dentro da transação
            const info = await this.getQueueInfo();
            if (!info.canJoin) {
                const reason = !info.isOpen
                    ? ERROR_MESSAGES.QUEUE_CLOSED
                    : ERROR_MESSAGES.QUEUE_FULL;
                throw new Error(reason);
            }

            // Verifica duplicidade com lock para evitar race condition
            const existing = await Queue.findOne({
                where: {
                    phone_number,
                    status: { [Op.in]: ACTIVE_STATUSES }
                },
                lock: Transaction.LOCK.UPDATE,
                transaction
            });

            if (existing) {
                throw new Error(ERROR_MESSAGES.PHONE_ALREADY_IN_QUEUE);
            }

            // Calcula tempo estimado
            const estimatedWait = await this.calculateEstimatedWait(party_size);

            // Cria entrada
            const entry = await Queue.create(
                {
                    customer_name: customer_name.trim(),
                    phone_number: this._sanitizePhone(phone_number),
                    party_size,
                    status: QUEUE_STATUS.WAITING,
                    priority: QUEUE_PRIORITY.NORMAL,
                    estimated_wait_minutes: estimatedWait
                },
                { transaction }
            );

            await transaction.commit();

            // Retorna com posição (fora da transação para performance)
            const position = await this.getPosition(entry.id);

            return {
                ...entry.toJSON(),
                position
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Obtém status do cliente na fila
     * @param {string|number} identifier - ID ou telefone
     * @returns {Promise<Object>} Status na fila
     * @throws {Error} Se entrada não encontrada
     */
    async getStatus(identifier) {
        const entry = await this._findEntryByIdentifier(identifier);

        if (!entry) {
            throw new Error(ERROR_MESSAGES.ENTRY_NOT_FOUND);
        }

        const [position, waitTime] = await Promise.all([
            this.getPosition(entry.id),
            Promise.resolve(entry.getWaitTimeMinutes())
        ]);

        return this._formatEntryStatus(entry, position, waitTime);
    }

    /**
     * Busca entrada por ID ou telefone
     * IMPORTANTE: Sempre filtra por status ativo para evitar retornar entradas finalizadas
     * @private
     */
    async _findEntryByIdentifier(identifier) {
        const isNumericId =
            !isNaN(identifier) && !String(identifier).includes('-');

        // Sempre filtra por status ativo, independente do tipo de busca
        const whereClause = isNumericId
            ? {
                  id: parseInt(identifier),
                  status: { [Op.in]: ACTIVE_STATUSES }
              }
            : {
                  phone_number: this._sanitizePhone(identifier),
                  status: { [Op.in]: ACTIVE_STATUSES }
              };

        return Queue.findOne({ where: whereClause });
    }

    /**
     * Formata resposta de status
     * @private
     */
    _formatEntryStatus(entry, position, waitTime) {
        return {
            id: entry.id,
            customer_name: entry.customer_name,
            party_size: entry.party_size,
            status: entry.status,
            position,
            waitTimeMinutes: waitTime,
            estimatedWaitMinutes: entry.estimated_wait_minutes,
            entryTime: entry.entry_time
        };
    }

    /**
     * Atualiza dados do cliente na fila
     * @param {number} id - ID da entrada
     * @param {Object} updateData - Dados para atualizar
     * @returns {Promise<Object>} Entrada atualizada
     */
    async updateEntry(id, updateData) {
        const entry = await Queue.findByPk(id);

        if (!entry) {
            throw new Error('Entrada não encontrada');
        }

        if (entry.status !== QUEUE_STATUS.WAITING) {
            throw new Error('Só é possível editar entradas aguardando');
        }

        // Só permite atualizar party_size
        if (updateData.party_size) {
            entry.party_size = updateData.party_size;
            entry.estimated_wait_minutes = await this.calculateEstimatedWait(
                updateData.party_size
            );
        }

        await entry.save();

        return await this.getStatus(id);
    }

    /**
     * Cancela entrada na fila (cliente)
     * IDEMPOTENTE: Retorna sucesso mesmo se entrada não existe ou já foi finalizada
     * Isso garante que o cliente sempre consegue "sair" da fila
     * @param {number} id - ID da entrada
     * @returns {Promise<Object>} { success: true, alreadyFinished?: boolean }
     */
    async cancelEntry(id) {
        const entry = await Queue.findByPk(id);

        // Idempotente: se não existe, considera como sucesso (já saiu/expirou)
        if (!entry) {
            return {
                success: true,
                alreadyFinished: true,
                message: 'Entrada já removida ou expirada'
            };
        }

        // Idempotente: se já foi finalizada, considera como sucesso
        if (!ACTIVE_STATUSES.includes(entry.status)) {
            return {
                success: true,
                alreadyFinished: true,
                message: 'Entrada já finalizada'
            };
        }

        await entry.cancel();
        return {
            success: true,
            alreadyFinished: false,
            message: 'Saída da fila realizada'
        };
    }

    // ========================================================
    // MÉTODOS PROTEGIDOS (FUNCIONÁRIOS)
    // ========================================================

    /**
     * Lista todas as entradas ativas na fila
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<Array>} Lista de entradas
     */
    async listQueue(filters = {}) {
        const { status, priority, includeAll = false } = filters;

        const where = {};

        if (!includeAll) {
            where.status = { [Op.in]: ACTIVE_STATUSES };
        }

        if (status) {
            where.status = status;
        }

        if (priority) {
            where.priority = priority;
        }

        const entries = await Queue.findAll({
            where,
            order: [
                ['priority', 'DESC'], // VIP primeiro
                ['entry_time', 'ASC'] // Mais antigo primeiro
            ]
        });

        // Adiciona posição a cada entrada
        return Promise.all(
            entries.map(async (entry, index) => ({
                ...entry.toJSON(),
                position: index + 1,
                waitTimeMinutes: entry.getWaitTimeMinutes()
            }))
        );
    }

    /**
     * Adiciona cliente manualmente (funcionário)
     * @param {Object} data - Dados do cliente
     * @param {number} employeeId - ID do funcionário
     * @returns {Promise<Object>} Entrada criada
     */
    async addManually(data, employeeId) {
        const { customer_name, phone_number, party_size, priority, notes } =
            data;

        const estimatedWait = await this.calculateEstimatedWait(party_size);

        const entry = await Queue.create({
            customer_name,
            phone_number,
            party_size,
            status: QUEUE_STATUS.WAITING,
            priority: priority || QUEUE_PRIORITY.NORMAL,
            estimated_wait_minutes: estimatedWait,
            notes,
            created_by: employeeId
        });

        const position = await this.getPosition(entry.id);

        return {
            ...entry.toJSON(),
            position
        };
    }

    /**
     * Chama o próximo cliente
     * @param {number} id - ID da entrada (opcional, senão pega o próximo)
     * @returns {Promise<Object>} Entrada chamada
     */
    async callCustomer(id) {
        let entry;

        if (id) {
            entry = await Queue.findByPk(id);
        } else {
            // Pega o próximo da fila (respeitando prioridade)
            entry = await Queue.findOne({
                where: { status: QUEUE_STATUS.WAITING },
                order: [
                    ['priority', 'DESC'],
                    ['entry_time', 'ASC']
                ]
            });
        }

        if (!entry) {
            throw new Error('Nenhum cliente na fila');
        }

        await entry.markAsCalled();

        return {
            ...entry.toJSON(),
            waitTimeMinutes: entry.getWaitTimeMinutes()
        };
    }

    /**
     * Marca cliente como sentado com transação para consistência
     * @param {number} queueId - ID da entrada
     * @param {number} tableId - ID da mesa
     * @returns {Promise<Object>}
     * @throws {Error} Se entrada/mesa não encontrada ou mesa não disponível
     */
    async seatCustomer(queueId, tableId) {
        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        });

        try {
            // Busca com lock para evitar race condition
            const [entry, table] = await Promise.all([
                Queue.findByPk(queueId, {
                    lock: Transaction.LOCK.UPDATE,
                    transaction
                }),
                RestaurantTables.findByPk(tableId, {
                    lock: Transaction.LOCK.UPDATE,
                    transaction
                })
            ]);

            // Validações
            if (!entry) {
                throw new Error(ERROR_MESSAGES.ENTRY_NOT_FOUND);
            }

            if (!table) {
                throw new Error(ERROR_MESSAGES.TABLE_NOT_FOUND);
            }

            if (!table.canAccommodate(entry.party_size)) {
                throw new Error(ERROR_MESSAGES.TABLE_CANNOT_ACCOMMODATE);
            }

            // Operações atômicas
            await Promise.all([
                entry.markAsSeated(tableId, transaction),
                table.occupy(queueId, transaction)
            ]);

            await transaction.commit();

            // Recarrega para obter dados atualizados
            await Promise.all([entry.reload(), table.reload()]);

            return {
                queue: entry.toJSON(),
                table: table.toJSON()
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Marca como não compareceu
     * @param {number} id - ID da entrada
     * @returns {Promise<Object>}
     */
    async markNoShow(id) {
        const entry = await Queue.findByPk(id);

        if (!entry) {
            throw new Error('Entrada não encontrada');
        }

        await entry.markAsNoShow();

        return entry.toJSON();
    }

    /**
     * Remove entrada da fila (admin)
     * @param {number} id - ID da entrada
     * @returns {Promise<boolean>}
     */
    async removeEntry(id) {
        const entry = await Queue.findByPk(id);

        if (!entry) {
            throw new Error('Entrada não encontrada');
        }

        await entry.destroy();
        return true;
    }

    /**
     * Atualiza prioridade
     * @param {number} id - ID da entrada
     * @param {string} priority - Nova prioridade
     * @returns {Promise<Object>}
     */
    async updatePriority(id, priority) {
        const entry = await Queue.findByPk(id);

        if (!entry) {
            throw new Error('Entrada não encontrada');
        }

        entry.priority = priority;
        await entry.save();

        return entry.toJSON();
    }

    // ========================================================
    // MÉTRICAS
    // ========================================================

    /**
     * Obtém métricas da fila
     * @param {Date} startDate - Data inicial (opcional)
     * @param {Date} endDate - Data final (opcional)
     * @returns {Promise<Object>} Métricas
     */
    async getMetrics(startDate, endDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const where = {
            entry_time: {
                [Op.gte]: startDate || today
            }
        };

        if (endDate) {
            where.entry_time[Op.lte] = endDate;
        }

        const allEntries = await Queue.findAll({ where });

        const totalCustomers = allEntries.length;
        const noShows = allEntries.filter(
            e => e.status === QUEUE_STATUS.NO_SHOW
        ).length;
        const seated = allEntries.filter(e => e.status === QUEUE_STATUS.SEATED);
        const cancelled = allEntries.filter(
            e => e.status === QUEUE_STATUS.CANCELLED
        ).length;

        // Calcula tempo médio de espera dos que foram sentados
        let avgWaitTime = 0;
        if (seated.length > 0) {
            const totalWait = seated.reduce((sum, entry) => {
                const wait =
                    (new Date(entry.seated_time) - new Date(entry.entry_time)) /
                    (1000 * 60);
                return sum + wait;
            }, 0);
            avgWaitTime = Math.round(totalWait / seated.length);
        }

        const currentWaiting = await Queue.count({
            where: { status: QUEUE_STATUS.WAITING }
        });

        const currentCalled = await Queue.count({
            where: { status: QUEUE_STATUS.CALLED }
        });

        return {
            totalCustomers,
            seated: seated.length,
            noShows,
            cancelled,
            noShowRate:
                totalCustomers > 0
                    ? ((noShows / totalCustomers) * 100).toFixed(1)
                    : 0,
            averageWaitMinutes: avgWaitTime,
            currentWaiting,
            currentCalled
        };
    }

    // ========================================================
    // MÉTODOS AUXILIARES
    // ========================================================

    /**
     * Calcula posição na fila
     * @param {number} entryId - ID da entrada
     * @returns {Promise<number>} Posição (1-based)
     */
    async getPosition(entryId) {
        const entry = await Queue.findByPk(entryId);

        if (!entry || !ACTIVE_STATUSES.includes(entry.status)) {
            return 0;
        }

        const aheadCount = await Queue.count({
            where: {
                status: QUEUE_STATUS.WAITING,
                [Op.or]: [
                    // Prioridade maior
                    {
                        priority: { [Op.gt]: entry.priority }
                    },
                    // Mesma prioridade, chegou antes
                    {
                        priority: entry.priority,
                        entry_time: { [Op.lt]: entry.entry_time }
                    }
                ]
            }
        });

        return entry.status === QUEUE_STATUS.CALLED ? 0 : aheadCount + 1;
    }

    /**
     * Calcula tempo estimado de espera para novo cliente
     * @param {number} partySize - Tamanho do grupo
     * @returns {Promise<number>} Minutos estimados
     */
    async calculateEstimatedWait(partySize) {
        const settings = await QueueSettings.getSettings();
        const waitingAhead = await Queue.count({
            where: { status: QUEUE_STATUS.WAITING }
        });

        const availableTables = await RestaurantTables.count({
            where: {
                status: TABLE_STATUS.AVAILABLE,
                capacity: { [Op.gte]: partySize }
            }
        });

        const avgTurnover = settings.average_turnover_minutes;
        const timePerPerson = settings.estimated_time_per_person;

        // Se há mesas disponíveis, tempo mínimo
        if (availableTables > 0 && waitingAhead === 0) {
            return 5;
        }

        // Cálculo base
        let estimatedMinutes =
            (waitingAhead / Math.max(availableTables, 1)) * avgTurnover;

        // Ajuste por tamanho do grupo
        estimatedMinutes += (partySize - 2) * timePerPerson;

        return Math.max(5, Math.round(estimatedMinutes));
    }

    /**
     * Calcula tempo médio de espera atual
     * @returns {Promise<number>} Minutos
     */
    async calculateAverageWaitTime() {
        const [settings, waitingCount, availableTables] = await Promise.all([
            QueueSettings.getSettings(),
            Queue.count({ where: { status: QUEUE_STATUS.WAITING } }),
            RestaurantTables.count({
                where: { status: TABLE_STATUS.AVAILABLE }
            })
        ]);

        if (waitingCount === 0) return 0;
        if (availableTables === 0) return settings.average_turnover_minutes;

        return Math.round(
            (waitingCount / availableTables) * settings.average_turnover_minutes
        );
    }

    // ========================================================
    // MÉTODOS DE LIMPEZA (CLEANUP)
    // ========================================================

    /**
     * Limpa entradas expiradas da fila
     * - Entradas 'waiting' além do tempo máximo configurado → cancelled
     * - Entradas 'called' sem resposta além do timeout → no_show
     *
     * @returns {Promise<Object>} { expiredWaiting, expiredCalled, total }
     */
    async cleanupExpiredEntries() {
        const settings = await QueueSettings.getSettings();

        // Calcula horário de expiração para 'waiting'
        const waitingExpirationTime = new Date();
        waitingExpirationTime.setHours(
            waitingExpirationTime.getHours() - settings.max_wait_hours
        );

        // Calcula horário de expiração para 'called'
        const calledExpirationTime = new Date();
        calledExpirationTime.setMinutes(
            calledExpirationTime.getMinutes() - settings.call_timeout_minutes
        );

        // Expira entradas 'waiting' antigas
        const [expiredWaiting] = await Queue.update(
            { status: QUEUE_STATUS.CANCELLED },
            {
                where: {
                    status: QUEUE_STATUS.WAITING,
                    entry_time: { [Op.lt]: waitingExpirationTime }
                }
            }
        );

        // Expira entradas 'called' sem resposta (marca como no_show)
        const [expiredCalled] = await Queue.update(
            { status: QUEUE_STATUS.NO_SHOW },
            {
                where: {
                    status: QUEUE_STATUS.CALLED,
                    called_time: { [Op.lt]: calledExpirationTime }
                }
            }
        );

        return {
            expiredWaiting,
            expiredCalled,
            total: expiredWaiting + expiredCalled
        };
    }

    /**
     * Remove entradas antigas do histórico (mais de X dias)
     * Útil para manutenção e performance do banco
     *
     * @param {number} daysToKeep - Dias para manter no histórico (default: 30)
     * @returns {Promise<number>} Número de entradas removidas
     */
    async purgeOldEntries(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const deleted = await Queue.destroy({
            where: {
                status: {
                    [Op.in]: [
                        QUEUE_STATUS.SEATED,
                        QUEUE_STATUS.NO_SHOW,
                        QUEUE_STATUS.CANCELLED
                    ]
                },
                entry_time: { [Op.lt]: cutoffDate }
            }
        });

        return deleted;
    }

    /**
     * Obtém estatísticas de limpeza (para monitoramento)
     * @returns {Promise<Object>} Estatísticas de entradas pendentes de limpeza
     */
    async getCleanupStats() {
        const settings = await QueueSettings.getSettings();

        const waitingExpirationTime = new Date();
        waitingExpirationTime.setHours(
            waitingExpirationTime.getHours() - settings.max_wait_hours
        );

        const calledExpirationTime = new Date();
        calledExpirationTime.setMinutes(
            calledExpirationTime.getMinutes() - settings.call_timeout_minutes
        );

        const [expiredWaitingCount, expiredCalledCount] = await Promise.all([
            Queue.count({
                where: {
                    status: QUEUE_STATUS.WAITING,
                    entry_time: { [Op.lt]: waitingExpirationTime }
                }
            }),
            Queue.count({
                where: {
                    status: QUEUE_STATUS.CALLED,
                    called_time: { [Op.lt]: calledExpirationTime }
                }
            })
        ]);

        return {
            expiredWaitingCount,
            expiredCalledCount,
            totalPendingCleanup: expiredWaitingCount + expiredCalledCount,
            settings: {
                maxWaitHours: settings.max_wait_hours,
                callTimeoutMinutes: settings.call_timeout_minutes
            }
        };
    }

    /**
     * Agrega estatísticas diárias e salva no QueueDailyStats
     * @param {Date} [date] - Data para agregar (default: ontem)
     * @returns {Promise<Object>} Estatísticas agregadas
     */
    async aggregateDailyStats(date = null) {
        // Por padrão, agrega o dia anterior (dia completo)
        const targetDate = date || new Date();
        if (!date) {
            targetDate.setDate(targetDate.getDate() - 1);
        }

        // Normaliza para início e fim do dia
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const dateString = startOfDay.toISOString().split('T')[0];

        // Busca todas as entradas finalizadas do dia
        const entries = await Queue.findAll({
            where: {
                entry_time: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                status: {
                    [Op.in]: [
                        QUEUE_STATUS.SEATED,
                        QUEUE_STATUS.NO_SHOW,
                        QUEUE_STATUS.CANCELLED
                    ]
                }
            },
            attributes: [
                'id',
                'status',
                'party_size',
                'entry_time',
                'seated_time',
                'called_time'
            ],
            raw: true
        });

        // Se não houver dados, não cria registro
        if (entries.length === 0) {
            return null;
        }

        // Calcula métricas
        const stats = this._calculateDailyMetrics(entries);
        stats.date = dateString;

        // Upsert - atualiza se já existir
        const [dailyStats, created] = await QueueDailyStats.upsert(stats, {
            returning: true
        });

        console.log(
            `[QueueService] Daily stats ${
                created ? 'created' : 'updated'
            } for ${dateString}: ${entries.length} entries`
        );

        return dailyStats;
    }

    /**
     * Calcula métricas diárias a partir de entradas
     * @private
     * @param {Array} entries - Entradas do dia
     * @returns {Object} Métricas calculadas
     */
    _calculateDailyMetrics(entries) {
        const seatedEntries = entries.filter(
            e => e.status === QUEUE_STATUS.SEATED
        );
        const noShowEntries = entries.filter(
            e => e.status === QUEUE_STATUS.NO_SHOW
        );
        const cancelledEntries = entries.filter(
            e => e.status === QUEUE_STATUS.CANCELLED
        );

        // Tempo de espera (para clientes que foram sentados)
        const waitTimes = seatedEntries
            .filter(e => e.seated_time && e.entry_time)
            .map(e => {
                const entry = new Date(e.entry_time);
                const seated = new Date(e.seated_time);
                return (seated - entry) / (1000 * 60); // minutos
            });

        const avgWait =
            waitTimes.length > 0
                ? Math.round(
                      waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length
                  )
                : 0;
        const maxWait =
            waitTimes.length > 0 ? Math.round(Math.max(...waitTimes)) : 0;

        // Hora de pico
        const hourCounts = {};
        entries.forEach(e => {
            const hour = new Date(e.entry_time).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        const peakHour =
            Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
            null;

        // Tamanho de grupo mais comum
        const sizeCounts = {};
        entries.forEach(e => {
            sizeCounts[e.party_size] = (sizeCounts[e.party_size] || 0) + 1;
        });
        const mostCommonSize =
            Object.entries(sizeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
            null;

        // Total de pessoas
        const totalPartySize = entries.reduce(
            (sum, e) => sum + (e.party_size || 0),
            0
        );

        return {
            total_customers: entries.length,
            customers_seated: seatedEntries.length,
            customers_no_show: noShowEntries.length,
            customers_cancelled: cancelledEntries.length,
            average_wait_minutes: avgWait,
            max_wait_minutes: maxWait,
            peak_hour: peakHour ? parseInt(peakHour, 10) : null,
            most_common_party_size: mostCommonSize
                ? parseInt(mostCommonSize, 10)
                : null,
            total_party_size: totalPartySize
        };
    }

    /**
     * Remove entradas antigas já finalizadas (após retenção)
     * Deve ser chamado APÓS aggregateDailyStats para não perder dados
     * @returns {Promise<number>} Quantidade de entradas removidas
     */
    async deleteOldFinishedEntries() {
        const settings = await QueueSettings.getSettings();
        const retentionHours = settings.history_retention_hours || 48;

        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - retentionHours);

        const deleted = await Queue.destroy({
            where: {
                status: {
                    [Op.in]: [
                        QUEUE_STATUS.SEATED,
                        QUEUE_STATUS.NO_SHOW,
                        QUEUE_STATUS.CANCELLED
                    ]
                },
                updatedAt: { [Op.lt]: cutoffTime }
            }
        });

        if (deleted > 0) {
            console.log(
                `[QueueService] Deleted ${deleted} finished entries older than ${retentionHours}h`
            );
        }

        return deleted;
    }

    /**
     * Obtém estatísticas históricas agregadas
     * @param {number} [days=30] - Quantidade de dias
     * @returns {Promise<Array>} Estatísticas diárias
     */
    async getDailyStatsHistory(days = 30) {
        return QueueDailyStats.getRecentStats(days);
    }

    // ========================================================
    // MÉTODOS PRIVADOS DE VALIDAÇÃO
    // ========================================================

    /**
     * Valida dados do cliente
     * @private
     * @throws {Error} Se dados inválidos
     */
    _validateCustomerData({ customer_name, phone_number, party_size }) {
        if (!customer_name?.trim()) {
            throw new Error('Nome do cliente é obrigatório');
        }
        if (!phone_number?.trim()) {
            throw new Error('Telefone é obrigatório');
        }
        if (!party_size || party_size < 1 || party_size > 20) {
            throw new Error('Quantidade de pessoas deve ser entre 1 e 20');
        }
    }

    /**
     * Sanitiza número de telefone
     * @private
     */
    _sanitizePhone(phone) {
        return String(phone).replace(/\D/g, '');
    }

    /**
     * Verifica se entrada existe e está ativa
     * @private
     */
    async _findActiveEntry(id) {
        const entry = await Queue.findByPk(id);
        if (!entry) {
            throw new Error(ERROR_MESSAGES.ENTRY_NOT_FOUND);
        }
        return entry;
    }
}

// Singleton com freeze para imutabilidade
module.exports = Object.freeze(new QueueService());
