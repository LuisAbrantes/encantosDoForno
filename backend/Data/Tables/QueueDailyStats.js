const { DataTypes } = require('sequelize');
const database = require('../config');

// ============================================================
// MODELO: MÉTRICAS DIÁRIAS DA FILA
// ============================================================

/**
 * Armazena métricas agregadas por dia
 * Permite análise histórica sem manter dados individuais indefinidamente
 *
 * Fluxo:
 * 1. Ao final do dia (ou fechamento), agrega dados da tabela Queue
 * 2. Salva resumo nesta tabela
 * 3. Deleta entradas individuais antigas da Queue
 */
const QueueDailyStats = database.define(
    'QueueDailyStats',
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },

        // ========================================
        // IDENTIFICAÇÃO
        // ========================================
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Data das métricas (YYYY-MM-DD)'
        },

        // ========================================
        // CONTAGENS
        // ========================================
        total_customers: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Total de clientes que entraram na fila'
        },
        seated_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Clientes que foram sentados'
        },
        no_show_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Clientes que não compareceram'
        },
        cancelled_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Clientes que cancelaram/saíram da fila'
        },

        // ========================================
        // MÉTRICAS DE TEMPO
        // ========================================
        avg_wait_minutes: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
            comment: 'Tempo médio de espera dos clientes sentados (minutos)'
        },
        max_wait_minutes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Maior tempo de espera do dia (minutos)'
        },
        min_wait_minutes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Menor tempo de espera do dia (minutos)'
        },

        // ========================================
        // ANÁLISE DE PICO
        // ========================================
        peak_hour: {
            type: DataTypes.STRING(5),
            allowNull: true,
            comment: 'Horário de pico (HH:MM) - mais entradas na fila'
        },
        peak_queue_size: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Tamanho máximo da fila no dia'
        },

        // ========================================
        // ANÁLISE DE GRUPOS
        // ========================================
        avg_party_size: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
            comment: 'Tamanho médio dos grupos'
        },
        total_people_served: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment:
                'Total de pessoas atendidas (soma de party_size dos seated)'
        },

        // ========================================
        // TAXAS CALCULADAS
        // ========================================
        no_show_rate: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
            comment: 'Taxa de no-show (%) = no_show / total * 100'
        },
        cancellation_rate: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
            comment: 'Taxa de cancelamento (%) = cancelled / total * 100'
        },
        conversion_rate: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
            comment: 'Taxa de conversão (%) = seated / total * 100'
        }
    },
    {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['date']
            },
            {
                fields: ['date'],
                name: 'idx_queue_daily_stats_date'
            }
        ]
    }
);

// ============================================================
// MÉTODOS ESTÁTICOS
// ============================================================

/**
 * Busca métricas de um período
 * @param {Date} startDate - Data inicial
 * @param {Date} endDate - Data final
 * @returns {Promise<Array>} Lista de métricas diárias
 */
QueueDailyStats.getByPeriod = async function (startDate, endDate) {
    const { Op } = require('sequelize');

    return QueueDailyStats.findAll({
        where: {
            date: {
                [Op.between]: [startDate, endDate]
            }
        },
        order: [['date', 'DESC']]
    });
};

/**
 * Busca métricas dos últimos N dias
 * @param {number} days - Número de dias
 * @returns {Promise<Array>} Lista de métricas diárias
 */
QueueDailyStats.getLastDays = async function (days = 30) {
    const { Op } = require('sequelize');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return QueueDailyStats.findAll({
        where: {
            date: {
                [Op.gte]: startDate.toISOString().split('T')[0]
            }
        },
        order: [['date', 'DESC']]
    });
};

/**
 * Calcula médias de um período
 * @param {number} days - Número de dias para calcular
 * @returns {Promise<Object>} Médias agregadas
 */
QueueDailyStats.getAverages = async function (days = 30) {
    const stats = await QueueDailyStats.getLastDays(days);

    if (stats.length === 0) {
        return {
            avgCustomersPerDay: 0,
            avgWaitTime: 0,
            avgNoShowRate: 0,
            avgConversionRate: 0,
            totalDays: 0
        };
    }

    const totals = stats.reduce(
        (acc, day) => ({
            customers: acc.customers + day.total_customers,
            waitTime: acc.waitTime + day.avg_wait_minutes,
            noShowRate: acc.noShowRate + day.no_show_rate,
            conversionRate: acc.conversionRate + day.conversion_rate
        }),
        { customers: 0, waitTime: 0, noShowRate: 0, conversionRate: 0 }
    );

    const count = stats.length;

    return {
        avgCustomersPerDay: Math.round(totals.customers / count),
        avgWaitTime: Math.round(totals.waitTime / count),
        avgNoShowRate: (totals.noShowRate / count).toFixed(1),
        avgConversionRate: (totals.conversionRate / count).toFixed(1),
        totalDays: count
    };
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = QueueDailyStats;
