const { DataTypes } = require('sequelize');
const database = require('../config');

/**
 * Modelo de Item do Pedido
 * Representa um produto dentro de um pedido
 */
const OrderItem = database.define(
    'OrderItem',
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: {
                    args: [1],
                    msg: 'Quantidade deve ser pelo menos 1'
                },
                max: {
                    args: [99],
                    msg: 'Quantidade máxima é 99'
                }
            }
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Preço unitário no momento do pedido'
        },
        notes: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Observações do item (ex: sem cebola)'
        }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['order_id'] }, { fields: ['product_id'] }]
    }
);

/**
 * Calcula o subtotal do item
 */
OrderItem.prototype.getSubtotal = function () {
    return this.quantity * parseFloat(this.unit_price);
};

module.exports = OrderItem;
