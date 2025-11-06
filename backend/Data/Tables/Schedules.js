const { DataTypes } = require("sequelize");
const database = require("../config");
const Schedules = database.define("Schedules", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Schedules;
