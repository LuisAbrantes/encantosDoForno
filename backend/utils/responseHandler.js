const { HTTP_STATUS } = require('./constants');

/**
 * Classe de erro customizada para API
 * Permite criar erros com status HTTP específico
 */
class ApiError extends Error {
    constructor(
        message,
        statusCode = HTTP_STATUS.INTERNAL_ERROR,
        details = null
    ) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, details = null) {
        return new ApiError(message, HTTP_STATUS.BAD_REQUEST, details);
    }

    static notFound(message) {
        return new ApiError(message, HTTP_STATUS.NOT_FOUND);
    }

    static unauthorized(message = 'Não autorizado') {
        return new ApiError(message, HTTP_STATUS.UNAUTHORIZED);
    }

    static forbidden(message = 'Acesso negado') {
        return new ApiError(message, HTTP_STATUS.FORBIDDEN);
    }

    static conflict(message) {
        return new ApiError(message, HTTP_STATUS.CONFLICT);
    }
}

/**
 * Utilitários para padronizar respostas da API
 * Seguindo o princípio DRY - Don't Repeat Yourself
 */
const responseHandler = Object.freeze({
    /**
     * Resposta de sucesso
     */
    success(res, data, message = null, statusCode = HTTP_STATUS.OK) {
        const response = { success: true };

        if (message) response.message = message;
        if (data !== undefined && data !== null) response.data = data;

        return res.status(statusCode).json(response);
    },

    /**
     * Resposta de criação
     */
    created(res, data, message = null) {
        return this.success(res, data, message, HTTP_STATUS.CREATED);
    },

    /**
     * Resposta de não encontrado
     */
    notFound(res, message = 'Recurso não encontrado') {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            error: message
        });
    },

    /**
     * Resposta de erro genérico com log
     */
    error(res, error, statusCode = null) {
        // Determina o status code
        const status =
            statusCode ||
            (error instanceof ApiError ? error.statusCode : null) ||
            HTTP_STATUS.INTERNAL_ERROR;

        // Log apenas para erros internos (não esperados)
        if (status === HTTP_STATUS.INTERNAL_ERROR) {
            console.error('[API Error]:', {
                message: error.message || error,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        }

        const response = {
            success: false,
            error: error.message || error || 'Erro interno do servidor'
        };

        // Adiciona detalhes se existirem (apenas em desenvolvimento)
        if (error.details && process.env.NODE_ENV !== 'production') {
            response.details = error.details;
        }

        return res.status(status).json(response);
    },

    /**
     * Resposta de requisição inválida
     */
    badRequest(res, message, details = null) {
        const response = {
            success: false,
            error: message
        };

        if (details && process.env.NODE_ENV !== 'production') {
            response.details = details;
        }

        return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    },

    /**
     * Resposta de não autorizado
     */
    unauthorized(res, message = 'Não autorizado') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: message
        });
    },

    /**
     * Resposta de acesso proibido
     */
    forbidden(res, message = 'Acesso negado') {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            error: message
        });
    },

    /**
     * Resposta de conflito (ex: duplicidade)
     */
    conflict(res, message) {
        return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            error: message
        });
    }
});

module.exports = { responseHandler, ApiError };
