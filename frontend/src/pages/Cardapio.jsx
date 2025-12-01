import React from 'react';

const Cardapio = () => {
    const categories = [
        {
            name: 'Pizzas Artesanais',
            icon: '🍕',
            items: [
                {
                    name: 'Margherita',
                    description:
                        'Molho de tomate, mussarela, manjericão fresco',
                    price: 'R$ 42,00'
                },
                {
                    name: 'Calabresa Especial',
                    description:
                        'Calabresa artesanal, cebola caramelizada, azeitonas',
                    price: 'R$ 45,00'
                },
                {
                    name: 'Quatro Queijos',
                    description: 'Mussarela, parmesão, gorgonzola, provolone',
                    price: 'R$ 48,00'
                },
                {
                    name: 'Portuguesa',
                    description: 'Presunto, ovos, cebola, azeitonas, ervilha',
                    price: 'R$ 46,00'
                }
            ]
        },
        {
            name: 'Pães Artesanais',
            icon: '🥖',
            items: [
                {
                    name: 'Pão de Fermentação Natural',
                    description: 'Pão de massa madre, crocante e saboroso',
                    price: 'R$ 18,00'
                },
                {
                    name: 'Ciabatta',
                    description: 'Pão italiano tradicional com azeite',
                    price: 'R$ 15,00'
                },
                {
                    name: 'Baguete',
                    description: 'Pão francês artesanal',
                    price: 'R$ 12,00'
                },
                {
                    name: 'Focaccia',
                    description: 'Pão italiano com ervas e azeite',
                    price: 'R$ 20,00'
                }
            ]
        },
        {
            name: 'Massas Frescas',
            icon: '🍝',
            items: [
                {
                    name: 'Fettuccine ao Molho Branco',
                    description: 'Massa fresca com molho cremoso',
                    price: 'R$ 38,00'
                },
                {
                    name: 'Penne ao Molho Pesto',
                    description: 'Penne com molho pesto caseiro',
                    price: 'R$ 36,00'
                },
                {
                    name: 'Lasanha Bolonhesa',
                    description: 'Lasanha tradicional com molho bolonhesa',
                    price: 'R$ 42,00'
                },
                {
                    name: 'Ravioli de Ricota',
                    description: 'Ravioli recheado com ricota e espinafre',
                    price: 'R$ 40,00'
                }
            ]
        },
        {
            name: 'Carnes',
            icon: '🥩',
            items: [
                {
                    name: 'Picanha Assada',
                    description: 'Picanha ao ponto com batatas rústicas',
                    price: 'R$ 58,00'
                },
                {
                    name: 'Costela no Forno',
                    description: 'Costela bovina assada por 6 horas',
                    price: 'R$ 52,00'
                },
                {
                    name: 'Frango Caipira',
                    description: 'Frango orgânico assado com legumes',
                    price: 'R$ 42,00'
                },
                {
                    name: 'Cordeiro ao Forno',
                    description: 'Paleta de cordeiro com ervas finas',
                    price: 'R$ 65,00'
                }
            ]
        },
        {
            name: 'Sobremesas',
            icon: '🍰',
            items: [
                {
                    name: 'Torta de Limão',
                    description: 'Torta com merengue italiano',
                    price: 'R$ 22,00'
                },
                {
                    name: 'Brownie com Sorvete',
                    description: 'Brownie artesanal com sorvete de baunilha',
                    price: 'R$ 25,00'
                },
                {
                    name: 'Pudim de Leite',
                    description: 'Pudim caseiro tradicional',
                    price: 'R$ 18,00'
                },
                {
                    name: 'Cheesecake de Frutas Vermelhas',
                    description: 'Cheesecake com calda de frutas',
                    price: 'R$ 28,00'
                }
            ]
        },
        {
            name: 'Bebidas',
            icon: '☕',
            items: [
                {
                    name: 'Café Especial',
                    description: 'Café coado da região',
                    price: 'R$ 8,00'
                },
                {
                    name: 'Suco Natural',
                    description: 'Sucos naturais variados',
                    price: 'R$ 12,00'
                },
                {
                    name: 'Refrigerante',
                    description: 'Lata 350ml',
                    price: 'R$ 6,00'
                },
                {
                    name: 'Vinho da Casa',
                    description: 'Taça 150ml',
                    price: 'R$ 18,00'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Header */}
            <section className="bg-linear-to-r from-orange-800 to-red-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-pacifico text-6xl md:text-7xl mb-4 text-readable-dark">
                        Nosso Cardápio
                    </h1>
                    <p className="font-dancing text-2xl text-amber-100">
                        Descubra os sabores artesanais que preparamos com
                        carinho
                    </p>
                </div>
            </section>

            {/* Menu Categories */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {categories.map((category, index) => (
                        <div key={index} className="mb-16">
                            <div className="flex items-center justify-center mb-8">
                                <span className="text-5xl mr-4">
                                    {category.icon}
                                </span>
                                <h2 className="font-dancing text-5xl text-orange-900">
                                    {category.name}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {category.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-dancing text-2xl text-orange-900">
                                                {item.name}
                                            </h3>
                                            <span className="text-xl font-bold text-amber-700">
                                                {item.price}
                                            </span>
                                        </div>
                                        <p className="font-sans text-gray-600 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-dancing text-4xl text-orange-900 mb-6">
                        Gostou do que viu?
                    </h2>
                    <p className="font-sans text-lg text-gray-600 mb-8">
                        Faça sua reserva ou peça para viagem!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/agendamento"
                            className="font-vibes text-2xl bg-orange-700 hover:bg-orange-800 text-white py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Fazer Reserva 📅
                        </a>
                        <a
                            href="https://wa.me/5512396100000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-vibes text-2xl bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Pedir pelo WhatsApp 💬
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cardapio;
