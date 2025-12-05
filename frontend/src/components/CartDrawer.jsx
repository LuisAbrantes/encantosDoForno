import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { API_CONFIG } from '../config/constants';

/**
 * Drawer lateral do carrinho
 * Exibe itens, seletor de mesa e botão de envio
 */
const CartDrawer = () => {
    const {
        items,
        isOpen,
        setIsOpen,
        selectedTable,
        setSelectedTable,
        customerName,
        setCustomerName,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getOrderData,
        isEmpty
    } = useCart();

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Carrega mesas ocupadas ao abrir
    useEffect(() => {
        if (isOpen) {
            fetchTables();
        }
    }, [isOpen]);

    const fetchTables = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/api/tables/available-for-order`
            );
            const data = await response.json();
            setTables(data.data || []);
        } catch (err) {
            console.error('Erro ao carregar mesas:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!customerName.trim()) {
            setError('Digite seu nome');
            return;
        }

        if (!selectedTable) {
            setError('Selecione sua mesa');
            return;
        }

        if (isEmpty) {
            setError('Adicione itens ao pedido');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(getOrderData())
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao enviar pedido');
            }

            setSuccess(true);
            clearCart();

            // Fecha após 3 segundos
            setTimeout(() => {
                setSuccess(false);
                setIsOpen(false);
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = price => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        🛒 Seu Pedido
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-2xl hover:opacity-80"
                    >
                        ✕
                    </button>
                </div>

                {/* Sucesso */}
                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 p-4 m-4 rounded">
                        <p className="text-green-700 font-medium">
                            ✅ Pedido enviado com sucesso!
                        </p>
                        <p className="text-green-600 text-sm">
                            Em breve seu pedido chegará à sua mesa.
                        </p>
                    </div>
                )}

                {/* Conteúdo */}
                {!success && (
                    <>
                        {/* Lista de itens */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {isEmpty ? (
                                <div className="text-center text-gray-500 py-8">
                                    <p className="text-4xl mb-2">🍽️</p>
                                    <p>Seu carrinho está vazio</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 rounded-lg p-3 flex gap-3"
                                        >
                                            <div className="text-3xl">
                                                {item.product.Product_Image ||
                                                    '🍽️'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">
                                                    {item.product.Product_Name}
                                                </p>
                                                <p className="text-orange-600 font-semibold">
                                                    {formatPrice(
                                                        item.product
                                                            .Product_Price
                                                    )}
                                                </p>
                                                {item.notes && (
                                                    <p className="text-xs text-gray-500 italic">
                                                        {item.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            index,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                                >
                                                    −
                                                </button>
                                                <span className="w-6 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            index,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                    className="text-red-500 hover:text-red-700 ml-2"
                                                    title="Remover"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nome do cliente */}
                        <div className="border-t p-4 bg-gray-50">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                👤 Seu nome
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                placeholder="Digite seu nome"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                maxLength={100}
                            />
                        </div>

                        {/* Seleção de mesa */}
                        <div className="border-t p-4 bg-gray-50">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📍 Em qual mesa você está?
                            </label>
                            {loading ? (
                                <p className="text-gray-500 text-sm">
                                    Carregando mesas...
                                </p>
                            ) : tables.length === 0 ? (
                                <p className="text-amber-600 text-sm">
                                    ⚠️ Nenhuma mesa disponível no momento.
                                </p>
                            ) : (
                                <select
                                    value={selectedTable?.id || ''}
                                    onChange={e => {
                                        const table = tables.find(
                                            t =>
                                                t.id ===
                                                parseInt(e.target.value)
                                        );
                                        setSelectedTable(table || null);
                                    }}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                >
                                    <option value="">Selecione sua mesa</option>
                                    {tables.map(table => (
                                        <option key={table.id} value={table.id}>
                                            Mesa {table.table_number}
                                            {table.location &&
                                                ` - ${table.location}`}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Erro */}
                        {error && (
                            <div className="px-4 pb-2">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Footer com total e botão */}
                        <div className="border-t p-4 bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600">Total:</span>
                                <span className="text-2xl font-bold text-orange-600">
                                    {formatPrice(getTotal())}
                                </span>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    submitting || isEmpty || tables.length === 0
                                }
                                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Enviando...
                                    </>
                                ) : (
                                    <>📤 Enviar Pedido</>
                                )}
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-2">
                                ⚠️ Disponível apenas para clientes presenciais
                            </p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
