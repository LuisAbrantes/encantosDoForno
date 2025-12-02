const express = require('express');
const router = express.Router();
const { scheduleService } = require('../services');
const { responseHandler } = require('../utils/responseHandler');
const { MESSAGES } = require('../utils/constants');

/**
 * @route   GET /api/schedules
 * @desc    Retorna todos os agendamentos
 */
router.get('/api/schedules', async (req, res) => {
    try {
        const schedules = await scheduleService.findAll();
        return responseHandler.success(res, schedules);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   GET /api/schedules/order/:direction
 * @desc    Retorna agendamentos ordenados por data (asc/desc)
 */
router.get('/api/schedules/order/:direction', async (req, res) => {
    try {
        const order = req.params.direction === 'desc' ? 'DESC' : 'ASC';
        const schedules = await scheduleService.findAllSorted(order);
        return responseHandler.success(res, schedules);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   POST /api/schedules
 * @desc    Cria um novo agendamento
 */
router.post('/api/schedules', async (req, res) => {
    try {
        const schedule = await scheduleService.create(req.body);
        return responseHandler.created(
            res,
            schedule,
            MESSAGES.SCHEDULE.CREATED
        );
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   PUT /api/schedules/:id
 * @desc    Atualiza um agendamento
 */
router.put('/api/schedules/:id', async (req, res) => {
    try {
        const updatedCount = await scheduleService.update(
            req.params.id,
            req.body
        );

        if (updatedCount === 0) {
            return responseHandler.notFound(res, MESSAGES.SCHEDULE.NOT_FOUND);
        }

        return responseHandler.success(res, null, MESSAGES.SCHEDULE.UPDATED);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

/**
 * @route   DELETE /api/schedules/:id
 * @desc    Deleta um agendamento
 */
router.delete('/api/schedules/:id', async (req, res) => {
    try {
        const deletedCount = await scheduleService.delete(req.params.id);

        if (deletedCount === 0) {
            return responseHandler.notFound(res, MESSAGES.SCHEDULE.NOT_FOUND);
        }

        return responseHandler.success(res, null, MESSAGES.SCHEDULE.DELETED);
    } catch (err) {
        return responseHandler.error(res, err);
    }
});

module.exports = router;
