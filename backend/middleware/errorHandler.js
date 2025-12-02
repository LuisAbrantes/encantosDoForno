const { HTTP_STATUS } = require('../utils/constants');
const { ApiError } = require('../utils/responseHandler');

// ============================================================
// ERROR HANDLER GLOBAL
// ============================================================

/**
 * Middleware de tratamento de erros global
 * Deve ser o último middleware registrado
 */
const errorHandler = (err, req, res, next) => {
    // Se já enviou resposta, passa para o próximo
    if (res.headersSent) {
        return next(err);
    }

    // Log do erro (em produção, use um serviço de logging)
    const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        error: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
        userId: req.user?.id
    };

    // Apenas loga erros internos (500)
    if (!err.statusCode || err.statusCode >= 500) {
        console.error('[Error Handler]:', logData);
    }

    // Determina status code
    let statusCode = HTTP_STATUS.INTERNAL_ERROR;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
    } else if (err.name === 'SequelizeValidationError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = HTTP_STATUS.CONFLICT;
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
    }

    // Resposta padronizada
    const response = {
        success: false,
        error: err.message || 'Erro interno do servidor'
    };

    // Adiciona detalhes em desenvolvimento
    if (process.env.NODE_ENV !== 'production' && err.details) {
        response.details = err.details;
    }

    return res.status(statusCode).json(response);
};

/**
 * Middleware para capturar rotas não encontradas
 */
const notFoundHandler = (req, res) => {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: `Rota não encontrada: ${req.method} ${req.path}`
    });
};

/**
 * Wrapper para async handlers - evita try/catch repetitivo
 * @param {Function} fn - Handler async
 * @returns {Function} Handler com tratamento de erro
 */
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};
