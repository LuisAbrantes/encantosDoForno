/**
 * Exportação centralizada de todas as rotas
 * Facilita imports e manutenção no server.js
 */

const productRoutes = require('./productRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const employeeRoutes = require('./employeeRoutes');
const productClassRoutes = require('./productClassRoutes');
const authRoutes = require('./authRoutes');
const queueRoutes = require('./queueRoutes');
const tableRoutes = require('./tableRoutes');
const tableLocationRoutes = require('./tableLocationRoutes');
const orderRoutes = require('./orderRoutes');

module.exports = {
    productRoutes,
    scheduleRoutes,
    employeeRoutes,
    productClassRoutes,
    authRoutes,
    queueRoutes,
    tableRoutes,
    tableLocationRoutes,
    orderRoutes
};
