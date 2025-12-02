const { Op, Transaction } = require('sequelize');
const sequelize = require('../Data/config');
const RestaurantTables = require('../Data/Tables/RestaurantTables');
const Queue = require('../Data/Tables/Queue');
const { TABLE_STATUS } = require('../Data/Tables/RestaurantTables');
const { QUEUE_STATUS } = require('../Data/Tables/Queue');

// ============================================================
// CONSTANTES
// ============================================================
const ERROR_MESSAGES = Object.freeze({
    TABLE_NOT_FOUND: 'Mesa não encontrada',
    TABLE_NUMBER_EXISTS: 'Já existe uma mesa com este número',
    CANNOT_DELETE_OCCUPIED: 'Não é possível remover uma mesa ocupada',
    RELEASE_BEFORE_MAINTENANCE: 'Libere a mesa antes de colocar em manutenção'
});

// ============================================================
// SERVIÇO DE MESAS
// ============================================================

/**
 * Serviço para gerenciamento das mesas do restaurante
 * Contém toda a lógica de negócio relacionada às mesas
 */
class TableService {
    // ========================================================
    // CRUD BÁSICO
    // ========================================================

    /**
     * Lista todas as mesas
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<Array>} Lista de mesas
     */
    async listTables(filters = {}) {
        const { status, minCapacity } = filters;
        const where = {};

        if (status) {
            where.status = status;
        }

        if (minCapacity) {
            where.capacity = { [Op.gte]: minCapacity };
        }

        const tables = await RestaurantTables.findAll({
            where,
            order: [['table_number', 'ASC']],
            include: [
                {
                    model: Queue,
                    as: 'currentCustomer',
                    required: false
                }
            ]
        });

        return tables.map(table => ({
            ...table.toJSON(),
            occupiedTimeMinutes: table.getOccupiedTimeMinutes()
        }));
    }

    /**
     * Obtém uma mesa por ID
     * @param {number} id - ID da mesa
     * @returns {Promise<Object>} Mesa
     */
    async getTable(id) {
        const table = await RestaurantTables.findByPk(id, {
            include: [
                {
                    model: Queue,
                    as: 'currentCustomer',
                    required: false
                }
            ]
        });

        if (!table) {
            throw new Error('Mesa não encontrada');
        }

        return {
            ...table.toJSON(),
            occupiedTimeMinutes: table.getOccupiedTimeMinutes()
        };
    }

