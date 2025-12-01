/**
 * Serviço base genérico para operações CRUD
 * Seguindo o princípio DRY - todas as entidades usam as mesmas operações
 */

class BaseService {
    constructor(model) {
        this.model = model;
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        const [updatedCount] = await this.model.update(data, {
            where: { id }
        });
        return updatedCount;
    }

    async delete(id) {
        const deletedCount = await this.model.destroy({
            where: { id }
        });
        return deletedCount;
    }
}

module.exports = BaseService;
