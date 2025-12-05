/**
 * Configuração da API para o Frontend
 * Centraliza a comunicação com o backend
 */
import { API_CONFIG } from '../config/constants';

/**
 * Função genérica para fazer requisições à API
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_CONFIG.BASE_URL}${
        endpoint.startsWith('/api') ? endpoint.slice(4) : endpoint
    }`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro na requisição');
    }

    return data;
};

/**
 * Serviços de Produtos
 */
export const productService = {
    getAll: () => apiRequest('/api/products'),
    getFeatured: (limit = 6) =>
        apiRequest(`/api/products/featured?limit=${limit}`),
    getByClass: classId => apiRequest(`/api/products/class/${classId}`),
    getSorted: (direction = 'asc') =>
        apiRequest(`/api/products/order/${direction}`),
    create: data =>
        apiRequest('/api/products', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    update: (id, data) =>
        apiRequest(`/api/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    delete: id => apiRequest(`/api/products/${id}`, { method: 'DELETE' })
};

/**
 * Serviços de Agendamentos
 */
export const scheduleService = {
    getAll: () => apiRequest('/api/schedules'),
    getSorted: (direction = 'asc') =>
        apiRequest(`/api/schedules/order/${direction}`),
    create: data =>
        apiRequest('/api/schedules', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    update: (id, data) =>
        apiRequest(`/api/schedules/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    delete: id => apiRequest(`/api/schedules/${id}`, { method: 'DELETE' })
};

/**
 * Serviços de Funcionários
 */
export const employeeService = {
    getAll: () => apiRequest('/api/employees'),
    create: data =>
        apiRequest('/api/employees', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    update: (id, data) =>
        apiRequest(`/api/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    delete: id => apiRequest(`/api/employees/${id}`, { method: 'DELETE' })
};

/**
 * Serviços de Classes de Produto
 */
export const productClassService = {
    getAll: () => apiRequest('/api/classes'),
    create: data =>
        apiRequest('/api/classes', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    update: (id, data) =>
        apiRequest(`/api/classes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    delete: id => apiRequest(`/api/classes/${id}`, { method: 'DELETE' })
};

export default {
    products: productService,
    schedules: scheduleService,
    employees: employeeService,
    productClasses: productClassService
};
