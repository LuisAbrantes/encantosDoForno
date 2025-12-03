const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const { authenticate } = require('../middleware/auth');
const { responseHandler } = require('../utils/responseHandler');

// ============================================================
// ROTAS PÚBLICAS (CLIENTE PRESENCIAL)
// ============================================================

/**
 * POST /api/orders
 * Cria novo pedido (cliente no restaurante)
 */
router.post('/api/orders', async (req, res) => {
    try {
        const { table_id, items, customer_name, notes } = req.body;

        if (!table_id) {
            return responseHandler.badRequest(res, 'Selecione uma mesa');
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return responseHandler.badRequest(res, 'Adicione itens ao pedido');
        }

        const order = await orderService.createOrder({
            table_id: parseInt(table_id),
            items,
            customer_name,
            notes
        });

        responseHandler.created(res, order, 'Pedido enviado com sucesso!');
    } catch (error) {
        responseHandler.error(res, error);
    }
});

/**
 * GET /api/orders/table/:tableId
 * Busca pedidos de uma mesa específica (cliente pode ver seus pedidos)
 */
router.get('/api/orders/table/:tableId', async (req, res) => {
    try {
        const { tableId } = req.params;
        const orders = await orderService.getOrdersByTable(parseInt(tableId));
        responseHandler.success(res, orders);
    } catch (error) {
        responseHandler.error(res, error);
    }
});

// ============================================================
// ROTAS PROTEGIDAS (FUNCIONÁRIOS)
// ============================================================

/**
 * GET /api/orders/active
 * Lista pedidos ativos para o dashboard
 */
router.get('/api/orders/active', authenticate, async (req, res) => {
    try {
        const orders = await orderService.getActiveOrders();
        responseHandler.success(res, orders, 'Pedidos ativos');
    } catch (error) {
        responseHandler.error(res, error);
    }
});

/**
 * GET /api/orders
 * Lista todos os pedidos com filtros
 */
router.get('/api/orders', authenticate, async (req, res) => {
    try {
        const { status, tableId, startDate, endDate, limit } = req.query;
        const orders = await orderService.getAllOrders({
            status,
            tableId: tableId ? parseInt(tableId) : null,
            startDate,
            endDate,
            limit: limit ? parseInt(limit) : 50
        });
        responseHandler.success(res, orders);
    } catch (error) {
        responseHandler.error(res, error);
    }
});

/**
 * GET /api/orders/stats
 * Estatísticas do dia
 */
router.get('/api/orders/stats', authenticate, async (req, res) => {
    try {
        const stats = await orderService.getTodayStats();
        responseHandler.success(res, stats, 'Estatísticas do dia');
    } catch (error) {
        responseHandler.error(res, error);
    }
});

/**
 * GET /api/orders/:id
 * Busca pedido por ID
 */
router.get('/api/orders/:id', authenticate, async (req, res) => {
    try {
        const order = await orderService.getOrderById(parseInt(req.params.id));

        if (!order) {
            return responseHandler.notFound(res, 'Pedido não encontrado');
        }

        responseHandler.success(res, order);
    } catch (error) {
        responseHandler.error(res, error);
    }
});

/**
 * PUT /api/orders/:id/status
 * Atualiza status do pedido
 */
router.put('/api/orders/:id/status', authenticate, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return responseHandler.badRequest(res, 'Status é obrigatório');
        }

        const order = await orderService.updateStatus(
            parseInt(req.params.id),
            status
        );

        responseHandler.success(res, order, 'Status atualizado');
    } catch (error) {
        responseHandler.error(res, error);
    }
});

/**
 * PUT /api/orders/:id/cancel
 * Cancela pedido
 */
router.put('/api/orders/:id/cancel', authenticate, async (req, res) => {
    try {
        const order = await orderService.cancelOrder(parseInt(req.params.id));
        responseHandler.success(res, order, 'Pedido cancelado');
    } catch (error) {
        responseHandler.error(res, error);
    }
});

module.exports = router;
