import React, { useState, useEffect } from 'react';
import { productService, productClassService } from '../services/api';
import { useCart } from '../context/CartContext';
import CartButton from '../components/CartButton';
import CartDrawer from '../components/CartDrawer';

const Cardapio = () => {
    const [products, setProducts] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addItem } = useCart();

    // Estado para feedback visual ao adicionar
    const [addedProduct, setAddedProduct] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // Handler para adicionar produto ao carrinho
    const handleAddToCart = product => {
        addItem(product);
        setAddedProduct(product.id);
        setTimeout(() => setAddedProduct(null), 1000);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, classesRes] = await Promise.all([
                productService.getAll(),
                productClassService.getAll()
            ]);
            setProducts(productsRes.data || []);
            setClasses(classesRes.data || []);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError('Não foi possível carregar o cardápio. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Agrupa produtos por classe
    const getProductsByClass = classId => {
        return products.filter(product => product.productClassId === classId);
    };

    // Formata preço para exibição
    const formatPrice = price => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600 mx-auto mb-4"></div>
                    <p className="font-dancing text-2xl text-orange-900">
                        Carregando cardápio...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <p className="text-red-600 text-xl mb-4">😕 {error}</p>
                    <button
                        onClick={fetchData}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    // Classes vazias - mostrar mensagem
    if (classes.length === 0) {
        return (
            <div className="min-h-screen bg-amber-50">
                <section className="bg-linear-to-r from-orange-800 to-red-900 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="font-pacifico text-6xl md:text-7xl mb-4 text-readable-dark">
                            Nosso Cardápio
                        </h1>
                    </div>
                </section>
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <p className="font-dancing text-3xl text-orange-900 mb-4">
                            🍽️ Cardápio em construção!
                        </p>
                        <p className="text-gray-600">
                            Em breve teremos delícias para você.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Componentes do Carrinho */}
            <CartButton />
            <CartDrawer />

            {/* Header */}
            <section className="bg-linear-to-r from-orange-800 to-red-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-pacifico text-6xl md:text-7xl mb-4">
                        Nosso Cardápio
                    </h1>
                    <p className="font-dancing text-2xl text-amber-100">
                        Descubra os sabores artesanais que preparamos com
                        carinho
                    </p>
                    {/* Aviso presencial */}
                    <div className="mt-6 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                        <span>🏠</span>
                        <span>Está no restaurante? Peça direto pelo site!</span>
                    </div>
                </div>
            </section>

            {/* Menu Categories */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {classes.map(category => {
                        const categoryProducts = getProductsByClass(
                            category.id
                        );

                        // Pula categorias sem produtos
                        if (categoryProducts.length === 0) return null;

                        return (
                            <div key={category.id} className="mb-16">
                                <div className="flex items-center justify-center mb-8">
                                    <span className="text-5xl mr-4">
                                        {category.Icon || '🍽️'}
                                    </span>
                                    <h2 className="font-dancing text-5xl text-orange-900">
                                        {category.Name}
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {categoryProducts.map(item => (
                                        <div
                                            key={item.id}
                                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">
                                                        {item.Product_Image ||
                                                            '🍽️'}
                                                    </span>
                                                    <h3 className="font-dancing text-2xl text-orange-900">
                                                        {item.Product_Name}
                                                    </h3>
                                                </div>
                                                <span className="text-xl font-bold text-amber-700">
                                                    {formatPrice(
                                                        item.Product_Price
                                                    )}
                                                </span>
                                            </div>
                                            <p className="font-sans text-gray-600 leading-relaxed">
                                                {item.Product_Description ||
                                                    'Delícia artesanal'}
                                            </p>
                                            {item.Product_Weight && (
                                                <p className="font-sans text-sm text-gray-400 mt-2">
                                                    {item.Product_Weight}
                                                </p>
                                            )}
                                            {/* Botão Adicionar */}
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(item)
                                                }
                                                className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                                                    addedProduct === item.id
                                                        ? 'bg-green-500 text-white scale-95'
                                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:scale-102'
                                                }`}
                                            >
                                                {addedProduct === item.id ? (
                                                    <span>✓ Adicionado!</span>
                                                ) : (
                                                    <span>
                                                        + Adicionar ao pedido
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-linear-to-r from-orange-100 to-amber-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-dancing text-4xl text-orange-900 mb-6">
                        Gostou do que viu?
                    </h2>
                    <p className="font-sans text-lg text-gray-700 mb-8">
                        Faça seu pedido pelo WhatsApp ou visite nossa loja!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/5512396100000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-vibes text-2xl bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center justify-center space-x-2"
                        >
                            <span>�</span>
                            <span>Pedir pelo WhatsApp</span>
                        </a>
                        <a
                            href="/agendamento"
                            className="font-vibes text-2xl bg-orange-700 hover:bg-orange-800 text-white py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center justify-center space-x-2"
                        >
                            <span>📅</span>
                            <span>Fazer Agendamento</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cardapio;
