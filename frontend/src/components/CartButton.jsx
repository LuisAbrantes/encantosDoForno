import React from 'react';
import { useCart } from '../context/CartContext';

/**
 * Botão flutuante do carrinho
 * Mostra quantidade de itens e abre o drawer ao clicar
 */
const CartButton = () => {
    const { getTotalItems, setIsOpen, isEmpty } = useCart();
    const totalItems = getTotalItems();

    if (isEmpty) return null;

    return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-2xl z-40 transition-all duration-300 hover:scale-110 flex items-center gap-2"
            aria-label="Abrir carrinho"
        >
            <span className="text-2xl">🛒</span>
            <span className="bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {totalItems}
            </span>
        </button>
    );
};

export default CartButton;
