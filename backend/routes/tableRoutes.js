const express = require('express');
const router = express.Router();
const tableService = require('../services/tableService');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { responseHandler } = require('../utils/responseHandler');

// ============================================================
// ROTAS PÚBLICAS (PARA CLIENTES PRESENCIAIS)
// ============================================================

/**
 * GET /api/tables/available-for-order
 * Lista mesas disponíveis para o cliente selecionar ao fazer pedido
 */
router.get('/api/tables/available-for-order', async (req, res) => {
    try {
        const tables = await tableService.listTables({ status: 'available' });
        const publicTables = tables.map(table => ({
            id: table.id,
            table_number: table.table_number,
            location: table.location,
            capacity: table.capacity
        }));
        responseHandler.success(res, publicTables, 'Mesas disponíveis');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

// ============================================================
// ROTAS DE MESAS (TODAS PROTEGIDAS)
// ============================================================

/**
 * GET /api/tables
 * Lista todas as mesas
 */
router.get('/api/tables', authenticate, async (req, res) => {
    try {
        const { status, minCapacity } = req.query;
        const tables = await tableService.listTables({
            status,
            minCapacity: minCapacity ? parseInt(minCapacity) : undefined
        });
        responseHandler.success(res, tables, 'Lista de mesas');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * GET /api/tables/stats
 * Estatísticas das mesas
 */
router.get('/api/tables/stats', authenticate, async (req, res) => {
    try {
        const stats = await tableService.getStats();
        responseHandler.success(res, stats, 'Estatísticas das mesas');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * GET /api/tables/available/:partySize
 * Mesas disponíveis para um grupo
 */
router.get(
    '/api/tables/available/:partySize',
    authenticate,
    async (req, res) => {
        try {
            const { partySize } = req.params;
            const tables = await tableService.findAvailableForGroup(
                parseInt(partySize)
            );
            responseHandler.success(res, tables, 'Mesas disponíveis');
        } catch (error) {
            responseHandler.error(res, error.message);
        }
    }
);

/**
 * GET /api/tables/:id
 * Obtém uma mesa específica
 */
router.get('/api/tables/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const table = await tableService.getTable(parseInt(id));
        responseHandler.success(res, table, 'Mesa encontrada');
    } catch (error) {
        responseHandler.notFound(res, error.message);
    }
});

/**
 * POST /api/tables
 * Cria uma nova mesa
 */
router.post('/api/tables', authenticate, requireAdmin, async (req, res) => {
    try {
        const { table_number, capacity, location } = req.body;

        if (!table_number || !capacity) {
            return responseHandler.badRequest(
                res,
                'Número da mesa e capacidade são obrigatórios'
            );
        }

        const table = await tableService.createTable({
            table_number,
            capacity: parseInt(capacity),
            location
        });

        responseHandler.created(res, table, 'Mesa criada com sucesso');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * PUT /api/tables/:id
 * Atualiza uma mesa
 */
router.put('/api/tables/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { table_number, capacity, location } = req.body;

        const table = await tableService.updateTable(parseInt(id), {
            table_number,
            capacity: capacity ? parseInt(capacity) : undefined,
            location
        });

        responseHandler.success(res, table, 'Mesa atualizada');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * DELETE /api/tables/:id
 * Remove uma mesa
 */
router.delete(
    '/api/tables/:id',
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            await tableService.deleteTable(parseInt(id));
            responseHandler.success(res, null, 'Mesa removida');
        } catch (error) {
            responseHandler.error(res, error.message);
        }
    }
);

// ============================================================
// AÇÕES DE STATUS
// ============================================================

/**
 * PUT /api/tables/:id/release
 * Libera uma mesa
 */
router.put('/api/tables/:id/release', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const table = await tableService.releaseTable(parseInt(id));
        responseHandler.success(res, table, 'Mesa liberada');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * PUT /api/tables/:id/maintenance
 * Coloca mesa em manutenção
 */
router.put('/api/tables/:id/maintenance', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const table = await tableService.setMaintenance(parseInt(id));
        responseHandler.success(res, table, 'Mesa em manutenção');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

/**
 * PUT /api/tables/:id/available
 * Torna mesa disponível
 */
router.put('/api/tables/:id/available', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const table = await tableService.setAvailable(parseInt(id));
        responseHandler.success(res, table, 'Mesa disponível');
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

module.exports = router;
