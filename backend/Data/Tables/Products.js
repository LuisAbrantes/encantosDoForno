const { DataTypes } = require("sequelize");
const database = require("../config");
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
  Product_Class: {
    type: DataTypes.ENUM("Prato Feito", "Sobremesa", "ETC", "..."),
    allowNull: false,
  },
});

module.exports = Products;
