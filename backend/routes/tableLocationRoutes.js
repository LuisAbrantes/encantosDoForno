const express = require('express');
const router = express.Router();
const tableLocationService = require('../services/tableLocationService');
const { responseHandler } = require('../utils/responseHandler');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// ============================================================
// ROTAS PÚBLICAS (com autenticação)
// ============================================================

/**
 * @route   GET /api/table-locations
 * @desc    Retorna todas as localizações ativas
 */
router.get('/api/table-locations', authenticateToken, async (req, res) => {
    try {
        const onlyActive = req.query.active !== 'false';
        const locations = await tableLocationService.findAll(onlyActive);
        return responseHandler.success(res, locations);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   GET /api/table-locations/:id
 * @desc    Retorna uma localização por ID
 */
router.get('/api/table-locations/:id', authenticateToken, async (req, res) => {
    try {
        const location = await tableLocationService.findById(req.params.id);
        return responseHandler.success(res, location);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

// ============================================================
// ROTAS ADMINISTRATIVAS
// ============================================================

/**
 * @route   POST /api/table-locations
 * @desc    Cria nova localização
 */
router.post(
    '/api/table-locations',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const location = await tableLocationService.create(req.body);
            return responseHandler.created(
                res,
                location,
                'Localização criada com sucesso'
            );
        } catch (err) {
            return responseHandler.error(res, err);
        }
    }
);

/**
 * @route   PUT /api/table-locations/:id
 * @desc    Atualiza uma localização
 */
router.put(
    '/api/table-locations/:id',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const location = await tableLocationService.update(
                req.params.id,
                req.body
            );
            return responseHandler.success(
                res,
                location,
                'Localização atualizada com sucesso'
            );
        } catch (err) {
            return responseHandler.error(res, err);
        }
    }
);

/**
 * @route   DELETE /api/table-locations/:id
 * @desc    Exclui uma localização
 */
router.delete(
    '/api/table-locations/:id',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            await tableLocationService.delete(req.params.id);
            return responseHandler.success(
                res,
                null,
                'Localização excluída com sucesso'
            );
        } catch (err) {
            return responseHandler.error(res, err);
        }
    }
);

/**
 * @route   PUT /api/table-locations/order
 * @desc    Atualiza ordem de exibição
 */
router.put(
    '/api/table-locations/order',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { orderedIds } = req.body;
            const locations = await tableLocationService.updateOrder(
                orderedIds
            );
            return responseHandler.success(
                res,
                locations,
                'Ordem atualizada com sucesso'
            );
        } catch (err) {
            return responseHandler.error(res, err);
        }
    }
);

/**
 * @route   POST /api/table-locations/seed
 * @desc    Cria localizações padrão (dev)
 */
router.post(
    '/api/table-locations/seed',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            await tableLocationService.seedDefaults();
            const locations = await tableLocationService.findAll();
            return responseHandler.success(
                res,
                locations,
                'Localizações padrão criadas'
            );
        } catch (err) {
            return responseHandler.error(res, err);
        }
    }
);

module.exports = router;
