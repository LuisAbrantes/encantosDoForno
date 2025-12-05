import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG } from '../config/constants';

// ============================================================
// CONSTANTES
// ============================================================
const API_BASE = API_CONFIG.BASE_URL;
const POLLING_INTERVAL = 5000;

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

const formatPrice = price =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);

const OrderCard = ({ order, onUpdateStatus, onDelete }) => {
    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const createdAt = new Date(order.createdAt);
    const elapsedMinutes = Math.floor((Date.now() - createdAt) / 60000);
    const canDelete = ['delivered', 'cancelled'].includes(order.status);

    return (
        <div
            className={`bg-white rounded-lg shadow-lg border-l-4 ${statusConfig.color.replace(
                'bg-',
                'border-'
            )} overflow-hidden`}
        >
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

            {canDelete && onDelete && (
                <div className="p-4 bg-gray-50 border-t">
                    <button
                        onClick={() => onDelete(order.id)}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
                    >
                        🗑️ Excluir pedido
                    </button>
                </div>
            )}
        </div>
    );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const Funcionario = () => {
    const { token, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE}/orders/active`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setOrders(result.data || []);
                setError(null);
            }
        } catch (err) {
            setError('Erro ao carregar pedidos');
            console.error('Erro ao buscar pedidos:', err);
        }
    }, [token]);

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
                setOrders(prev =>
                    prev.map(o =>
                        o.id === orderId ? { ...o, status: newStatus } : o
                    )
                );
            } else {
                alert(result.error || 'Erro ao atualizar pedido');
            }
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
            alert('Erro ao atualizar pedido');
        }
    };

    const handleDeleteOrder = async orderId => {
        if (
            !confirm(
                'Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.'
            )
        ) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setOrders(prev => prev.filter(o => o.id !== orderId));
            } else {
                alert(result.error || 'Erro ao excluir pedido');
            }
        } catch (err) {
            console.error('Erro ao excluir pedido:', err);
            alert('Erro ao excluir pedido');
        }
    };

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            await fetchOrders();
            setLoading(false);
        };
        loadInitial();
    }, [fetchOrders]);

    useEffect(() => {
        if (!token) return;
        const interval = setInterval(fetchOrders, POLLING_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchOrders, token]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Acesso Restrito
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Faça login para acessar o painel de funcionários.
                    </p>
                    <a
                        href="/admin/login"
                        className="text-orange-600 hover:underline font-medium"
                    >
                        Ir para Login →
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;
    const readyCount = orders.filter(o => o.status === 'ready').length;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            🍽️ Painel de Pedidos
                        </h1>
                        <p className="text-gray-500">
                            Gerencie os pedidos do restaurante
                        </p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 shadow"
                    >
                        🔄 Atualizar
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-yellow-700">
                            {pendingCount}
                        </span>
                        <p className="text-yellow-600 text-sm">Pendentes</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-blue-700">
                            {preparingCount}
                        </span>
                        <p className="text-blue-600 text-sm">Preparando</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-green-700">
                            {readyCount}
                        </span>
                        <p className="text-green-600 text-sm">Prontos</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <span className="text-4xl">🎉</span>
                        <p className="text-gray-600 mt-2">
                            Nenhum pedido ativo no momento
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onUpdateStatus={handleUpdateStatus}
                                onDelete={handleDeleteOrder}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Funcionario;
