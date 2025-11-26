//? FRAMEWORKS REQUIREMENT
const express = require("express");
const router = express.Router();

//? TABLES REQUIREMENT
const Employees = require("../Data/Tables/Employees");
const Products = require("../Data/Tables/Products");
const Schedules = require("../Data/Tables/Schedules");
const ProductClasses = require("../Data/Tables/ProductClass");
const { where } = require("sequelize");

//? DELETE PRODUCT
router.delete("/delete/product/:id", async (req, res) => {
  try {
    const DeleteProduct = await Products.destroy({
      where: { id: req.params.id },
    });
  } catch (ERR) {
    console.error(ERR);
  }
});

//? DELETE SCHEDULE
router.delete("/delete/schedule/:id", async (req, res) => {
  try {
    const DeleteSchedule = await Schedules.destroy({
      where: { id: req.params.id },
    });
  } catch (ERR) {
    console.error(ERR);
  }
});

//? DELETE PRODUCT CLASS
router.delete("/delete/class/:id", async (req, res) => {
  try {
    const DeleteSchedule = await ProductClasses.destroy({
      where: { id: req.params.id },
    });
  } catch (ERR) {
    console.error(ERR);
  }
});

//? DELETE SCHEDULE
router.delete("/delete/employed/:id", async (req, res) => {
  try {
    const DeleteSchedule = await Employees.destroy({
      where: { id: req.params.id },
    });
  } catch (ERR) {
    console.error(ERR);
  }
});

module.exports = router;
