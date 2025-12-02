const TableLocations = require('../Data/Tables/TableLocations');
const { ApiError } = require('../utils/responseHandler');
const { MESSAGES } = require('../utils/constants');

// ============================================================
// CONSTANTES DE ERRO
// ============================================================
const LOCATION_ERRORS = Object.freeze({
    NOT_FOUND: 'Localização não encontrada',
    NAME_EXISTS: 'Já existe uma localização com este nome',
    NAME_REQUIRED: 'Nome da localização é obrigatório',
    IN_USE: 'Esta localização está sendo usada por mesas e não pode ser excluída'
});

// ============================================================
// SERVIÇO
// ============================================================

const tableLocationService = {
    /**
     * Lista todas as localizações
     * @param {boolean} onlyActive - Se true, retorna apenas ativas
     */
    async findAll(onlyActive = false) {
        const where = onlyActive ? { is_active: true } : {};
        return TableLocations.findAll({
            where,
            order: [
                ['display_order', 'ASC'],
                ['name', 'ASC']
            ]
        });
    },

    /**
     * Busca localização por ID
     */
    async findById(id) {
        const location = await TableLocations.findByPk(id);
        if (!location) {
            throw ApiError.notFound(LOCATION_ERRORS.NOT_FOUND);
        }
        return location;
    },

    /**
     * Cria nova localização
     */
    async create(data) {
        // Validação
        if (!data.name?.trim()) {
            throw ApiError.badRequest(LOCATION_ERRORS.NAME_REQUIRED);
        }

        // Verifica duplicata
        const existing = await TableLocations.findOne({
            where: { name: data.name.trim() }
        });
        if (existing) {
            throw ApiError.conflict(LOCATION_ERRORS.NAME_EXISTS);
        }

        // Define ordem de exibição se não informada
        if (data.display_order === undefined) {
            const maxOrder = (await TableLocations.max('display_order')) || 0;
            data.display_order = maxOrder + 1;
        }

        return TableLocations.create({
            name: data.name.trim(),
            description: data.description?.trim() || null,
            is_active: data.is_active !== false,
            display_order: data.display_order
        });
    },

    /**
     * Atualiza localização
     */
    async update(id, data) {
        const location = await this.findById(id);

        // Verifica duplicata de nome
        if (data.name && data.name !== location.name) {
            const existing = await TableLocations.findOne({
                where: { name: data.name.trim() }
            });
            if (existing) {
                throw ApiError.conflict(LOCATION_ERRORS.NAME_EXISTS);
            }
        }

        // Atualiza campos
        if (data.name) location.name = data.name.trim();
        if (data.description !== undefined)
            location.description = data.description?.trim() || null;
        if (data.is_active !== undefined) location.is_active = data.is_active;
        if (data.display_order !== undefined)
            location.display_order = data.display_order;

        await location.save();
        return location;
    },

    /**
     * Exclui localização
     */
    async delete(id) {
        const location = await this.findById(id);

        // Verifica se está em uso
        const RestaurantTables = require('../Data/Tables/RestaurantTables');
        const tablesUsingLocation = await RestaurantTables.count({
            where: { location: location.name }
        });

        if (tablesUsingLocation > 0) {
            throw ApiError.conflict(LOCATION_ERRORS.IN_USE);
        }

        await location.destroy();
        return { deleted: true };
    },

    /**
     * Atualiza ordem de exibição de múltiplas localizações
     */
    async updateOrder(orderedIds) {
        for (let i = 0; i < orderedIds.length; i++) {
            await TableLocations.update(
                { display_order: i + 1 },
                { where: { id: orderedIds[i] } }
            );
        }
        return this.findAll();
    },

    /**
     * Cria localizações padrão
     */
    async seedDefaults() {
        return TableLocations.seedDefaults();
    }
};

module.exports = tableLocationService;
