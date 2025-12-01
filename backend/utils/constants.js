/**
 * Mensagens padronizadas para respostas da API
 */
const MESSAGES = {
    PRODUCT: {
        NOT_FOUND: 'Produto não encontrado',
        DELETED: 'Produto deletado com sucesso',
        UPDATED: 'Produto atualizado com sucesso',
        CREATED: 'Produto criado com sucesso'
    },
    SCHEDULE: {
        NOT_FOUND: 'Agendamento não encontrado',
        DELETED: 'Agendamento deletado com sucesso',
        UPDATED: 'Agendamento atualizado com sucesso',
        CREATED: 'Agendamento criado com sucesso'
    },
    PRODUCT_CLASS: {
        NOT_FOUND: 'Classe não encontrada',
        DELETED: 'Classe deletada com sucesso',
        UPDATED: 'Classe atualizada com sucesso',
        CREATED: 'Classe criada com sucesso'
    },
    EMPLOYEE: {
        NOT_FOUND: 'Funcionário não encontrado',
        DELETED: 'Funcionário deletado com sucesso',
        UPDATED: 'Funcionário atualizado com sucesso',
        CREATED: 'Funcionário criado com sucesso'
    },
    SERVER: {
        INTERNAL_ERROR: 'Erro interno do servidor'
    }
};

/**
 * Códigos de status HTTP
 */
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};

module.exports = {
    MESSAGES,
    HTTP_STATUS
};
