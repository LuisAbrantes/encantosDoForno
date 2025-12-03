/**
 * Configuração das associações entre modelos
 * Este arquivo define os relacionamentos do banco de dados
 */

const Queue = require('./Tables/Queue');
const RestaurantTables = require('./Tables/RestaurantTables');
const Employees = require('./Tables/Employees');
const Order = require('./Tables/Order');
const OrderItem = require('./Tables/OrderItem');
const Product = require('./Tables/Products');

/**
 * Configura todas as associações entre modelos
 */
const setupAssociations = () => {
    // Queue -> RestaurantTables (mesa atual do cliente)
    Queue.belongsTo(RestaurantTables, {
        foreignKey: 'table_id',
        as: 'table'
    });

    // Queue -> Employees (funcionário que adicionou)
    Queue.belongsTo(Employees, {
        foreignKey: 'created_by',
        as: 'createdByEmployee'
    });

    // RestaurantTables -> Queue (cliente atual na mesa)
    RestaurantTables.belongsTo(Queue, {
        foreignKey: 'current_queue_id',
        as: 'currentCustomer'
    });

    // RestaurantTables -> Queue (histórico de clientes)
    RestaurantTables.hasMany(Queue, {
        foreignKey: 'table_id',
        as: 'queueHistory'
    });

    // ============================================================
    // ASSOCIAÇÕES DE PEDIDOS
    // ============================================================

    // Order -> RestaurantTables
    Order.belongsTo(RestaurantTables, {
        foreignKey: 'table_id',
        as: 'table'
    });

    // RestaurantTables -> Orders
    RestaurantTables.hasMany(Order, {
        foreignKey: 'table_id',
        as: 'orders'
    });

    // Order -> OrderItems
    Order.hasMany(OrderItem, {
        foreignKey: 'order_id',
        as: 'items',
        onDelete: 'CASCADE'
    });

    // OrderItem -> Order
    OrderItem.belongsTo(Order, {
        foreignKey: 'order_id',
        as: 'order'
    });

    // OrderItem -> Product
    OrderItem.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product'
    });

    // Product -> OrderItems
    Product.hasMany(OrderItem, {
        foreignKey: 'product_id',
        as: 'orderItems'
    });
};

module.exports = setupAssociations;
