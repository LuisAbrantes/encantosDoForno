const { DataTypes } = require('sequelize');
const database = require('../config');

// ============================================================
// MODELO
// ============================================================

/**
 * Modelo de Localizações de Mesa
 * Armazena as localizações possíveis para mesas do restaurante
 */
const TableLocations = database.define(
    'TableLocations',
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: 'Nome da localização é obrigatório' },
                len: {
                    args: [2, 50],
                    msg: 'Nome deve ter entre 2 e 50 caracteres'
                }
            }
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true,
            comment: 'Descrição da área (ex: área com ar condicionado)'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        display_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Ordem de exibição na lista'
        }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['is_active'] }, { fields: ['display_order'] }]
    }
);

// ============================================================
// MÉTODOS ESTÁTICOS
// ============================================================

/**
 * Retorna todas as localizações ativas ordenadas
 */
TableLocations.findAllActive = function () {
    return this.findAll({
        where: { is_active: true },
        order: [
            ['display_order', 'ASC'],
            ['name', 'ASC']
        ]
    });
};

/**
 * Cria localizações padrão se não existirem
 */
TableLocations.seedDefaults = async function () {
    const defaultLocations = [
        {
            name: 'Interno',
            description: 'Área interna climatizada',
            display_order: 1
        },
        {
            name: 'Externo',
            description: 'Área externa ao ar livre',
            display_order: 2
        },
        { name: 'Varanda', description: 'Varanda com vista', display_order: 3 },
        { name: 'VIP', description: 'Área reservada VIP', display_order: 4 },
        { name: 'Mezanino', description: 'Mezanino superior', display_order: 5 }
    ];

    for (const loc of defaultLocations) {
        await this.findOrCreate({
            where: { name: loc.name },
            defaults: loc
        });
    }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = TableLocations;
