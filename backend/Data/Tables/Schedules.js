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
  Number_to_Contact: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  HM_Peoples: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Schedules;
