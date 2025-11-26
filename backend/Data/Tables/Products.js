const { DataTypes } = require("sequelize");
const database = require("../config");
const ProductClasses = require("./ProductClass");
const Products = database.define("Products", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  Product_Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Product_Price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Product_Weight: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Products.belongsTo(ProductClasses, {
  foreignKey: "productClassId",
  as: "Class",
});
ProductClasses.hasMany(Products, {
  foreignKey: "productClassId",
});

module.exports = Products;
