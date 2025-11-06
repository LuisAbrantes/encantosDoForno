const { DataTypes } = require("sequelize");
const database = require("../config");
const Line = database.define("Line", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  Position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Peoples: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Line;
