const express = require('express');
const router = express.Router();
const { employeeService } = require('../services');
const response = require('../utils/responseHandler');
const { MESSAGES } = require('../utils/constants');

/**
 * @route   GET /api/employees
 * @desc    Retorna todos os funcionários
 */
router.get('/api/employees', async (req, res) => {
    try {
        const employees = await employeeService.findAll();
        return response.success(res, employees);
    } catch (err) {
        return response.error(res, err);
    }
});

/**
 * @route   POST /api/employees
 * @desc    Cria um novo funcionário
 */
router.post('/api/employees', async (req, res) => {
    try {
        const employee = await employeeService.create(req.body);
        return response.created(res, employee, MESSAGES.EMPLOYEE.CREATED);
    } catch (err) {
        return response.error(res, err);
    }
});

/**
 * @route   PUT /api/employees/:id
 * @desc    Atualiza um funcionário
 */
router.put('/api/employees/:id', async (req, res) => {
    try {
        const updatedCount = await employeeService.update(
            req.params.id,
            req.body
        );

        if (updatedCount === 0) {
            return response.notFound(res, MESSAGES.EMPLOYEE.NOT_FOUND);
        }

        return response.success(res, null, MESSAGES.EMPLOYEE.UPDATED);
    } catch (err) {
        return response.error(res, err);
    }
});

/**
 * @route   DELETE /api/employees/:id
 * @desc    Deleta um funcionário
 */
router.delete('/api/employees/:id', async (req, res) => {
    try {
        const deletedCount = await employeeService.delete(req.params.id);

        if (deletedCount === 0) {
            return response.notFound(res, MESSAGES.EMPLOYEE.NOT_FOUND);
        }

        return response.success(res, null, MESSAGES.EMPLOYEE.DELETED);
    } catch (err) {
        return response.error(res, err);
    }
});

module.exports = router;
