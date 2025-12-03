import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

// ============================================================
// CONSTANTES
// ============================================================
const API_BASE = 'http://localhost:3000/api';
const POLLING_INTERVAL = 5000; // 5 segundos

const STATUS_CONFIG = {
    pending: {
        label: 'Pendente',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: '🕐',
        actions: ['preparing', 'cancelled']
    },
    preparing: {
        label: 'Preparando',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: '👨‍🍳',
        actions: ['ready', 'cancelled']
    },
    ready: {
        label: 'Pronto',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: '✅',
        actions: ['delivered']
    },
    delivered: {
        label: 'Entregue',
        color: 'bg-gray-100 text-gray-600 border-gray-300',
        icon: '🍽️',
        actions: []
    },
    cancelled: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: '❌',
        actions: []
    }
};

const ACTION_LABELS = {
    preparing: {
        label: 'Preparar',
        icon: '👨‍🍳',
        color: 'bg-blue-600 hover:bg-blue-700'
    },
    ready: {
        label: 'Pronto',
        icon: '✅',
        color: 'bg-green-600 hover:bg-green-700'
    },
    delivered: {
        label: 'Entregue',
        icon: '🍽️',
        color: 'bg-gray-600 hover:bg-gray-700'
    },
    cancelled: {
        label: 'Cancelar',
        icon: '❌',
        color: 'bg-red-600 hover:bg-red-700'
    }
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
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
        >
            {config.icon} {config.label}
        </span>
    );
};

/**
 * Formata preço
 */
const formatPrice = price => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
};

/**
 * Card de pedido
 */
