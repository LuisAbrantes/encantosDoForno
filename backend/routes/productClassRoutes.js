const express = require('express');
const router = express.Router();
const { productClassService } = require('../services');
const { responseHandler } = require('../utils/responseHandler');
const { MESSAGES } = require('../utils/constants');

/**
 * @route   GET /api/classes
 * @desc    Retorna todas as classes de produtos
 */
router.get('/api/classes', async (req, res) => {
    try {
        const classes = await productClassService.findAll();
        return responseHandler.success(res, classes);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   POST /api/classes
 * @desc    Cria uma nova classe de produto
 */
router.post('/api/classes', async (req, res) => {
    try {
        const productClass = await productClassService.create(req.body);
        return responseHandler.created(
            res,
            productClass,
            MESSAGES.PRODUCT_CLASS.CREATED
        );
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   PUT /api/classes/:id
 * @desc    Atualiza uma classe de produto
 */
router.put('/api/classes/:id', async (req, res) => {
    try {
        const updatedCount = await productClassService.update(
            req.params.id,
            req.body
        );

        if (updatedCount === 0) {
            return responseHandler.notFound(
                res,
                MESSAGES.PRODUCT_CLASS.NOT_FOUND
            );
        }

        return responseHandler.success(
            res,
            null,
            MESSAGES.PRODUCT_CLASS.UPDATED
        );
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   DELETE /api/classes/:id
 * @desc    Deleta uma classe de produto
 */
router.delete('/api/classes/:id', async (req, res) => {
    try {
        const deletedCount = await productClassService.delete(req.params.id);

        if (deletedCount === 0) {
            return responseHandler.notFound(
                res,
                MESSAGES.PRODUCT_CLASS.NOT_FOUND
            );
        }

        return responseHandler.success(
            res,
            null,
            MESSAGES.PRODUCT_CLASS.DELETED
        );
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

module.exports = router;
