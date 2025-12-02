const { DataTypes } = require('sequelize');
const database = require('../config');

// ============================================================
// CONSTANTES
// ============================================================
const DEFAULT_SETTINGS = Object.freeze({
    MAX_QUEUE_SIZE: 50,
    AVERAGE_TURNOVER_MINUTES: 45,
    ESTIMATED_TIME_PER_PERSON: 3,
    OPENING_TIME: '11:00',
    CLOSING_TIME: '22:00',
    MAX_WAIT_HOURS: 4, // Tempo máximo na fila antes de expirar
    CALL_TIMEOUT_MINUTES: 30, // Tempo máximo após ser chamado sem resposta
    HISTORY_RETENTION_HOURS: 48 // Tempo para manter entradas finalizadas antes de deletar
});

// ============================================================
// MODELO
// ============================================================

/**
 * Modelo de Configurações da Fila
 * Gerencia parâmetros de funcionamento da fila de espera
 */
const QueueSettings = database.define(
    'QueueSettings',
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        max_queue_size: {
            type: DataTypes.INTEGER,
            defaultValue: DEFAULT_SETTINGS.MAX_QUEUE_SIZE,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: 'Tamanho máximo da fila deve ser pelo menos 1'
                }
            }
        },
        average_turnover_minutes: {
            type: DataTypes.INTEGER,
            defaultValue: DEFAULT_SETTINGS.AVERAGE_TURNOVER_MINUTES,
            allowNull: false,
            comment: 'Tempo médio que um cliente fica na mesa (em minutos)'
        },
        estimated_time_per_person: {
            type: DataTypes.INTEGER,
            defaultValue: DEFAULT_SETTINGS.ESTIMATED_TIME_PER_PERSON,
            allowNull: false,
            comment:
                'Minutos adicionais por pessoa no grupo para cálculo de espera'
        },
        is_queue_open: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
            comment: 'Se a fila está aberta para novos clientes'
        },
        opening_time: {
            type: DataTypes.STRING(5),
            defaultValue: DEFAULT_SETTINGS.OPENING_TIME,
            allowNull: false,
            comment: 'Horário de abertura no formato HH:MM'
        },
        closing_time: {
            type: DataTypes.STRING(5),
            defaultValue: DEFAULT_SETTINGS.CLOSING_TIME,
            allowNull: false,
            comment: 'Horário de fechamento no formato HH:MM'
        },
        auto_close_before_closing: {
            type: DataTypes.INTEGER,
            defaultValue: 30,
            allowNull: false,
            comment:
                'Minutos antes do fechamento para parar de aceitar clientes'
        },
        whatsapp_notification_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        whatsapp_message_template: {
            type: DataTypes.TEXT,
            defaultValue:
                'Olá {name}! Sua mesa no Encantos do Forno está pronta. Por favor, dirija-se ao restaurante.',
            allowNull: true,
            comment:
                'Template de mensagem para WhatsApp. Use {name} para nome do cliente.'
        },
        max_wait_hours: {
            type: DataTypes.INTEGER,
            defaultValue: DEFAULT_SETTINGS.MAX_WAIT_HOURS,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: 'Tempo máximo de espera deve ser pelo menos 1 hora'
                },
                max: {
                    args: [24],
                    msg: 'Tempo máximo de espera não pode exceder 24 horas'
                }
            },
            comment:
                'Tempo máximo em horas que uma entrada pode ficar na fila antes de expirar'
        },
        call_timeout_minutes: {
            type: DataTypes.INTEGER,
            defaultValue: DEFAULT_SETTINGS.CALL_TIMEOUT_MINUTES,
            allowNull: false,
            validate: {
                min: {
                    args: [5],
                    msg: 'Timeout de chamada deve ser pelo menos 5 minutos'
                },
                max: {
                    args: [120],
                    msg: 'Timeout de chamada não pode exceder 120 minutos'
                }
            },
            comment:
                'Tempo em minutos que cliente tem para responder após ser chamado'
        },
        history_retention_hours: {
            type: DataTypes.INTEGER,
            defaultValue: DEFAULT_SETTINGS.HISTORY_RETENTION_HOURS,
            allowNull: false,
            validate: {
                min: {
                    args: [24],
                    msg: 'Retenção deve ser pelo menos 24 horas'
                },
                max: {
                    args: [168],
                    msg: 'Retenção não pode exceder 168 horas (7 dias)'
                }
            },
            comment:
                'Horas para manter entradas finalizadas antes de deletar automaticamente'
        }
    },
    {
        timestamps: true
    }
);

// ============================================================
// MÉTODOS ESTÁTICOS
// ============================================================

/**
 * Obtém as configurações atuais (singleton pattern)
 * Cria configurações padrão se não existirem
 * @returns {Promise<QueueSettings>}
 */
QueueSettings.getSettings = async function () {
    let settings = await QueueSettings.findOne();

    if (!settings) {
        settings = await QueueSettings.create({});
    }

    return settings;
};

// ============================================================
// MÉTODOS DE INSTÂNCIA
// ============================================================

/**
 * Verifica se a fila está aberta baseado no horário atual
 * @returns {boolean}
 */
QueueSettings.prototype.isOpenNow = function () {
    if (!this.is_queue_open) return false;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
    ).padStart(2, '0')}`;

    // Calcula horário de parada (X minutos antes do fechamento)
    const [closeHour, closeMin] = this.closing_time.split(':').map(Number);
    const closeDate = new Date();
    closeDate.setHours(closeHour, closeMin - this.auto_close_before_closing, 0);
    const stopTime = `${String(closeDate.getHours()).padStart(2, '0')}:${String(
        closeDate.getMinutes()
    ).padStart(2, '0')}`;

    return currentTime >= this.opening_time && currentTime <= stopTime;
};

/**
 * Gera mensagem de WhatsApp personalizada
 * @param {string} customerName - Nome do cliente
 * @returns {string}
 */
QueueSettings.prototype.generateWhatsAppMessage = function (customerName) {
    return this.whatsapp_message_template.replace('{name}', customerName);
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = QueueSettings;
module.exports.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
