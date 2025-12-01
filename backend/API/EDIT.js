//? FRAMEWORKS REQUIREMENT
const express = require('express');
const router = express.Router();

//? TABLES REQUIREMENT
const Employees = require('../Data/Tables/Employees');
const Products = require('../Data/Tables/Products');
const Schedules = require('../Data/Tables/Schedules');
const ProductClasses = require('../Data/Tables/ProductClass');

//? EDIT PRODUCT
router.post('/api/edit/product', async (req, res) => {
    try {
        const [updatedCount] = await Products.update(
            {
                Product_Name: req.body.Product_Name,
                Product_Price: req.body.Product_Price,
                Product_Weight: req.body.Product_Weight,
                productClassId: Number(req.body.Product_Class)
            },
            {
                where: { id: req.body.id }
            }
        );
        if (updatedCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Produto não encontrado' });
        }
        res.json({ success: true, message: 'Produto atualizado com sucesso' });
    } catch (ERR) {
        console.error(ERR);
        res.status(500).json({ success: false, error: ERR.message });
    }
});

//? EDIT SCHEDULE
router.post('/api/edit/schedule', async (req, res) => {
    try {
        const [updatedCount] = await Schedules.update(
            {
                Date: req.body.Date,
                HM_Peoples: req.body.Peoples,
                Number_to_Contact: req.body.Number
            },
            {
                where: { id: req.body.id }
            }
        );
        if (updatedCount === 0) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Agendamento não encontrado'
                });
        }
        res.json({
            success: true,
            message: 'Agendamento atualizado com sucesso'
        });
    } catch (ERR) {
        console.error(ERR);
        res.status(500).json({ success: false, error: ERR.message });
    }
});

//? EDIT PRODUCT CLASS
router.post('/api/edit/class', async (req, res) => {
    try {
        const [updatedCount] = await ProductClasses.update(
            {
                Name: req.body.Name
            },
            {
                where: { id: req.body.id }
            }
        );
        if (updatedCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Classe não encontrada' });
        }
        res.json({ success: true, message: 'Classe atualizada com sucesso' });
    } catch (ERR) {
        console.error(ERR);
        res.status(500).json({ success: false, error: ERR.message });
    }
});

//? EDIT EMPLOYEE
router.post('/api/edit/employed', async (req, res) => {
    try {
        const [updatedCount] = await Employees.update(
            {
                Employed_Name: req.body.Employed_Name,
                Employed_Email: req.body.Employed_Email,
                Employed_Password: req.body.Employed_Password
            },
            {
                where: { id: req.body.id }
            }
        );
        if (updatedCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Empregado não encontrado' });
        }
        res.json({
            success: true,
            message: 'Empregado atualizado com sucesso'
        });
    } catch (ERR) {
        console.error(ERR);
        res.status(500).json({ success: false, error: ERR.message });
    }
});

module.exports = router;
