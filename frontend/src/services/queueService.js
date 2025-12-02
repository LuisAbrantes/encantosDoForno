/**
 * Serviço centralizado para chamadas de API da Fila
 * Segue padrão Service Layer para separar lógica de comunicação
 */

import { API_CONFIG } from '../config/constants';

const { BASE_URL } = API_CONFIG;

/**
 * Helper para fazer fetch com tratamento de erro padrão
 */
const fetchWithErrorHandling = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.error || result.message || `HTTP ${response.status}`
        );
    }

    return result;
};

/**
 * Cria headers de autorização
 */
const createAuthHeaders = token => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
});

// ============================================================
// SERVIÇOS PÚBLICOS (CLIENTE)
// ============================================================

export const queuePublicService = Object.freeze({
    /**
     * Obtém informações públicas da fila
     */
    async getInfo() {
        const result = await fetchWithErrorHandling(`${BASE_URL}/queue/info`);
        return result.data;
    },

    /**
     * Entra na fila
     */
    async join(customerData) {
        const result = await fetchWithErrorHandling(`${BASE_URL}/queue`, {
            method: 'POST',
            body: JSON.stringify(customerData)
        });
        return result.data;
    },

    /**
     * Obtém status na fila por ID ou telefone
     */
    async getStatus(identifier) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/queue/status/${identifier}`
        );
        return result.data;
    },

    /**
     * Atualiza dados na fila
     */
    async update(id, data) {
        const result = await fetchWithErrorHandling(`${BASE_URL}/queue/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return result.data;
    },

    /**
     * Sai da fila
     */
    async leave(id) {
        const result = await fetchWithErrorHandling(`${BASE_URL}/queue/${id}`, {
            method: 'DELETE'
        });
        return result.data;
    }
});

// ============================================================
// SERVIÇOS PROTEGIDOS (FUNCIONÁRIOS)
// ============================================================

export const queueAdminService = Object.freeze({
    /**
     * Lista toda a fila
     */
    async list(token, filters = {}) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.includeAll) params.append('includeAll', 'true');

        const queryString = params.toString();
        const url = `${BASE_URL}/queue${queryString ? `?${queryString}` : ''}`;

        const result = await fetchWithErrorHandling(url, {
            headers: createAuthHeaders(token)
        });
        return result.data;
    },

    /**
     * Adiciona cliente manualmente
     */
    async addManually(token, customerData) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/queue/manual`,
            {
                method: 'POST',
                headers: createAuthHeaders(token),
                body: JSON.stringify(customerData)
            }
        );
        return result.data;
    },

    /**
     * Chama cliente específico
     */
    async call(token, id) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/queue/${id}/call`,
            {
                method: 'PUT',
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    },

    /**
     * Chama próximo cliente
     */
    async callNext(token) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/queue/call-next`,
            {
                method: 'PUT',
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    },

    /**
     * Senta cliente em mesa
     */
    async seat(token, queueId, tableId) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/queue/${queueId}/seat`,
            {
                method: 'PUT',
                headers: createAuthHeaders(token),
                body: JSON.stringify({ table_id: tableId })
            }
        );
        return result.data;
    },

    /**
     * Marca como não compareceu
     */
    async markNoShow(token, id) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/queue/${id}/no-show`,
            {
                method: 'PUT',
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    },

    /**
     * Remove entrada (admin)
     */
    async remove(token, id) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/queue/${id}/admin`,
            {
                method: 'DELETE',
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    },

    /**
     * Obtém métricas
     */
    async getMetrics(token, startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const queryString = params.toString();
        const url = `${BASE_URL}/queue/metrics${
            queryString ? `?${queryString}` : ''
        }`;

        const result = await fetchWithErrorHandling(url, {
            headers: createAuthHeaders(token)
        });
        return result.data;
    },

    /**
     * Obtém configurações
     */
    async getSettings(token) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/queue/settings`,
            {
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    },

    /**
     * Abre/fecha fila
     */
    async toggleQueue(token) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/queue/settings/toggle`,
            {
                method: 'PUT',
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    }
});

// ============================================================
// SERVIÇO DE MESAS
// ============================================================

export const tableService = Object.freeze({
    /**
     * Lista todas as mesas
     */
    async list(token, filters = {}) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);

        const queryString = params.toString();
        const url = `${BASE_URL}/tables${queryString ? `?${queryString}` : ''}`;

        const result = await fetchWithErrorHandling(url, {
            headers: createAuthHeaders(token)
        });
        return result.data;
    },

    /**
     * Obtém estatísticas
     */
    async getStats(token) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/tables/stats`,
            {
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    },

    /**
     * Cria mesa
     */
    async create(token, data) {
        const result = await fetchWithErrorHandling(`${BASE_URL}/tables`, {
            method: 'POST',
            headers: createAuthHeaders(token),
            body: JSON.stringify(data)
        });
        return result.data;
    },

    /**
     * Atualiza mesa
     */
    async update(token, id, data) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/tables/${id}`,
            {
                method: 'PUT',
                headers: createAuthHeaders(token),
                body: JSON.stringify(data)
            }
        );
        return result.data;
    },

    /**
     * Remove mesa
     */
    async delete(token, id) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/tables/${id}`,
            {
                method: 'DELETE',
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    },

    /**
     * Libera mesa
     */
    async release(token, id) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/tables/${id}/release`,
            {
                method: 'PUT',
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    },

    /**
     * Coloca em manutenção
     */
    async setMaintenance(token, id) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/tables/${id}/maintenance`,
            {
                method: 'PUT',
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    },

    /**
     * Disponibiliza mesa
     */
    async setAvailable(token, id) {
        const result = await fetchWithErrorHandling(
            `${BASE_URL}/tables/${id}/available`,
            {
                method: 'PUT',
                headers: createAuthHeaders(token)
            }
        );
        return result.data;
    }
});

export default {
    public: queuePublicService,
    admin: queueAdminService,
    tables: tableService
};
