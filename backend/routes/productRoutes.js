const express = require('express');
const router = express.Router();
const { productService } = require('../services');
const { responseHandler } = require('../utils/responseHandler');
const { MESSAGES } = require('../utils/constants');

/**
 * @route   GET /api/products
 * @desc    Retorna todos os produtos
 */
router.get('/api/products', async (req, res) => {
    try {
        const products = await productService.findAll();
        return responseHandler.success(res, products);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   GET /api/products/class/:classId
 * @desc    Retorna produtos filtrados por classe
 */
router.get('/api/products/class/:classId', async (req, res) => {
    try {
        const products = await productService.findByClass(req.params.classId);
        return responseHandler.success(res, products);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   GET /api/products/order/:direction
 * @desc    Retorna produtos ordenados por preço (asc/desc)
 */
router.get('/api/products/order/:direction', async (req, res) => {
    try {
        const order = req.params.direction === 'desc' ? 'DESC' : 'ASC';
        const products = await productService.findAllSorted(order);
        return responseHandler.success(res, products);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   GET /api/products/order/:direction/class/:classId
 * @desc    Retorna produtos ordenados e filtrados por classe
 */
router.get(
    '/api/products/order/:direction/class/:classId',
    async (req, res) => {
        try {
            const order = req.params.direction === 'desc' ? 'DESC' : 'ASC';
            const products = await productService.findAllSorted(
                order,
                req.params.classId
            );
            return responseHandler.success(res, products);
        } catch (err) {
            return responseHandler.error(res, err);
        }
    }
);

/**
 * @route   POST /api/products
 * @desc    Cria um novo produto
 */
router.post('/api/products', async (req, res) => {
    try {
        const product = await productService.create(req.body);
        return responseHandler.created(res, product, MESSAGES.PRODUCT.CREATED);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Atualiza um produto
 */
router.put('/api/products/:id', async (req, res) => {
    try {
        const updatedCount = await productService.update(
            req.params.id,
            req.body
        );

        if (updatedCount === 0) {
            return responseHandler.notFound(res, MESSAGES.PRODUCT.NOT_FOUND);
        }

        return responseHandler.success(res, null, MESSAGES.PRODUCT.UPDATED);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Deleta um produto
 */
router.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedCount = await productService.delete(req.params.id);

        if (deletedCount === 0) {
            return responseHandler.notFound(res, MESSAGES.PRODUCT.NOT_FOUND);
        }

        return responseHandler.success(res, null, MESSAGES.PRODUCT.DELETED);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

module.exports = router;