const OrderCard = ({ order, onUpdateStatus }) => {
    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const createdAt = new Date(order.createdAt);
    const elapsedMinutes = Math.floor((Date.now() - createdAt) / 60000);

    return (
        <div
            className={`bg-white rounded-lg shadow-lg border-l-4 ${statusConfig.color.replace(
                'bg-',
                'border-'
            )} overflow-hidden`}
        >
            {/* Header */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                Mesa {order.table?.table_number || '?'}
                            </span>
                            {order.table?.location && (
                                <span className="text-sm text-gray-500">
                                    ({order.table.location})
                                </span>
                            )}
                        </div>
                        {order.customer_name && (
                            <p className="text-base font-medium text-orange-700 mt-1">
                                👤 {order.customer_name}
                            </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                            Pedido #{order.id} •{' '}
                            {createdAt.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <StatusBadge status={order.status} />
                        <p
                            className={`text-sm mt-1 ${
                                elapsedMinutes > 30
                                    ? 'text-red-600 font-bold'
                                    : 'text-gray-500'
                            }`}
                        >
                            ⏱️ {elapsedMinutes} min
                        </p>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="p-4">
                <ul className="space-y-2">
                    {order.items?.map((item, idx) => (
                        <li
                            key={idx}
                            className="flex justify-between items-center"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">
                                    {item.product?.Product_Image || '🍽️'}
                                </span>
                                <span className="font-medium">
                                    {item.quantity}x
                                </span>
                                <span className="text-gray-800">
                                    {item.product?.Product_Name ||
                                        'Produto não encontrado'}
                                </span>
                            </div>
                            <span className="text-gray-600">
                                {formatPrice(item.unit_price * item.quantity)}
                            </span>
                        </li>
                    ))}
                </ul>

                {order.notes && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                        📝 {order.notes}
                    </div>
                )}

                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total:</span>
                    <span className="text-xl font-bold text-orange-600">
                        {formatPrice(order.total)}
                    </span>
                </div>
            </div>

            {/* Actions */}
            {statusConfig.actions.length > 0 && (
                <div className="p-4 bg-gray-50 border-t flex gap-2 flex-wrap">
                    {statusConfig.actions.map(action => {
                        const actionConfig = ACTION_LABELS[action];
                        return (
                            <button
                                key={action}
                                onClick={() => onUpdateStatus(order.id, action)}
                                className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${actionConfig.color}`}
                            >
                                {actionConfig.icon} {actionConfig.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const OrdersAdmin = () => {
    const { token } = useAuth();

    // Estado
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active'); // active, pending, preparing, ready, all

    // ========================================================
    // FUNÇÕES DE API
    // ========================================================

    const fetchOrders = useCallback(async () => {
        try {
            const endpoint =
                filter === 'all'
                    ? `${API_BASE}/orders/active?includeCompleted=true`
                    : `${API_BASE}/orders/active`;

            const response = await fetch(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();

            if (result.success) {
                let filtered = result.data || [];

                // Aplica filtro local se não for 'active' ou 'all'
                if (filter !== 'active' && filter !== 'all') {
                    filtered = filtered.filter(o => o.status === filter);
                }

                setOrders(filtered);
            }
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
        }
    }, [token, filter]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/orders/stats`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setStats(result.data);
            }
        } catch (err) {
            console.error('Erro ao buscar estatísticas:', err);
        }
    }, [token]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchOrders(), fetchStats()]);
        setLoading(false);
    }, [fetchOrders, fetchStats]);

    // ========================================================
    // HANDLERS
    // ========================================================

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (
            newStatus === 'cancelled' &&
            !confirm('Tem certeza que deseja cancelar este pedido?')
        ) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE}/orders/${orderId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );

            const result = await response.json();

            if (result.success) {
                // Atualiza lista local imediatamente
                setOrders(prev =>
                    prev.map(o =>
                        o.id === orderId ? { ...o, status: newStatus } : o
                    )
                );
                fetchStats();
            } else {
                alert(result.error || 'Erro ao atualizar pedido');
            }
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
            alert('Erro ao atualizar pedido');
        }
    };

    // ========================================================
    // EFEITOS
    // ========================================================

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Polling para atualizações em tempo real
    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrders();
            fetchStats();
        }, POLLING_INTERVAL);

        return () => clearInterval(interval);
    }, [fetchOrders, fetchStats]);

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

    // Contadores por status
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;
    const readyCount = orders.filter(o => o.status === 'ready').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        🍽️ Pedidos
                    </h1>
                    <p className="text-gray-500">
                        Gerenciamento de pedidos do cardápio digital
                    </p>
                </div>
                <button
                    onClick={fetchAll}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    🔄 Atualizar
                </button>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <MetricCard
                    icon="🕐"
                    value={pendingCount}
                    label="Pendentes"
                    color={
                        pendingCount > 0 ? 'text-yellow-600' : 'text-gray-600'
                    }
                />
                <MetricCard
                    icon="👨‍🍳"
                    value={preparingCount}
                    label="Preparando"
                    color="text-blue-600"
                />
                <MetricCard
                    icon="✅"
                    value={readyCount}
                    label="Prontos"
                    color="text-green-600"
                />
                <MetricCard
                    icon="🍽️"
                    value={stats?.totalDelivered || 0}
                    label="Entregues hoje"
                />
                <MetricCard
                    icon="💰"
                    value={formatPrice(stats?.totalRevenue || 0)}
                    label="Receita hoje"
                    color="text-green-600"
                />
                <MetricCard
                    icon="⏱️"
                    value={`${stats?.avgPrepTime || 0}min`}
                    label="Tempo médio"
                />
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
                <span className="text-gray-500 self-center">Filtrar:</span>
                {[
                    { key: 'active', label: 'Ativos', icon: '📋' },
                    { key: 'pending', label: 'Pendentes', icon: '🕐' },
                    { key: 'preparing', label: 'Preparando', icon: '👨‍🍳' },
                    { key: 'ready', label: 'Prontos', icon: '✅' },
                    { key: 'all', label: 'Todos', icon: '📊' }
                ].map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                            filter === f.key
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {f.icon} {f.label}
                    </button>
                ))}
            </div>

            {/* Alerta de pedidos pendentes */}
            {pendingCount > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">⚠️</span>
                        <div>
                            <p className="font-semibold text-yellow-800">
                                {pendingCount} pedido
                                {pendingCount > 1 ? 's' : ''} aguardando!
                            </p>
                            <p className="text-sm text-yellow-700">
                                Clique em "Preparar" para começar a preparar os
                                pedidos.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid de pedidos */}
            {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <span className="text-6xl block mb-4">🎉</span>
                    <p className="text-xl text-gray-600">
                        Nenhum pedido no momento
                    </p>
                    <p className="text-gray-400 mt-2">
                        Os pedidos feitos pelo cardápio digital aparecerão aqui
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersAdmin;
