import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'encantos_cart';

/**
 * Provider do carrinho de compras
 * Gerencia estado global do carrinho com persistência em sessionStorage
 */
export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Carrega carrinho do sessionStorage ao iniciar
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setItems(parsed.items || []);
                setSelectedTable(parsed.selectedTable || null);
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
        }
    }, []);

    // Salva carrinho no sessionStorage quando muda
    useEffect(() => {
        try {
            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ items, selectedTable })
            );
        } catch (error) {
            console.error('Erro ao salvar carrinho:', error);
        }
    }, [items, selectedTable]);

    /**
     * Adiciona item ao carrinho
     * Se o produto já existe, incrementa a quantidade
     */
    const addItem = (product, quantity = 1, notes = '') => {
        setItems(current => {
            const existingIndex = current.findIndex(
                item => item.product.id === product.id && item.notes === notes
            );

            if (existingIndex >= 0) {
                // Incrementa quantidade do item existente
                const updated = [...current];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                };
                return updated;
            }

            // Adiciona novo item
            return [
                ...current,
                {
                    product,
                    quantity,
                    notes
                }
            ];
        });
    };

    /**
     * Remove item do carrinho
     */
    const removeItem = index => {
        setItems(current => current.filter((_, i) => i !== index));
    };

    /**
     * Atualiza quantidade de um item
     */
    const updateQuantity = (index, quantity) => {
        if (quantity < 1) {
            removeItem(index);
            return;
        }

        setItems(current => {
            const updated = [...current];
            updated[index] = { ...updated[index], quantity };
            return updated;
        });
    };

    /**
     * Limpa o carrinho completamente
     */
    const clearCart = () => {
        setItems([]);
        setSelectedTable(null);
        setCustomerName('');
        sessionStorage.removeItem(STORAGE_KEY);
    };

    /**
     * Calcula total do carrinho
     */
    const getTotal = () => {
        return items.reduce((sum, item) => {
            const price = parseFloat(item.product.Product_Price) || 0;
            return sum + price * item.quantity;
        }, 0);
    };

    /**
     * Retorna quantidade total de itens
     */
    const getTotalItems = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    /**
     * Prepara dados para envio do pedido
     */
    const getOrderData = () => {
        return {
            table_id: selectedTable?.id,
            customer_name: customerName.trim() || null,
            items: items.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                notes: item.notes || null
            }))
        };
    };

    const value = {
        items,
        selectedTable,
        customerName,
        isOpen,
        setSelectedTable,
        setCustomerName,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalItems,
        getOrderData,
        isEmpty: items.length === 0
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};

export default CartContext;
