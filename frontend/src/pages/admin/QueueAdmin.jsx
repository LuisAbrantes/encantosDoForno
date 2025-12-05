import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_CONFIG } from '../../config/constants';

// ============================================================
// CONSTANTES
// ============================================================
const API_BASE = API_CONFIG.BASE_URL;
const POLLING_INTERVAL = 5000; // 5 segundos para admin

const STATUS_CONFIG = {
    waiting: {
        label: 'Aguardando',
        color: 'bg-gray-100 text-gray-800',
        icon: '⏳'
    },
    called: {
        label: 'Chamado',
        color: 'bg-green-100 text-green-800',
        icon: '📢'
    },
    seated: {
        label: 'Sentado',
        color: 'bg-blue-100 text-blue-800',
        icon: '✅'
    },
    no_show: {
        label: 'Não compareceu',
        color: 'bg-red-100 text-red-800',
        icon: '❌'
    },
    cancelled: {
        label: 'Cancelado',
        color: 'bg-gray-200 text-gray-600',
        icon: '🚫'
    }
};

const PRIORITY_CONFIG = {
    normal: { label: 'Normal', color: 'bg-gray-100 text-gray-700' },
    vip: { label: 'VIP', color: 'bg-purple-100 text-purple-800' },
    reservation: { label: 'Reserva', color: 'bg-blue-100 text-blue-800' }
};

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

/**
 * Card de métricas
 */
const MetricCard = ({ icon, value, label, color = 'text-orange-900' }) => (
    <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
            </div>
        </div>
    </div>
);

/**
 * Badge de status
 */
const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.waiting;
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
            {config.icon} {config.label}
        </span>
    );
};

/**
 * Badge de prioridade
 */
const PriorityBadge = ({ priority }) => {
    const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.normal;
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
            {config.label}
        </span>
    );
};

/**
 * Linha de cliente na fila
 */
