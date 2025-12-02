const { DataTypes } = require('sequelize');
const database = require('../config');

// ============================================================
// CONSTANTES
// ============================================================
const TABLE_STATUS = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    RESERVED: 'reserved',
    MAINTENANCE: 'maintenance'
};

// ============================================================
// MODELO
// ============================================================

/**
 * Modelo de Mesas do Restaurante
 * Gerencia as mesas físicas e sua disponibilidade
 */
const RestaurantTables = database.define(
    'RestaurantTables',
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        table_number: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: 'Número da mesa é obrigatório' }
            }
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: 'Capacidade mínima é 1 pessoa'
                },
                max: {
                    args: [20],
                    msg: 'Capacidade máxima é 20 pessoas'
                }
            }
        },
        status: {
            type: DataTypes.ENUM(Object.values(TABLE_STATUS)),
            defaultValue: TABLE_STATUS.AVAILABLE,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Localização da mesa: interno, externo, varanda, etc.'
        },
        current_queue_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Queues',
                key: 'id'
            }
        },
        occupied_since: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['status'] }, { fields: ['capacity'] }]
    }
);

// ============================================================
// MÉTODOS DE INSTÂNCIA
// ============================================================

/**
 * Calcula quanto tempo a mesa está ocupada em minutos
 * @returns {number|null} Minutos ocupada ou null se disponível
 */
RestaurantTables.prototype.getOccupiedTimeMinutes = function () {
    if (!this.occupied_since || this.status !== TABLE_STATUS.OCCUPIED) {
        return null;
    }
    const now = new Date();
    const since = new Date(this.occupied_since);
    return Math.round((now - since) / (1000 * 60));
};

/**
 * Ocupa a mesa com um cliente da fila
 * @param {number} queueId - ID do cliente na fila
 * @param {Transaction} transaction - Transação Sequelize opcional
 */
RestaurantTables.prototype.occupy = async function (
    queueId,
    transaction = null
) {
    this.status = TABLE_STATUS.OCCUPIED;
    this.current_queue_id = queueId;
    this.occupied_since = new Date();
    await this.save({ transaction });
};

/**
 * Libera a mesa
 */
RestaurantTables.prototype.release = async function () {
    this.status = TABLE_STATUS.AVAILABLE;
    this.current_queue_id = null;
    this.occupied_since = null;
    await this.save();
};

/**
 * Coloca mesa em manutenção
 */
RestaurantTables.prototype.setMaintenance = async function () {
    this.status = TABLE_STATUS.MAINTENANCE;
    this.current_queue_id = null;
    this.occupied_since = null;
    await this.save();
};

/**
 * Verifica se a mesa comporta o grupo
 * @param {number} partySize - Tamanho do grupo
 * @returns {boolean}
 */
RestaurantTables.prototype.canAccommodate = function (partySize) {
    return this.capacity >= partySize && this.status === TABLE_STATUS.AVAILABLE;
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = RestaurantTables;
module.exports.TABLE_STATUS = TABLE_STATUS;
