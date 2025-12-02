const { DataTypes } = require('sequelize');
const database = require('../config');

// ============================================================
// CONSTANTES
// ============================================================
const QUEUE_STATUS = {
    WAITING: 'waiting',
    CALLED: 'called',
    SEATED: 'seated',
    NO_SHOW: 'no_show',
    CANCELLED: 'cancelled'
};

const QUEUE_PRIORITY = {
    NORMAL: 'normal',
    VIP: 'vip',
    RESERVATION: 'reservation'
};

// ============================================================
// MODELO
// ============================================================

/**
 * Modelo de Fila de Espera
 * Gerencia clientes aguardando mesa no restaurante
 */
const Queue = database.define(
    'Queue',
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        customer_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Nome do cliente é obrigatório' },
                len: {
                    args: [2, 100],
                    msg: 'Nome deve ter entre 2 e 100 caracteres'
                }
            }
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Telefone é obrigatório' }
            }
        },
        party_size: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: 'Quantidade de pessoas deve ser pelo menos 1'
                },
                max: {
                    args: [20],
                    msg: 'Quantidade máxima de pessoas é 20'
                }
            }
        },
        status: {
            type: DataTypes.ENUM(Object.values(QUEUE_STATUS)),
            defaultValue: QUEUE_STATUS.WAITING,
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM(Object.values(QUEUE_PRIORITY)),
            defaultValue: QUEUE_PRIORITY.NORMAL,
            allowNull: false
        },
        estimated_wait_minutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0
            }
        },
        entry_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        called_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        seated_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Employees',
                key: 'id'
            }
        },
        table_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'RestaurantTables',
                key: 'id'
            }
        }
    },
    {
        timestamps: true,
        indexes: [
            { fields: ['status'] },
            { fields: ['entry_time'] },
            { fields: ['phone_number'] }
        ]
    }
);

// ============================================================
// MÉTODOS DE INSTÂNCIA
// ============================================================

/**
 * Calcula o tempo de espera em minutos desde a entrada
 * @returns {number} Minutos de espera
 */
Queue.prototype.getWaitTimeMinutes = function () {
    const now = new Date();
    const entry = new Date(this.entry_time);
    return Math.round((now - entry) / (1000 * 60));
};

/**
 * Marca o cliente como chamado
 */
Queue.prototype.markAsCalled = async function () {
    this.status = QUEUE_STATUS.CALLED;
    this.called_time = new Date();
    await this.save();
};

/**
 * Marca o cliente como sentado
 * @param {number} tableId - ID da mesa
 * @param {Transaction} transaction - Transação Sequelize opcional
 */
Queue.prototype.markAsSeated = async function (tableId, transaction = null) {
    this.status = QUEUE_STATUS.SEATED;
    this.seated_time = new Date();
    this.table_id = tableId;
    await this.save({ transaction });
};

/**
 * Marca como não compareceu
 */
Queue.prototype.markAsNoShow = async function () {
    this.status = QUEUE_STATUS.NO_SHOW;
    await this.save();
};

/**
 * Cancela a entrada na fila
 */
Queue.prototype.cancel = async function () {
    this.status = QUEUE_STATUS.CANCELLED;
    await this.save();
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = Queue;
module.exports.QUEUE_STATUS = QUEUE_STATUS;
module.exports.QUEUE_PRIORITY = QUEUE_PRIORITY;
