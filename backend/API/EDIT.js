//? FRAMEWORKS REQUIREMENT
const express = require("express");
const router = express.Router();

//? TABLES REQUIREMENT
const Employees = require("../Data/Tables/Employees");
const Products = require("../Data/Tables/Products");
const Schedules = require("../Data/Tables/Schedules");
const ProductClasses = require("../Data/Tables/ProductClass");
const { where } = require("sequelize");

//? EDIT PRODUCT
router.post("/api/edit/product", async (req, res) => {
  try {
    const EditProduct = await Products.update(
      {
        Product_Name: req.body.Product_Name,
        Product_Price: req.body.Product_Price,
        Product_Weight: req.body.Product_Weight,
        productClassId: req.body.Product_Class,
      },
      {
        where: { id: req.body.id },
      }
    );
    return "OI";
  } catch (ERR) {
    console.error(ERR);
  }
});

module.exports = router;
