const express = require('express');
const router = express.Router();
const queueService = require('../services/queueService');
const QueueSettings = require('../Data/Tables/QueueSettings');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { responseHandler } = require('../utils/responseHandler');

// ============================================================
// ROTAS PÚBLICAS (CLIENTE)
// ============================================================

/**
 * GET /api/queue/info
 * Obtém informações públicas da fila
 */
router.get('/api/queue/info', async (req, res) => {
    try {
        const info = await queueService.getQueueInfo();
        responseHandler.success(res, info, 'Informações da fila');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * POST /api/queue
 * Entra na fila
 */
router.post('/api/queue', async (req, res) => {
    try {
        const { customer_name, phone_number, party_size } = req.body;

        if (!customer_name || !phone_number || !party_size) {
            return responseHandler.badRequest(
                res,
                'Nome, telefone e quantidade de pessoas são obrigatórios'
            );
        }

        const entry = await queueService.joinQueue({
            customer_name,
            phone_number,
            party_size: parseInt(party_size)
        });

        responseHandler.created(
            res,
            entry,
            'Entrada na fila realizada com sucesso'
        );
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * GET /api/queue/status/:identifier
 * Obtém status na fila por ID ou telefone
 */
router.get('/api/queue/status/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        const status = await queueService.getStatus(identifier);
        responseHandler.success(res, status, 'Status na fila');
    } catch (error) {
        responseHandler.notFound(res, error.message);
    }
});

/**
 * PUT /api/queue/:id
 * Atualiza dados na fila (número de pessoas)
 */
router.put('/api/queue/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { party_size } = req.body;

        const updated = await queueService.updateEntry(id, {
            party_size: party_size ? parseInt(party_size) : undefined
        });

        responseHandler.success(res, updated, 'Dados atualizados');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * DELETE /api/queue/:id
 * Cancela/sai da fila
 * IDEMPOTENTE: Retorna sucesso mesmo se entrada já foi finalizada/expirada
 */
router.delete('/api/queue/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await queueService.cancelEntry(parseInt(id));
        responseHandler.success(res, result, result.message);
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

// ============================================================
// ROTAS PROTEGIDAS (FUNCIONÁRIOS)
// ============================================================

/**
 * GET /api/queue
 * Lista toda a fila (funcionários)
 */
router.get('/api/queue', authenticate, async (req, res) => {
    try {
        const { status, priority, includeAll } = req.query;
        const queue = await queueService.listQueue({
            status,
            priority,
            includeAll: includeAll === 'true'
        });
        responseHandler.success(res, queue, 'Lista da fila');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * POST /api/queue/manual
 * Adiciona cliente manualmente (funcionário)
 */
router.post('/api/queue/manual', authenticate, async (req, res) => {
    try {
        const { customer_name, phone_number, party_size, priority, notes } =
            req.body;

        if (!customer_name || !phone_number || !party_size) {
            return responseHandler.badRequest(
                res,
                'Nome, telefone e quantidade de pessoas são obrigatórios'
            );
        }

        const entry = await queueService.addManually(
            {
                customer_name,
                phone_number,
                party_size: parseInt(party_size),
                priority,
                notes
            },
            req.user.id
        );

        responseHandler.created(res, entry, 'Cliente adicionado à fila');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * PUT /api/queue/:id/call
 * Chama cliente
 */
router.put('/api/queue/:id/call', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await queueService.callCustomer(parseInt(id));
        responseHandler.success(res, entry, 'Cliente chamado');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * PUT /api/queue/call-next
 * Chama próximo cliente da fila
 */
router.put('/api/queue/call-next', authenticate, async (req, res) => {
    try {
        const entry = await queueService.callCustomer();
        responseHandler.success(res, entry, 'Próximo cliente chamado');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * PUT /api/queue/:id/seat
 * Marca cliente como sentado
 */
router.put('/api/queue/:id/seat', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { table_id } = req.body;

        if (!table_id) {
            return responseHandler.badRequest(res, 'ID da mesa é obrigatório');
        }

        const result = await queueService.seatCustomer(
            parseInt(id),
            parseInt(table_id)
        );

        responseHandler.success(res, result, 'Cliente sentado');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * PUT /api/queue/:id/no-show
 * Marca como não compareceu
 */
router.put('/api/queue/:id/no-show', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await queueService.markNoShow(parseInt(id));
        responseHandler.success(res, entry, 'Marcado como não compareceu');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * PUT /api/queue/:id/priority
 * Atualiza prioridade
 */
router.put('/api/queue/:id/priority', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        if (!priority) {
            return responseHandler.badRequest(res, 'Prioridade é obrigatória');
        }

        const entry = await queueService.updatePriority(parseInt(id), priority);
        responseHandler.success(res, entry, 'Prioridade atualizada');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * DELETE /api/queue/:id/admin
 * Remove entrada (admin)
 */
router.delete(
    '/api/queue/:id/admin',
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            await queueService.removeEntry(parseInt(id));
            responseHandler.success(res, null, 'Entrada removida');
        } catch (error) {
            responseHandler.error(res, error.message);
        }
    }
);

/**
 * GET /api/queue/metrics
 * Obtém métricas da fila
 */
router.get('/api/queue/metrics', authenticate, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const metrics = await queueService.getMetrics(
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined
        );
        responseHandler.success(res, metrics, 'Métricas da fila');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

// ============================================================
// ROTAS DE CONFIGURAÇÕES (ADMIN)
// ============================================================

/**
 * GET /api/queue/settings
 * Obtém configurações da fila
 */
router.get('/api/queue/settings', authenticate, async (req, res) => {
    try {
        const settings = await QueueSettings.getSettings();
        responseHandler.success(res, settings, 'Configurações da fila');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * PUT /api/queue/settings
 * Atualiza configurações da fila
 */
router.put(
    '/api/queue/settings',
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const settings = await QueueSettings.getSettings();

            const allowedFields = [
                'max_queue_size',
                'average_turnover_minutes',
                'estimated_time_per_person',
                'is_queue_open',
                'opening_time',
                'closing_time',
                'auto_close_before_closing',
                'whatsapp_notification_enabled',
                'whatsapp_message_template',
                'max_wait_hours',
                'call_timeout_minutes',
                'history_retention_hours'
            ];

            const updateData = {};
            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updateData[field] = req.body[field];
                }
            });

            await settings.update(updateData);
            responseHandler.success(res, settings, 'Configurações atualizadas');
        } catch (error) {
            responseHandler.error(res, error.message);
        }
    }
);

/**
 * PUT /api/queue/settings/toggle
 * Abre/fecha a fila
 */
router.put('/api/queue/settings/toggle', authenticate, async (req, res) => {
    try {
        const settings = await QueueSettings.getSettings();
        settings.is_queue_open = !settings.is_queue_open;
        await settings.save();

        const status = settings.is_queue_open ? 'aberta' : 'fechada';
        responseHandler.success(res, settings, `Fila ${status}`);
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

// ============================================================
// ROTAS DE LIMPEZA (CLEANUP)
// ============================================================

/**
 * POST /api/queue/cleanup
 * Executa limpeza manual de entradas expiradas (Admin)
 */
router.post(
    '/api/queue/cleanup',
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const result = await queueService.cleanupExpiredEntries();
            responseHandler.success(
                res,
                result,
                `Limpeza concluída: ${result.total} entradas expiradas`
            );
        } catch (error) {
            responseHandler.error(res, error.message);
        }
    }
);

/**
 * GET /api/queue/cleanup/stats
 * Obtém estatísticas de entradas pendentes de limpeza
 */
router.get('/api/queue/cleanup/stats', authenticate, async (req, res) => {
    try {
        const stats = await queueService.getCleanupStats();
        responseHandler.success(res, stats, 'Estatísticas de limpeza');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * DELETE /api/queue/purge
 * Remove entradas antigas do histórico (Admin)
 * Query params: daysToKeep (default: 30)
 */
router.delete(
    '/api/queue/purge',
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const daysToKeep = parseInt(req.query.daysToKeep) || 30;
            const deleted = await queueService.purgeOldEntries(daysToKeep);
            responseHandler.success(
                res,
                { deleted, daysToKeep },
                `${deleted} entradas removidas do histórico`
            );
        } catch (error) {
            responseHandler.error(res, error.message);
        }
    }
);

// ============================================================
// ROTAS DE ESTATÍSTICAS HISTÓRICAS
// ============================================================

/**
 * GET /api/queue/stats/daily
 * Obtém estatísticas diárias agregadas (histórico)
 * Query params: days (default: 30)
 */
router.get('/api/queue/stats/daily', authenticate, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const stats = await queueService.getDailyStatsHistory(days);
        responseHandler.success(
            res,
            stats,
            `Estatísticas dos últimos ${days} dias`
        );
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * POST /api/queue/stats/aggregate
 * Força agregação manual de estatísticas de uma data (Admin)
 * Body: { date: 'YYYY-MM-DD' } (opcional, default: ontem)
 */
router.post(
    '/api/queue/stats/aggregate',
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const { date } = req.body;
            const targetDate = date ? new Date(date) : null;
            const stats = await queueService.aggregateDailyStats(targetDate);

            if (!stats) {
                return responseHandler.success(
                    res,
                    null,
                    'Nenhum dado para agregar nesta data'
                );
            }

            responseHandler.success(
                res,
                stats,
                'Estatísticas agregadas com sucesso'
            );
        } catch (error) {
            responseHandler.error(res, error.message);
        }
    }
);

module.exports = router;
