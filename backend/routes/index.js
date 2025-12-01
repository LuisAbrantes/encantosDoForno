/**
 * Exportação centralizada de todas as rotas
 * Facilita imports e manutenção no server.js
 */

const productRoutes = require('./productRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const employeeRoutes = require('./employeeRoutes');
const productClassRoutes = require('./productClassRoutes');
const authRoutes = require('./authRoutes');

module.exports = {
    productRoutes,
    scheduleRoutes,
    employeeRoutes,
    productClassRoutes,
    authRoutes
};