    /**
     * Cria uma nova mesa com validação de duplicidade atômica
     * @param {Object} data - Dados da mesa
     * @returns {Promise<Object>} Mesa criada
     * @throws {Error} Se número já existe
     */
    async createTable(data) {
        const { table_number, capacity, location } = data;

        // Validação de input
        this._validateTableData(data);

        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        });

        try {
            // Verifica duplicidade com lock
            const existing = await RestaurantTables.findOne({
                where: { table_number: String(table_number).trim() },
                lock: Transaction.LOCK.UPDATE,
                transaction
            });

            if (existing) {
                throw new Error(ERROR_MESSAGES.TABLE_NUMBER_EXISTS);
            }

            const table = await RestaurantTables.create(
                {
                    table_number: String(table_number).trim(),
                    capacity,
                    location: location?.trim() || null,
                    status: TABLE_STATUS.AVAILABLE
                },
                { transaction }
            );

            await transaction.commit();
            return table.toJSON();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Atualiza uma mesa
     * @param {number} id - ID da mesa
     * @param {Object} data - Dados para atualizar
     * @returns {Promise<Object>} Mesa atualizada
     */
    async updateTable(id, data) {
        const table = await RestaurantTables.findByPk(id);

        if (!table) {
            throw new Error('Mesa não encontrada');
        }

        const { table_number, capacity, location } = data;

        // Verifica duplicidade de número
        if (table_number && table_number !== table.table_number) {
            const existing = await RestaurantTables.findOne({
                where: { table_number }
            });

            if (existing) {
                throw new Error('Já existe uma mesa com este número');
            }
        }

        await table.update({
            table_number: table_number || table.table_number,
            capacity: capacity || table.capacity,
            location: location !== undefined ? location : table.location
        });

        return table.toJSON();
    }

    /**
     * Remove uma mesa
     * @param {number} id - ID da mesa
     * @returns {Promise<boolean>}
     */
    async deleteTable(id) {
        const table = await RestaurantTables.findByPk(id);

        if (!table) {
            throw new Error('Mesa não encontrada');
        }

        if (table.status === TABLE_STATUS.OCCUPIED) {
            throw new Error('Não é possível remover uma mesa ocupada');
        }

        await table.destroy();
        return true;
    }

    // ========================================================
    // GERENCIAMENTO DE STATUS
    // ========================================================

    /**
     * Libera uma mesa
     * @param {number} id - ID da mesa
     * @returns {Promise<Object>} Mesa liberada
     */
    async releaseTable(id) {
        const table = await RestaurantTables.findByPk(id);

        if (!table) {
            throw new Error('Mesa não encontrada');
        }

        // Se tinha cliente, marca como sentado/concluído
        if (table.current_queue_id) {
            const queueEntry = await Queue.findByPk(table.current_queue_id);
            if (queueEntry && queueEntry.status === QUEUE_STATUS.SEATED) {
                // Já está como seated, apenas libera a mesa
            }
        }

        await table.release();

        return table.toJSON();
    }

    /**
     * Coloca mesa em manutenção
     * @param {number} id - ID da mesa
     * @returns {Promise<Object>}
     */
    async setMaintenance(id) {
        const table = await RestaurantTables.findByPk(id);

        if (!table) {
            throw new Error('Mesa não encontrada');
        }

        if (table.status === TABLE_STATUS.OCCUPIED) {
            throw new Error('Libere a mesa antes de colocar em manutenção');
        }

        await table.setMaintenance();

        return table.toJSON();
    }

    /**
     * Torna mesa disponível
     * @param {number} id - ID da mesa
     * @returns {Promise<Object>}
     */
    async setAvailable(id) {
        const table = await RestaurantTables.findByPk(id);

        if (!table) {
            throw new Error('Mesa não encontrada');
        }

        await table.release(); // release() já seta como available

        return table.toJSON();
    }

    // ========================================================
    // ESTATÍSTICAS E CONSULTAS
    // ========================================================

    /**
     * Obtém estatísticas das mesas com consultas paralelas
     * @returns {Promise<Object>} Estatísticas
     */
    async getStats() {
        // Executa todas as queries em paralelo
        const [
            total,
            available,
            occupied,
            maintenance,
            reserved,
            totalCapacity,
            availableCapacity,
            occupiedTables
        ] = await Promise.all([
            RestaurantTables.count(),
            RestaurantTables.count({
                where: { status: TABLE_STATUS.AVAILABLE }
            }),
            RestaurantTables.count({
                where: { status: TABLE_STATUS.OCCUPIED }
            }),
            RestaurantTables.count({
                where: { status: TABLE_STATUS.MAINTENANCE }
            }),
            RestaurantTables.count({
                where: { status: TABLE_STATUS.RESERVED }
            }),
            RestaurantTables.sum('capacity') || 0,
            RestaurantTables.sum('capacity', {
                where: { status: TABLE_STATUS.AVAILABLE }
            }) || 0,
            RestaurantTables.findAll({
                where: { status: TABLE_STATUS.OCCUPIED }
            })
        ]);

        // Calcula tempo médio de ocupação
        const avgOccupiedTime =
            this._calculateAverageOccupiedTime(occupiedTables);

        return Object.freeze({
            total,
            available,
            occupied,
            maintenance,
            reserved,
            totalCapacity: totalCapacity || 0,
            availableCapacity: availableCapacity || 0,
            averageOccupiedMinutes: avgOccupiedTime,
            occupancyRate:
                total > 0 ? ((occupied / total) * 100).toFixed(1) : '0'
        });
    }

    /**
     * Calcula tempo médio de ocupação
     * @private
     */
    _calculateAverageOccupiedTime(occupiedTables) {
        if (occupiedTables.length === 0) return 0;

        const totalTime = occupiedTables.reduce((sum, table) => {
            return sum + (table.getOccupiedTimeMinutes() || 0);
        }, 0);

        return Math.round(totalTime / occupiedTables.length);
    }

    /**
     * Encontra mesas disponíveis para um grupo
     * @param {number} partySize - Tamanho do grupo
     * @returns {Promise<Array>} Mesas disponíveis ordenadas
     */
    async findAvailableForGroup(partySize) {
        if (!partySize || partySize < 1) {
            throw new Error('Tamanho do grupo deve ser pelo menos 1');
        }

        const tables = await RestaurantTables.findAll({
            where: {
                status: TABLE_STATUS.AVAILABLE,
                capacity: { [Op.gte]: partySize }
            },
            order: [
                ['capacity', 'ASC'] // Menor mesa que comporta primeiro
            ]
        });

        return tables.map(t => t.toJSON());
    }

    // ========================================================
    // MÉTODOS PRIVADOS
    // ========================================================

    /**
     * Valida dados de mesa
     * @private
     * @throws {Error} Se dados inválidos
     */
    _validateTableData({ table_number, capacity }) {
        if (!table_number?.toString().trim()) {
            throw new Error('Número da mesa é obrigatório');
        }
        if (!capacity || capacity < 1 || capacity > 20) {
            throw new Error('Capacidade deve ser entre 1 e 20');
        }
    }

    /**
     * Busca mesa por ID com validação
     * @private
     */
    async _findTableOrThrow(id) {
        const table = await RestaurantTables.findByPk(id);
        if (!table) {
            throw new Error(ERROR_MESSAGES.TABLE_NOT_FOUND);
        }
        return table;
    }
}

// Singleton com freeze para imutabilidade
module.exports = Object.freeze(new TableService());
