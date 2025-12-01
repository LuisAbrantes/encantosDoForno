const BaseService = require('./baseService');
const ProductClass = require('../Data/Tables/ProductClass');

class ProductClassService extends BaseService {
    constructor() {
        super(ProductClass);
    }

    /**
     * Formata os dados da classe de produto para o banco
     */
    formatProductClassData(data) {
        return {
            Name: data.Name,
            Icon: data.Icon || '🍽️'
        };
    }

    async create(data) {
        const formattedData = this.formatProductClassData(data);
        return await super.create(formattedData);
    }

    async update(id, data) {
        const formattedData = this.formatProductClassData(data);
        return await super.update(id, formattedData);
    }
}

module.exports = new ProductClassService();
