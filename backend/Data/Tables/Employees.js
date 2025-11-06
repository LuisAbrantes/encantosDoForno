const { DataTypes } = require("sequelize");
const database = require("../config");
const Employees = database.define("Employees", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  Employed_Email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Employed_Password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Employees;
