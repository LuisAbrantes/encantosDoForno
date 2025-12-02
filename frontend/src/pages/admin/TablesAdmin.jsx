import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

// ============================================================
// CONSTANTES
// ============================================================
const API_BASE = 'http://localhost:3000/api';

const STATUS_CONFIG = {
    available: {
        label: 'Disponível',
        color: 'bg-green-100 text-green-800',
        icon: '✅'
    },
    occupied: {
        label: 'Ocupada',
        color: 'bg-red-100 text-red-800',
        icon: '🍽️'
    },
    reserved: {
        label: 'Reservada',
        color: 'bg-blue-100 text-blue-800',
        icon: '📅'
    },
    maintenance: {
        label: 'Manutenção',
        color: 'bg-yellow-100 text-yellow-800',
        icon: '🔧'
    }
};

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

/**
 * Badge de status
 */
const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.available;
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
            {config.icon} {config.label}
        </span>
    );
};

/**
 * Card de estatísticas
 */
const StatCard = ({ icon, value, label, color = 'text-orange-900' }) => (
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
 * Card de mesa visual
 */
const TableCard = ({
    table,
    onEdit,
    onRelease,
    onMaintenance,
    onSetAvailable,
    isAdmin
}) => {
    return (
        <div
            className={`relative rounded-xl shadow-lg p-4 border-2 transition-all hover:shadow-xl ${
                table.status === 'available'
                    ? 'border-green-300 bg-green-50'
                    : table.status === 'occupied'
                    ? 'border-red-300 bg-red-50'
                    : table.status === 'maintenance'
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-blue-300 bg-blue-50'
            }`}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">
                        Mesa {table.table_number}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {table.location || 'Sem localização'}
                    </p>
                </div>
                <StatusBadge status={table.status} />
            </div>

            {/* Info */}
            <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                    <span className="text-2xl">🪑</span>
                    <p className="text-sm font-semibold">{table.capacity}</p>
                    <p className="text-xs text-gray-500">lugares</p>
                </div>
                {table.status === 'occupied' && table.occupiedTimeMinutes && (
                    <div className="text-center">
                        <span className="text-2xl">⏱️</span>
                        <p className="text-sm font-semibold">
                            {table.occupiedTimeMinutes}min
                        </p>
                        <p className="text-xs text-gray-500">ocupada</p>
                    </div>
                )}
            </div>

            {/* Cliente atual */}
            {table.currentCustomer && (
                <div className="bg-white/80 rounded-lg p-2 mb-3">
                    <p className="text-sm font-semibold">
                        {table.currentCustomer.customer_name}
                    </p>
                    <p className="text-xs text-gray-500">
                        {table.currentCustomer.party_size} pessoas
                    </p>
                </div>
            )}

            {/* Ações */}
            <div className="flex gap-2 flex-wrap">
                {table.status === 'occupied' && (
                    <button
                        onClick={() => onRelease(table.id)}
                        className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                        Liberar
                    </button>
                )}
                {table.status === 'available' && (
                    <button
                        onClick={() => onMaintenance(table.id)}
                        className="flex-1 px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
                    >
                        Manutenção
                    </button>
                )}
                {table.status === 'maintenance' && (
                    <button
                        onClick={() => onSetAvailable(table.id)}
                        className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                        Disponibilizar
                    </button>
                )}
                {isAdmin && (
                    <button
                        onClick={() => onEdit(table)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                    >
                        ✏️
                    </button>
                )}
            </div>
        </div>
    );
};

/**
 * Modal de adicionar/editar mesa
 */
const TableModal = ({
    isOpen,
    onClose,
    onSave,
    editingTable,
    onDelete,
    locations
}) => {
    const [formData, setFormData] = useState({
        table_number: '',
        capacity: '4',
        location: ''
    });

    useEffect(() => {
        if (editingTable) {
            setFormData({
                table_number: editingTable.table_number,
                capacity: String(editingTable.capacity),
                location: editingTable.location || ''
            });
        } else {
            setFormData({
                table_number: '',
                capacity: '4',
                location: ''
            });
        }
    }, [editingTable]);

    const handleSubmit = e => {
        e.preventDefault();
        onSave(formData, editingTable?.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {editingTable ? 'Editar Mesa' : 'Nova Mesa'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número/Identificação *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.table_number}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    table_number: e.target.value
                                })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="Ex: 01, A1, VIP-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Capacidade (lugares) *
                        </label>
                        <select
                            value={formData.capacity}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    capacity: e.target.value
                                })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            {[2, 4, 6, 8, 10, 12, 15, 20].map(n => (
                                <option key={n} value={n}>
                                    {n} lugares
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Localização
                        </label>
                        <select
                            value={formData.location}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    location: e.target.value
                                })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Selecione...</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.name}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        {editingTable && (
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete(editingTable.id);
                                    onClose();
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                🗑️ Excluir
                            </button>
                        )}
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
                            {editingTable ? 'Salvar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Modal de gerenciar localizações
 */
const LocationsModal = ({ isOpen, onClose, locations, onSave, onDelete }) => {
    const [newLocation, setNewLocation] = useState({
        name: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', description: '' });

    const handleAdd = async e => {
        e.preventDefault();
        if (!newLocation.name.trim()) return;
        await onSave(newLocation);
        setNewLocation({ name: '', description: '' });
    };

    const handleEdit = async id => {
        await onSave(editForm, id);
        setEditingId(null);
    };

    const startEdit = loc => {
        setEditingId(loc.id);
        setEditForm({ name: loc.name, description: loc.description || '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                        📍 Gerenciar Localizações
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Formulário para nova localização */}
                <form
                    onSubmit={handleAdd}
                    className="mb-6 p-4 bg-gray-50 rounded-lg"
                >
                    <h4 className="font-semibold text-gray-700 mb-3">
                        Nova Localização
                    </h4>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={newLocation.name}
                            onChange={e =>
                                setNewLocation({
                                    ...newLocation,
                                    name: e.target.value
                                })
                            }
                            placeholder="Nome (ex: Terraço)"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                            type="text"
                            value={newLocation.description}
                            onChange={e =>
                                setNewLocation({
                                    ...newLocation,
                                    description: e.target.value
                                })
                            }
                            placeholder="Descrição (opcional)"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                            type="submit"
                            disabled={!newLocation.name.trim()}
                            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                        >
                            + Adicionar
                        </button>
                    </div>
                </form>

                {/* Lista de localizações */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 mb-2">
                        Localizações ({locations.length})
                    </h4>
                    {locations.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            Nenhuma localização cadastrada
                        </p>
                    ) : (
                        locations.map(loc => (
                            <div
                                key={loc.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                {editingId === loc.id ? (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={e =>
                                                setEditForm({
                                                    ...editForm,
                                                    name: e.target.value
                                                })
                                            }
                                            className="flex-1 px-2 py-1 border rounded"
                                        />
                                        <button
                                            onClick={() => handleEdit(loc.id)}
                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <span className="font-medium">
                                                {loc.name}
                                            </span>
                                            {loc.description && (
                                                <span className="text-sm text-gray-500 ml-2">
                                                    - {loc.description}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(loc)}
                                                className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => onDelete(loc.id)}
                                                className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const TablesAdmin = () => {
    const { token, user } = useAuth();
    const isAdmin = user?.role === 'admin';

    // Estado
    const [tables, setTables] = useState([]);
    const [locations, setLocations] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showLocationsModal, setShowLocationsModal] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [filter, setFilter] = useState('all');

    // ========================================================
    // FUNÇÕES DE API
    // ========================================================

    const fetchTables = useCallback(async () => {
        try {
            const statusParam = filter !== 'all' ? `?status=${filter}` : '';
            const response = await fetch(`${API_BASE}/tables${statusParam}`, {
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
    }, [token, filter]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/tables/stats`, {
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

    const fetchLocations = useCallback(async () => {
        try {
            const response = await fetch(
                `${API_BASE}/table-locations?active=false`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const result = await response.json();
            if (result.success) {
                setLocations(result.data);
            }
        } catch (err) {
            console.error('Erro ao buscar localizações:', err);
        }
    }, [token]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchTables(), fetchStats(), fetchLocations()]);
        setLoading(false);
    }, [fetchTables, fetchStats, fetchLocations]);

    // ========================================================
    // HANDLERS DE MESAS
    // ========================================================

    const handleSaveTable = async (formData, tableId) => {
        try {
            const url = tableId
                ? `${API_BASE}/tables/${tableId}`
                : `${API_BASE}/tables`;
            const method = tableId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    table_number: formData.table_number,
                    capacity: parseInt(formData.capacity),
                    location: formData.location || null
                })
            });

            const result = await response.json();
            if (result.success) {
                fetchTables();
                fetchStats();
            } else {
                alert(result.error || 'Erro ao salvar mesa');
            }
        } catch (err) {
            console.error('Erro ao salvar:', err);
        }
    };

    const handleDeleteTable = async id => {
        if (!confirm('Tem certeza que deseja excluir esta mesa?')) return;

        try {
            const response = await fetch(`${API_BASE}/tables/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                fetchTables();
                fetchStats();
            } else {
                alert(result.error || 'Erro ao excluir mesa');
            }
        } catch (err) {
            console.error('Erro ao excluir:', err);
        }
    };

    const handleReleaseTable = async id => {
        try {
            const response = await fetch(`${API_BASE}/tables/${id}/release`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                fetchTables();
                fetchStats();
            }
        } catch (err) {
            console.error('Erro ao liberar mesa:', err);
        }
    };

    const handleSetMaintenance = async id => {
        try {
            const response = await fetch(
                `${API_BASE}/tables/${id}/maintenance`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();
            if (result.success) {
                fetchTables();
                fetchStats();
            }
        } catch (err) {
            console.error('Erro ao colocar em manutenção:', err);
        }
    };

    const handleSetAvailable = async id => {
        try {
            const response = await fetch(`${API_BASE}/tables/${id}/available`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                fetchTables();
                fetchStats();
            }
        } catch (err) {
            console.error('Erro ao disponibilizar:', err);
        }
    };

    // ========================================================
    // HANDLERS DE LOCALIZAÇÕES
    // ========================================================

    const handleSaveLocation = async (data, id = null) => {
        try {
            const url = id
                ? `${API_BASE}/table-locations/${id}`
                : `${API_BASE}/table-locations`;
            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                fetchLocations();
            } else {
                alert(result.error || 'Erro ao salvar localização');
            }
        } catch (err) {
            console.error('Erro ao salvar localização:', err);
        }
    };

    const handleDeleteLocation = async id => {
        if (!confirm('Tem certeza que deseja excluir esta localização?'))
            return;

        try {
            const response = await fetch(`${API_BASE}/table-locations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                fetchLocations();
            } else {
                alert(result.error || 'Erro ao excluir localização');
            }
        } catch (err) {
            console.error('Erro ao excluir localização:', err);
        }
    };

    // ========================================================
    // OUTRAS FUNÇÕES
    // ========================================================

    const openEditModal = table => {
        setEditingTable(table);
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditingTable(null);
        setShowModal(true);
    };

    // ========================================================
    // EFEITOS
    // ========================================================

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Polling
    useEffect(() => {
        const interval = setInterval(() => {
            fetchTables();
            fetchStats();
        }, 10000);

        return () => clearInterval(interval);
    }, [fetchTables, fetchStats]);

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mesas</h1>
                    <p className="text-gray-500">
                        Gerenciamento das mesas do restaurante
                    </p>
                </div>
                <div className="flex gap-2">
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setShowLocationsModal(true)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                📍 Localizações
                            </button>
                            <button
                                onClick={openAddModal}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                + Nova Mesa
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard icon="🪑" value={stats?.total || 0} label="Total" />
                <StatCard
                    icon="✅"
                    value={stats?.available || 0}
                    label="Disponíveis"
                    color="text-green-600"
                />
                <StatCard
                    icon="🍽️"
                    value={stats?.occupied || 0}
                    label="Ocupadas"
                    color="text-red-600"
                />
                <StatCard
                    icon="🔧"
                    value={stats?.maintenance || 0}
                    label="Manutenção"
                    color="text-yellow-600"
                />
                <StatCard
                    icon="👥"
                    value={stats?.totalCapacity || 0}
                    label="Capacidade total"
                />
                <StatCard
                    icon="📊"
                    value={`${stats?.occupancyRate || 0}%`}
                    label="Taxa ocupação"
                    color="text-blue-600"
                />
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
                <span className="text-gray-500 py-1">Filtrar:</span>
                {['all', 'available', 'occupied', 'maintenance'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                            filter === f
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {f === 'all' && 'Todas'}
                        {f === 'available' && '✅ Disponíveis'}
                        {f === 'occupied' && '🍽️ Ocupadas'}
                        {f === 'maintenance' && '🔧 Manutenção'}
                    </button>
                ))}
            </div>

            {/* Grid de mesas */}
            {tables.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    <span className="text-4xl block mb-2">🪑</span>
                    {filter === 'all' ? (
                        <>
                            <p className="mb-4">Nenhuma mesa cadastrada</p>
                            {isAdmin && (
                                <button
                                    onClick={openAddModal}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                >
                                    Adicionar primeira mesa
                                </button>
                            )}
                        </>
                    ) : (
                        <p>Nenhuma mesa com este status</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tables.map(table => (
                        <TableCard
                            key={table.id}
                            table={table}
                            onEdit={openEditModal}
                            onRelease={handleReleaseTable}
                            onMaintenance={handleSetMaintenance}
                            onSetAvailable={handleSetAvailable}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            )}

            {/* Modal de Mesa */}
            <TableModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveTable}
                editingTable={editingTable}
                onDelete={handleDeleteTable}
                locations={locations.filter(l => l.is_active)}
            />

            {/* Modal de Localizações */}
            <LocationsModal
                isOpen={showLocationsModal}
                onClose={() => setShowLocationsModal(false)}
                locations={locations}
                onSave={handleSaveLocation}
                onDelete={handleDeleteLocation}
            />
        </div>
    );
};

export default TablesAdmin;
