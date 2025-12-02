const BaseService = require('./baseService');
const Employee = require('../Data/Tables/Employees');

class EmployeeService extends BaseService {
    constructor() {
        super(Employee);
    }

    /**
     * Formata os dados do funcionário para o banco
     * TODO: Adicionar hash de senha com bcrypt antes de produção
     */
    formatEmployeeData(data) {
        return {
            Employed_Name: data.Employed_Name,
            Employed_Email: data.Employed_Email,
            Employed_Password: data.Employed_Password
        };
    }

    async create(data) {
        const formattedData = this.formatEmployeeData(data);
        return await super.create(formattedData);
    }

    async update(id, data) {
        const formattedData = this.formatEmployeeData(data);
        return await super.update(id, formattedData);
    }
}

module.exports = new EmployeeService();
