/**
 * Mensagens padronizadas para respostas da API
 * Centralizadas para facilitar manutenção e internacionalização
 */
const MESSAGES = Object.freeze({
    PRODUCT: Object.freeze({
        NOT_FOUND: 'Produto não encontrado',
        DELETED: 'Produto deletado com sucesso',
        UPDATED: 'Produto atualizado com sucesso',
        CREATED: 'Produto criado com sucesso'
    }),
    SCHEDULE: Object.freeze({
        NOT_FOUND: 'Agendamento não encontrado',
        DELETED: 'Agendamento deletado com sucesso',
        UPDATED: 'Agendamento atualizado com sucesso',
        CREATED: 'Agendamento criado com sucesso'
    }),
    PRODUCT_CLASS: Object.freeze({
        NOT_FOUND: 'Classe não encontrada',
        DELETED: 'Classe deletada com sucesso',
        UPDATED: 'Classe atualizada com sucesso',
        CREATED: 'Classe criada com sucesso'
    }),
    EMPLOYEE: Object.freeze({
        NOT_FOUND: 'Funcionário não encontrado',
        DELETED: 'Funcionário deletado com sucesso',
        UPDATED: 'Funcionário atualizado com sucesso',
        CREATED: 'Funcionário criado com sucesso'
    }),
    QUEUE: Object.freeze({
        NOT_FOUND: 'Entrada não encontrada na fila',
        CLOSED: 'Fila fechada no momento',
        FULL: 'Fila cheia',
        PHONE_EXISTS: 'Este telefone já está na fila',
        JOINED: 'Entrada na fila realizada com sucesso',
        LEFT: 'Saída da fila realizada',
        CALLED: 'Cliente chamado',
        SEATED: 'Cliente sentado'
    }),
    TABLE: Object.freeze({
        NOT_FOUND: 'Mesa não encontrada',
        NUMBER_EXISTS: 'Já existe uma mesa com este número',
        DELETED: 'Mesa removida com sucesso',
        CREATED: 'Mesa criada com sucesso',
        RELEASED: 'Mesa liberada',
        CANNOT_DELETE_OCCUPIED: 'Não é possível remover uma mesa ocupada'
    }),
    SERVER: Object.freeze({
        INTERNAL_ERROR: 'Erro interno do servidor'
    })
});

/**
 * Códigos de status HTTP
 */
const HTTP_STATUS = Object.freeze({
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
});

/**
 * Configurações de polling e timeouts
 */
const TIMING = Object.freeze({
    QUEUE_POLLING_MS: 10000,
    ADMIN_POLLING_MS: 5000,
    REQUEST_TIMEOUT_MS: 30000,
    RATE_LIMIT_WINDOW_MS: 60000,
    RATE_LIMIT_MAX_REQUESTS: 100
});

module.exports = Object.freeze({
    MESSAGES,
    HTTP_STATUS,
    TIMING
});
