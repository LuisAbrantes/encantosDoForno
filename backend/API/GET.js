const express = require("express");
const router = express.Router();

const Employees = require("../Data/Tables/Employees");
const Line = require("../Data/Tables/Line");
const Products = require("../Data/Tables/Products");
const Schedules = require("../Data/Tables/Schedules");

//? GET ALL PRODUCTS
router.get("/api/products", async (req, res) => {
  try {
    const AllProductData = await Products.findAll();
    res.json(AllProductData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//? GET ALL EMPLOYEES
router.get("/api/employees", async (req, res) => {
  try {
    const AllEmployeesData = await Employees.findAll();
    res.json(AllEmployeesData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//?GET ALL SCHEDULES
router.get("/api/schedules", async (req, res) => {
  try {
    const AllSchedulesData = await Schedules.findAll();
    res.json(AllSchedulesData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//? GET ALL LINE
router.get("/api/line", async (req, res) => {
  try {
    const AllLineData = await Line.findAll();
    res.json(AllLineData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

module.exports = router;
