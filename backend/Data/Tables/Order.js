const { DataTypes } = require('sequelize');
const database = require('../config');

// ============================================================
// CONSTANTES
// ============================================================
const ORDER_STATUS = Object.freeze({
    PENDING: 'pending',
    PREPARING: 'preparing',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
});

// ============================================================
// MODELO
// ============================================================

/**
 * Modelo de Pedido
 * Representa um pedido feito por um cliente presencial
 */
const Order = database.define(
    'Order',
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        table_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'RestaurantTables',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM(Object.values(ORDER_STATUS)),
            defaultValue: ORDER_STATUS.PENDING,
            allowNull: false
        },
        customer_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Nome opcional do cliente'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Observações gerais do pedido'
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        delivered_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Data/hora da entrega'
        }
    },
    {
        timestamps: true,
        indexes: [
            { name: 'idx_orders_table_id', fields: ['table_id'] },
            { name: 'idx_orders_status', fields: ['status'] },
            { name: 'idx_orders_created_at', fields: ['createdAt'] }
        ]
    }
);

// ============================================================
// MÉTODOS DE INSTÂNCIA
// ============================================================

/**
 * Atualiza o status do pedido
 * @param {string} newStatus - Novo status
 */
Order.prototype.updateStatus = async function (newStatus) {
    if (!Object.values(ORDER_STATUS).includes(newStatus)) {
        throw new Error('Status inválido');
    }
    this.status = newStatus;

    // Registra data/hora da entrega
    if (newStatus === ORDER_STATUS.DELIVERED) {
        this.delivered_at = new Date();
    }

    await this.save();
};

/**
 * Cancela o pedido
 */
Order.prototype.cancel = async function () {
    this.status = ORDER_STATUS.CANCELLED;
    await this.save();
};

/**
 * Verifica se o pedido pode ser modificado
 */
Order.prototype.canBeModified = function () {
    return this.status === ORDER_STATUS.PENDING;
};

/**
 * Calcula tempo desde a criação em minutos
 */
Order.prototype.getElapsedMinutes = function () {
    const now = new Date();
    const created = new Date(this.createdAt);
    return Math.round((now - created) / (1000 * 60));
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = Order;
module.exports.ORDER_STATUS = ORDER_STATUS;
