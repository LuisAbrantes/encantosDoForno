const BaseService = require('./baseService');
const Schedule = require('../Data/Tables/Schedules');

class ScheduleService extends BaseService {
    constructor() {
        super(Schedule);
    }

    /**
     * Formata os dados do agendamento para o banco
     */
    formatScheduleData(data) {
        return {
            Date: data.Date,
            HM_Peoples: data.Peoples || data.HM_Peoples,
            Number_to_Contact: data.Number || data.Number_to_Contact
        };
    }

    async create(data) {
        const formattedData = this.formatScheduleData(data);
        return await super.create(formattedData);
    }

    async update(id, data) {
        const formattedData = this.formatScheduleData(data);
        return await super.update(id, formattedData);
    }

    async findAllSorted(order = 'ASC') {
        return await this.findAll({
            order: [['Date', order]]
        });
    }
}

module.exports = new ScheduleService();
