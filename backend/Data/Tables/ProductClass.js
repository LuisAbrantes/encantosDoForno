// models/ProductClasses.js
const { DataTypes } = require('sequelize');
const database = require('../config');

const ProductClasses = database.define('ProductClasses', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Icon: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '🍽️'
    }
});

module.exports = ProductClasses;
