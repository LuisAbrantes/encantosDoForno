const express = require("express");
const router = express.Router();

//? TABLES REQUIREMENT
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

//? GET ALL PRODUCTS
//! FILTERED CLASS
router.get("/api/products/:class", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      where: { Product_Class: `${req.params.class}` },
    });
    res.json(FilteredProductTypeData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//? GET ALL PRODUCTS
//! FILTERED PRICE LOW↓ TO HIGH↑
router.get("/api/products/order/lowtohigh", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      order: [["Product_Price", "ASC"]],
    });
    res.json(FilteredProductTypeData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//? GET ALL PRODUCTS
//! FILTERED PRICE HIGH↑ TO LOW↓
router.get("/api/products/order/hightolow", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      order: [["Product_Price", "DESC"]],
    });
    res.json(FilteredProductTypeData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//? GET ALL PRODUCTS
//! FILTERED PRICE LOW↓ TO HIGH↑ & CLASS
router.get("/api/products/order/lowtohigh/:class", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      where: {
        Product_Class: `${req.params.class}`,
      },
      order: [["Product_Price", "ASC"]],
    });
    res.json(FilteredProductTypeData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//? GET ALL PRODUCTS
//! FILTERED PRICE HIGH↑ TO LOW↓ & CLASS
router.get("/api/products/order/hightolow/:class", async (req, res) => {
  try {
    const FilteredProductTypeData = await Products.findAll({
      where: {
        Product_Class: `${req.params.class}`,
      },
      order: [["Product_Price", "DESC"]],
    });
    res.json(FilteredProductTypeData);
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

//? GET ALL SCHEDULES
router.get("/api/schedules", async (req, res) => {
  try {
    const AllSchedulesData = await Schedules.findAll();
    res.json(AllSchedulesData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//? GET ALL SCHEDULES
//! FILTERED DATA LOW↓ TO HIGH↑
router.get("/api/schedules/order/lowtohigh", async (req, res) => {
  try {
    const AllSchedulesData = await Schedules.findAll({
      order: [["Date", "ASC"]],
    });
    res.json(AllSchedulesData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//? GET ALL SCHEDULES
//! FILTERED DATA HIGH↑ TO LOW↓
router.get("/api/schedules/order/hightolow", async (req, res) => {
  try {
    const AllSchedulesData = await Schedules.findAll({
      order: [["Date", "DESC"]],
    });
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

//? GET ALL LINE
//! FILTERED POSITION HIGH↑ TO LOW↓
router.get("/api/line/order/hightolow", async (req, res) => {
  try {
    const AllLineData = await Line.findAll({ order: [["Position", "DESC"]] });
    res.json(AllLineData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

//? GET ALL LINE
//! FILTERED POSITION LOW↓ TO HIGH↑
router.get("/api/line/order/lowtohigh", async (req, res) => {
  try {
    const AllLineData = await Line.findAll({ order: [["Position", "ASC"]] });
    res.json(AllLineData);
  } catch (ERR) {
    console.error(ERR);
    res.send(ERR);
  }
});

module.exports = router;
