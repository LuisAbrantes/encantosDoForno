import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

// ============================================================
// CONSTANTES
// ============================================================
const API_URL = 'http://localhost:3000';

const ROLES = {
    admin: { label: 'Administrador', color: 'bg-purple-100 text-purple-800' },
    employee: { label: 'Funcionário', color: 'bg-blue-100 text-blue-800' }
};

const MESSAGES = {
    CONFIRM_DELETE: 'Tem certeza que deseja remover este funcionário?',
    ERROR_LOAD: 'Erro ao carregar funcionários',
    ERROR_SAVE: 'Erro ao salvar funcionário',
    ERROR_DELETE: 'Erro ao remover funcionário',
    SUCCESS_CREATE: 'Funcionário cadastrado com sucesso!',
    SUCCESS_DELETE: 'Funcionário removido com sucesso!'
};

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600" />
    </div>
);

const RoleBadge = ({ role }) => {
    const roleInfo = ROLES[role] || ROLES.employee;
    return (
        <span className={`px-2 py-1 text-xs rounded-full ${roleInfo.color}`}>
            {roleInfo.label}
        </span>
    );
};

const EmptyState = () => (
    <p className="text-gray-500 text-center py-12">
        Nenhum funcionário cadastrado
    </p>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const EmployeesAdmin = () => {
    const { token, user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Verificar se o usuário atual é admin
    const isAdmin = user?.role === 'admin';

    /**
     * Faz requisições autenticadas para a API
     */
    const authFetch = useCallback(
        async (endpoint, options = {}) => {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    ...options.headers
                }
            });
            return response;
        },
        [token]
    );

    /**
     * Carrega lista de funcionários
     */
    const fetchEmployees = useCallback(async () => {
        try {
            const response = await authFetch('/api/employees');
            const data = await response.json();

            if (response.ok) {
                setEmployees(data.data || []);
            } else {
                setError(data.error || MESSAGES.ERROR_LOAD);
            }
        } catch {
            setError(MESSAGES.ERROR_LOAD);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        if (isAdmin) {
            fetchEmployees();
        } else {
            setLoading(false);
        }
    }, [isAdmin, fetchEmployees]);

    /**
     * Abre modal para novo funcionário
     */
    const openModal = () => {
        setFormData({ name: '', email: '', password: '', role: 'employee' });
        setError('');
        setShowModal(true);
    };

    /**
     * Fecha modal
     */
    const closeModal = () => {
        setShowModal(false);
        setError('');
    };

    /**
     * Atualiza campo do formulário
     */
    const handleInputChange = field => e => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    /**
     * Cadastra novo funcionário
     */
    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            const response = await authFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(MESSAGES.SUCCESS_CREATE);
                closeModal();
                fetchEmployees();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || MESSAGES.ERROR_SAVE);
            }
        } catch {
            setError(MESSAGES.ERROR_SAVE);
        }
    };

    /**
     * Remove funcionário
     */
    const handleDelete = async id => {
        if (!window.confirm(MESSAGES.CONFIRM_DELETE)) return;

        try {
            const response = await authFetch(`/api/employees/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(MESSAGES.SUCCESS_DELETE);
                fetchEmployees();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || MESSAGES.ERROR_DELETE);
                setTimeout(() => setError(''), 3000);
            }
        } catch {
            setError(MESSAGES.ERROR_DELETE);
        }
    };

    /**
     * Formata data para exibição
     */
    const formatDate = dateString => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    // Verifica permissão
    if (!isAdmin) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-2">⚠️ Acesso Negado</h2>
                <p>Apenas administradores podem gerenciar funcionários.</p>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    👥 Funcionários
                </h1>
                <button
                    onClick={openModal}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition flex items-center"
                >
                    + Novo Funcionário
                </button>
            </div>

            {/* Alerts */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                    ✅ {success}
                </div>
            )}
            {error && !showModal && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    ❌ {error}
                </div>
            )}

            {/* Employees Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {employees.length === 0 ? (
                    <EmptyState />
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Cargo
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Cadastro
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employees.map(employee => (
                                <tr
                                    key={employee.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {employee.name}
                                        {employee.id === user?.id && (
                                            <span className="ml-2 text-xs text-orange-600">
                                                (você)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {employee.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <RoleBadge role={employee.role} />
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {formatDate(employee.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {employee.id !== user?.id ? (
                                            <button
                                                onClick={() =>
                                                    handleDelete(employee.id)
                                                }
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                🗑️ Remover
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-sm">
                                                —
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal - Novo Funcionário */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Novo Funcionário
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome completo *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange('name')}
                                    placeholder="Nome do funcionário"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    placeholder="email@exemplo.com"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Senha inicial *
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    O funcionário poderá alterar sua senha após
                                    o primeiro acesso.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cargo
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={handleInputChange('role')}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="employee">
                                        Funcionário
                                    </option>
                                    <option value="admin">Administrador</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Administradores podem gerenciar funcionários
                                    e configurações.
                                </p>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                                >
                                    Cadastrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesAdmin;
