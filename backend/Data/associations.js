/**
 * Configuração das associações entre modelos
 * Este arquivo define os relacionamentos do banco de dados
 */

const Queue = require('./Tables/Queue');
const RestaurantTables = require('./Tables/RestaurantTables');
const Employees = require('./Tables/Employees');

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
};

module.exports = setupAssociations;
