import { useContext } from 'react';
import CartContext from '../context/CartContext';

/**
 * Hook para usar o carrinho
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
};

export default useCart;
