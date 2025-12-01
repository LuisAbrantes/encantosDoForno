const BaseService = require('./baseService');
const Product = require('../Data/Tables/Products');

class ProductService extends BaseService {
    constructor() {
        super(Product);
    }

    /**
     * Formata os dados do produto para o banco
     */
    formatProductData(data) {
        return {
            Product_Name: data.Product_Name,
            Product_Price: data.Product_Price,
            Product_Weight: data.Product_Weight,
            productClassId: Number(data.Product_Class || data.productClassId)
        };
    }

    async create(data) {
        const formattedData = this.formatProductData(data);
        return await super.create(formattedData);
    }

    async update(id, data) {
        const formattedData = this.formatProductData(data);
        return await super.update(id, formattedData);
    }

    async findByClass(classId) {
        return await this.findAll({
            where: { productClassId: Number(classId) }
        });
    }

    async findAllSorted(order = 'ASC', classId = null) {
        const options = {
            order: [['Product_Price', order]]
        };

        if (classId) {
            options.where = { productClassId: Number(classId) };
        }

        return await this.findAll(options);
    }
}

module.exports = new ProductService();
