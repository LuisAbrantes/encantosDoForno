/**
 * Exportação centralizada de todos os middlewares
 */
const {
    generateToken,
    authenticateToken,
    authenticate,
    requireAdmin,
    JWT_SECRET
} = require('./auth');
const {
    rateLimitMiddleware,
    strictRateLimiter,
    defaultRateLimiter
} = require('./rateLimiter');
const {
    errorHandler,
    notFoundHandler,
    asyncHandler
} = require('./errorHandler');

module.exports = {
    // Autenticação
    generateToken,
    authenticateToken,
    authenticate,
    requireAdmin,
    JWT_SECRET,

    // Rate Limiting
    rateLimitMiddleware,
    strictRateLimiter,
    defaultRateLimiter,

    // Error Handling
    errorHandler,
    notFoundHandler,
    asyncHandler
};
