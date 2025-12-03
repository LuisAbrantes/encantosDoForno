/**
 * Exportação centralizada dos serviços
 * Facilita imports e manutenção
 */

const productService = require('./productService');
const scheduleService = require('./scheduleService');
const employeeService = require('./employeeService');
const productClassService = require('./productClassService');
const queueService = require('./queueService');
const tableService = require('./tableService');
const tableLocationService = require('./tableLocationService');
const orderService = require('./orderService');

module.exports = {
    productService,
    scheduleService,
    employeeService,
    productClassService,
    queueService,
    tableService,
    tableLocationService,
    orderService
};
