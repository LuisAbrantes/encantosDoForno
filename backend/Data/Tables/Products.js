const { DataTypes } = require('sequelize');
const database = require('../config');
const ProductClasses = require('./ProductClass');
const Products = database.define('Products', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    Product_Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Product_Description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Product_Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    Product_Weight: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Product_Image: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL ou emoji do produto'
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Produto em destaque na landing page'
    }
});

Products.belongsTo(ProductClasses, {
    foreignKey: 'productClassId',
    as: 'Class'
});
ProductClasses.hasMany(Products, {
    foreignKey: 'productClassId'
});

module.exports = Products;
