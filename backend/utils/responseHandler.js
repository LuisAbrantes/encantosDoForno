const { HTTP_STATUS } = require('./constants');

/**
 * Utilitários para padronizar respostas da API
 * Seguindo o princípio DRY - Don't Repeat Yourself
 */

const success = (res, data, message = null, statusCode = HTTP_STATUS.OK) => {
    const response = { success: true };

    if (message) response.message = message;
    if (data !== undefined) response.data = data;

    return res.status(statusCode).json(response);
};

const created = (res, data, message = null) => {
    return success(res, data, message, HTTP_STATUS.CREATED);
};

const notFound = (res, message) => {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message
    });
};

const error = (res, error, statusCode = HTTP_STATUS.INTERNAL_ERROR) => {
    console.error('[API Error]:', error);

    return res.status(statusCode).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
    });
};

const badRequest = (res, message) => {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message
    });
};

module.exports = {
    success,
    created,
    notFound,
    error,
    badRequest
};
