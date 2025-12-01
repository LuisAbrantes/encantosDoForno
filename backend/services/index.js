/**
 * Exportação centralizada dos serviços
 * Facilita imports e manutenção
 */

const productService = require('./productService');
const scheduleService = require('./scheduleService');
const employeeService = require('./employeeService');
const productClassService = require('./productClassService');

module.exports = {
    productService,
    scheduleService,
    employeeService,
    productClassService
};