const QueueRow = ({
    entry,
    position,
    onCall,
    onSeat,
    onNoShow,
    onRemove,
    onWhatsApp,
    tables
}) => {
    const [showSeatModal, setShowSeatModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState('');

    const waitTime = entry.waitTimeMinutes || 0;
    const entryTime = new Date(entry.entry_time).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const handleSeat = () => {
        if (selectedTable) {
            onSeat(entry.id, selectedTable);
            setShowSeatModal(false);
        }
    };

    return (
        <>
            <tr
                className={`border-b hover:bg-gray-50 ${
                    entry.status === 'called' ? 'bg-green-50' : ''
                }`}
            >
                <td className="px-4 py-3 text-center font-bold text-orange-900">
                    #{position}
                </td>
                <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">
                        {entry.customer_name}
                    </div>
                    <div className="text-sm text-gray-500">
                        {entry.phone_number}
                    </div>
                </td>
                <td className="px-4 py-3 text-center">
                    <span className="text-lg font-semibold">
                        {entry.party_size}
                    </span>
                    <span className="text-gray-500 text-sm"> pessoas</span>
                </td>
                <td className="px-4 py-3 text-center">
                    <div className="text-sm">{entryTime}</div>
                    <div className="text-xs text-gray-500">{waitTime} min</div>
                </td>
                <td className="px-4 py-3 text-center">
                    <StatusBadge status={entry.status} />
                </td>
                <td className="px-4 py-3 text-center">
                    <PriorityBadge priority={entry.priority} />
                </td>
                <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap justify-center">
                        {entry.status === 'waiting' && (
                            <>
                                <button
                                    onClick={() => onCall(entry.id)}
                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                    title="Chamar cliente"
                                >
                                    📢 Chamar
                                </button>
                                <button
                                    onClick={() => onWhatsApp(entry)}
                                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                    title="Enviar WhatsApp"
                                >
                                    💬
                                </button>
                            </>
                        )}
                        {entry.status === 'called' && (
                            <>
                                <button
                                    onClick={() => setShowSeatModal(true)}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                    title="Sentar cliente"
                                >
                                    🪑 Sentar
                                </button>
                                <button
                                    onClick={() => onNoShow(entry.id)}
                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                    title="Não compareceu"
                                >
                                    ❌ No-show
                                </button>
                            </>
                        )}
                        {(entry.status === 'waiting' ||
                            entry.status === 'called') && (
                            <button
                                onClick={() => onRemove(entry.id)}
                                className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                title="Remover"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Modal de seleção de mesa */}
            {showSeatModal && (
                <tr>
                    <td colSpan="7" className="px-4 py-3 bg-blue-50">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">
                                Selecione a mesa:
                            </span>
                            <select
                                value={selectedTable}
                                onChange={e => setSelectedTable(e.target.value)}
                                className="px-3 py-2 border rounded-lg"
                            >
                                <option value="">Escolha uma mesa</option>
                                {tables
                                    .filter(
                                        t =>
                                            t.status === 'available' &&
                                            t.capacity >= entry.party_size
                                    )
                                    .map(table => (
                                        <option key={table.id} value={table.id}>
                                            Mesa {table.table_number} (
                                            {table.capacity} lugares)
                                        </option>
                                    ))}
                            </select>
                            <button
                                onClick={handleSeat}
                                disabled={!selectedTable}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={() => setShowSeatModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

/**
 * Modal para adicionar cliente manualmente
 */
const AddCustomerModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        phone_number: '',
        party_size: '2',
        priority: 'normal',
        notes: ''
    });

    const handleSubmit = e => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            customer_name: '',
            phone_number: '',
            party_size: '2',
            priority: 'normal',
            notes: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Adicionar Cliente à Fila
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.customer_name}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    customer_name: e.target.value
                                })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="Nome do cliente"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone *
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone_number}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    phone_number: e.target.value
                                })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="(12) 99999-9999"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pessoas *
                            </label>
                            <select
                                value={formData.party_size}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        party_size: e.target.value
                                    })
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prioridade
                            </label>
                            <select
                                value={formData.priority}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        priority: e.target.value
                                    })
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="normal">Normal</option>
                                <option value="vip">VIP</option>
                                <option value="reservation">Reserva</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observações
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    notes: e.target.value
                                })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            rows="2"
                            placeholder="Observações opcionais..."
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                            Adicionar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const QueueAdmin = () => {
    const { token } = useAuth();

    // Estado
    const [queue, setQueue] = useState([]);
    const [tables, setTables] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filter, setFilter] = useState('active'); // active, all, waiting, called

    // ========================================================
    // FUNÇÕES DE API
    // ========================================================

    const fetchQueue = useCallback(async () => {
        try {
            const includeAll = filter === 'all' ? '&includeAll=true' : '';
            const statusFilter =
                filter === 'waiting' || filter === 'called'
                    ? `&status=${filter}`
                    : '';
            const response = await fetch(
                `${API_BASE}/queue?${statusFilter}${includeAll}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const result = await response.json();
            if (result.success) {
                setQueue(result.data);
            }
        } catch (err) {
            console.error('Erro ao buscar fila:', err);
        }
    }, [token, filter]);

    const fetchTables = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/tables`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setTables(result.data);
            }
        } catch (err) {
            console.error('Erro ao buscar mesas:', err);
        }
    }, [token]);

    const fetchMetrics = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/queue/metrics`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setMetrics(result.data);
            }
        } catch (err) {
            console.error('Erro ao buscar métricas:', err);
        }
    }, [token]);

    const fetchSettings = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/queue/settings`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setSettings(result.data);
            }
        } catch (err) {
            console.error('Erro ao buscar configurações:', err);
        }
    }, [token]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            fetchQueue(),
            fetchTables(),
            fetchMetrics(),
            fetchSettings()
        ]);
        setLoading(false);
    }, [fetchQueue, fetchTables, fetchMetrics, fetchSettings]);

    // ========================================================
    // HANDLERS
    // ========================================================

    const handleCallCustomer = async id => {
        try {
            const response = await fetch(`${API_BASE}/queue/${id}/call`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                fetchQueue();
                fetchMetrics();
            }
        } catch (err) {
            console.error('Erro ao chamar cliente:', err);
        }
    };

    const handleCallNext = async () => {
        try {
            const response = await fetch(`${API_BASE}/queue/call-next`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                fetchQueue();
                fetchMetrics();
            }
        } catch (err) {
            console.error('Erro ao chamar próximo:', err);
        }
    };

    const handleSeatCustomer = async (queueId, tableId) => {
        try {
            const response = await fetch(`${API_BASE}/queue/${queueId}/seat`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ table_id: tableId })
            });
            const result = await response.json();
            if (result.success) {
                fetchQueue();
                fetchTables();
                fetchMetrics();
            }
        } catch (err) {
            console.error('Erro ao sentar cliente:', err);
        }
    };

    const handleNoShow = async id => {
        if (!confirm('Confirma que o cliente não compareceu?')) return;

        try {
            const response = await fetch(`${API_BASE}/queue/${id}/no-show`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                fetchQueue();
                fetchMetrics();
            }
        } catch (err) {
            console.error('Erro ao marcar no-show:', err);
        }
    };

    const handleRemove = async id => {
        if (!confirm('Remover este cliente da fila?')) return;

        try {
            const response = await fetch(`${API_BASE}/queue/${id}/admin`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                fetchQueue();
                fetchMetrics();
            }
        } catch (err) {
            console.error('Erro ao remover:', err);
        }
    };

    const handleAddCustomer = async formData => {
        try {
            const response = await fetch(`${API_BASE}/queue/manual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    phone_number: formData.phone_number.replace(/\D/g, ''),
                    party_size: parseInt(formData.party_size)
                })
            });
            const result = await response.json();
            if (result.success) {
                fetchQueue();
                fetchMetrics();
            } else {
                alert(result.error || 'Erro ao adicionar cliente');
            }
        } catch (err) {
            console.error('Erro ao adicionar:', err);
        }
    };

    const handleWhatsApp = entry => {
        const message = encodeURIComponent(
            `Olá ${entry.customer_name}! Sua mesa no Encantos do Forno está pronta. Por favor, dirija-se ao restaurante.`
        );
        const phone = entry.phone_number.replace(/\D/g, '');
        window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
    };

    const handleToggleQueue = async () => {
        try {
            const response = await fetch(`${API_BASE}/queue/settings/toggle`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setSettings(result.data);
            }
        } catch (err) {
            console.error('Erro ao alternar fila:', err);
        }
    };

    // ========================================================
    // EFEITOS
    // ========================================================

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchQueue();
            fetchMetrics();
        }, POLLING_INTERVAL);

        return () => clearInterval(interval);
    }, [fetchQueue, fetchMetrics]);

    // ========================================================
    // RENDER
    // ========================================================

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    const waitingCount = queue.filter(e => e.status === 'waiting').length;
    const calledCount = queue.filter(e => e.status === 'called').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Fila de Espera
                    </h1>
                    <p className="text-gray-500">
                        Gerenciamento da fila do restaurante
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleToggleQueue}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            settings?.is_queue_open
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                        {settings?.is_queue_open
                            ? '🔴 Fechar Fila'
                            : '🟢 Abrir Fila'}
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                        + Adicionar Cliente
                    </button>
                </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <MetricCard icon="⏳" value={waitingCount} label="Aguardando" />
                <MetricCard
                    icon="📢"
                    value={calledCount}
                    label="Chamados"
                    color="text-green-600"
                />
                <MetricCard
                    icon="✅"
                    value={metrics?.seated || 0}
                    label="Sentados hoje"
                    color="text-blue-600"
                />
                <MetricCard
                    icon="❌"
                    value={metrics?.noShows || 0}
                    label="No-shows"
                    color="text-red-600"
                />
                <MetricCard
                    icon="⏱️"
                    value={`${metrics?.averageWaitMinutes || 0}min`}
                    label="Tempo médio"
                />
                <MetricCard
                    icon="📊"
                    value={`${metrics?.noShowRate || 0}%`}
                    label="Taxa no-show"
                    color="text-red-600"
                />
            </div>

            {/* Ações rápidas */}
            <div className="flex gap-4 items-center">
                <button
                    onClick={handleCallNext}
                    disabled={waitingCount === 0}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    📢 Chamar Próximo
                </button>
                <div className="flex gap-2">
                    <span className="text-gray-500">Filtrar:</span>
                    {['active', 'waiting', 'called', 'all'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                                filter === f
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {f === 'active' && 'Ativos'}
                            {f === 'waiting' && 'Aguardando'}
                            {f === 'called' && 'Chamados'}
                            {f === 'all' && 'Últimas 48h'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabela da fila */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Cliente
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                Pessoas
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                Entrada
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                Prioridade
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {queue.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    <span className="text-4xl block mb-2">
                                        🎉
                                    </span>
                                    Nenhum cliente na fila
                                </td>
                            </tr>
                        ) : (
                            queue.map((entry, index) => (
                                <QueueRow
                                    key={entry.id}
                                    entry={entry}
                                    position={entry.position || index + 1}
                                    onCall={handleCallCustomer}
                                    onSeat={handleSeatCustomer}
                                    onNoShow={handleNoShow}
                                    onRemove={handleRemove}
                                    onWhatsApp={handleWhatsApp}
                                    tables={tables}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AddCustomerModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddCustomer}
            />
        </div>
    );
};

export default QueueAdmin;
