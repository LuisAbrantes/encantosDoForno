//? FRAMEWORKS REQUIREMENT
const express = require('express');
const router = express.Router();

//? TABLES REQUIREMENT
const Employees = require('../Data/Tables/Employees');
const Products = require('../Data/Tables/Products');
const Schedules = require('../Data/Tables/Schedules');
const ProductClasses = require('../Data/Tables/ProductClass');

//? DELETE PRODUCT
router.delete('/delete/product/:id', async (req, res) => {
    try {
        const deletedCount = await Products.destroy({
            where: { id: req.params.id }
        });
        if (deletedCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Produto não encontrado' });
        }
        res.json({ success: true, message: 'Produto deletado com sucesso' });
    } catch (ERR) {
        console.error(ERR);
        res.status(500).json({ success: false, error: ERR.message });
    }
});

//? DELETE SCHEDULE
router.delete('/delete/schedule/:id', async (req, res) => {
    try {
        const deletedCount = await Schedules.destroy({
            where: { id: req.params.id }
        });
        if (deletedCount === 0) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Agendamento não encontrado'
                });
        }
        res.json({
            success: true,
            message: 'Agendamento deletado com sucesso'
        });
    } catch (ERR) {
        console.error(ERR);
        res.status(500).json({ success: false, error: ERR.message });
    }
});

//? DELETE PRODUCT CLASS
router.delete('/delete/class/:id', async (req, res) => {
    try {
        const deletedCount = await ProductClasses.destroy({
            where: { id: req.params.id }
        });
        if (deletedCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Classe não encontrada' });
        }
        res.json({ success: true, message: 'Classe deletada com sucesso' });
    } catch (ERR) {
        console.error(ERR);
        res.status(500).json({ success: false, error: ERR.message });
    }
});

//? DELETE EMPLOYEE
router.delete('/delete/employed/:id', async (req, res) => {
    try {
        const deletedCount = await Employees.destroy({
            where: { id: req.params.id }
        });
        if (deletedCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Empregado não encontrado' });
        }
        res.json({ success: true, message: 'Empregado deletado com sucesso' });
    } catch (ERR) {
        console.error(ERR);
        res.status(500).json({ success: false, error: ERR.message });
    }
});

module.exports = router;
