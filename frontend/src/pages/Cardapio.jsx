import React from 'react';

const Cardapio = () => {
    const categories = [
        {
            name: 'Pães Caseiros',
            icon: '🥖',
            items: [
                {
                    name: 'Pão Caseiro Grande',
                    description:
                        '500g de pão amanteigado que vai bem com um café quentinho',
                    price: 'R$ 22,00',
                    weight: '500g'
                },
                {
                    name: 'Pão Integral 3 Grãos',
                    description:
                        '500g de pão integral com linhaça, gergelim branco e chia',
                    price: 'R$ 22,00',
                    weight: '500g'
                },
                {
                    name: 'Pacote com 4 Pães de Alho',
                    description:
                        'Quatro unidades de pão recheados com molho de alho tostado e temperos',
                    price: 'R$ 20,00',
                    weight: '4 unidades'
                }
            ]
        },
        {
            name: 'Tortas Salgadas',
            icon: '🥧',
            items: [
                {
                    name: 'Torta Deliciosa',
                    description:
                        'Escolha entre os sabores: Baiana com cenoura (requeijão opcional), Grão de bico com queijo, Frango com catupiry e azeitona',
                    price: 'R$ 25,00'
                },
                {
                    name: 'Torta Especial de Palmito',
                    description: 'Torta especial recheada com palmito',
                    price: 'R$ 29,00',
                    weight: '800g'
                }
            ]
        },
        {
            name: 'Café da Manhã',
            icon: '☕',
            subtitle: 'Salgados',
            items: [
                {
                    name: 'Bauru Assado de Presunto e Queijo',
                    description:
                        'Salgado assado recheado com presunto e queijo',
                    price: 'R$ 5,50'
                },
                {
                    name: 'Bauru Assado de Tomate e Queijo',
                    description: 'Salgado assado recheado com tomate e queijo',
                    price: 'R$ 5,50'
                },
                {
                    name: 'Assado de Salsicha',
                    description: 'Salgado assado recheado com salsicha',
                    price: 'R$ 5,50'
                }
            ]
        },
        {
            name: 'Bebidas Quentes',
            icon: '☕',
            subtitle: 'Para acompanhar seu café da manhã',
            items: [
                {
                    name: 'Café Preto',
                    description: 'Café coado tradicional',
                    price: 'R$ 3,00'
                },
                {
                    name: 'Café com Leite',
                    description: 'Café com leite cremoso',
                    price: 'R$ 4,00'
                },
                {
                    name: 'Água',
                    description: 'Água mineral',
                    price: 'R$ 3,00'
                }
            ]
        },
        {
            name: 'Doces',
            icon: '🍰',
            items: [
                {
                    name: 'Fatia de Bolo de Cenoura',
                    description: 'Bolo de cenoura com cobertura de chocolate',
                    price: 'R$ 8,00'
                },
                {
                    name: 'Empada de Doce de Leite',
                    description: 'Empada recheada com doce de leite cremoso',
                    price: 'R$ 2,50'
                },
                {
                    name: 'Copo de Mini Donuts',
                    description:
                        '8 unidades de mini donuts com cobertura de chocolate',
                    price: 'R$ 20,00',
                    weight: '8 unidades'
                }
            ]
        },
        {
            name: 'Bebidas',
            icon: '�',
            items: [
                {
                    name: 'Suco de Laranja',
                    description: 'Suco natural de laranja',
                    price: 'R$ 8,00',
                    weight: '350ml'
                },
                {
                    name: 'Coca-Cola Zero Açúcar',
                    description: 'Refrigerante sem açúcar',
                    price: 'R$ 4,50',
                    weight: '250ml'
                },
                {
                    name: 'Copão Gin Sabores',
                    description: 'Gin com diversos sabores',
                    price: 'R$ 16,00',
                    weight: '700ml'
                },
                {
                    name: 'Caipirinha no Copão',
                    description: 'Caipirinha tradicional',
                    price: 'R$ 22,00',
                    weight: '700ml'
                },
                {
                    name: 'Água',
                    description: 'Água mineral',
                    price: 'R$ 4,00'
                }
            ]
        },
        {
            name: 'Geleias Artesanais',
            icon: '�',
            items: [
                {
                    name: 'Geleia de Morango',
                    description:
                        'Geleia artesanal deliciosa e firme, de morango com limão. Vai bem com pães, iogurtes e até mesmo pura!',
                    price: 'R$ 22,00'
                },
                {
                    name: 'Geleia de Maçã',
                    description:
                        'Geleia artesanal feita com maçãs e canela. Vai bem com mingau, biscoitos, bolos e até mesmo pura!',
                    price: 'R$ 24,00'
                }
            ]
        },
        {
            name: 'Cafés',
            icon: '☕',
            items: [
                {
                    name: 'Café Orgânico em Pó',
                    description: 'Café orgânico moído',
                    price: 'R$ 25,00',
                    weight: '200g'
                },
                {
                    name: 'Café Solúvel',
                    description: 'Café solúvel que rende até 40 xícaras',
                    price: 'R$ 15,00'
                }
            ]
        },
        {
            name: 'Almoço',
            icon: '🍽️',
            subtitle: 'Cardápio Semanal',
            special: true,
            days: [
                {
                    day: 'Quarta-feira',
                    options: [
                        {
                            name: 'Ragu de Calabresa com Polenta',
                            price: 'R$ 25,00',
                            type: 'normal'
                        },
                        {
                            name: 'Carne de Soja ao Pomodoro',
                            price: 'R$ 22,00',
                            type: 'vegetariano'
                        }
                    ]
                },
                {
                    day: 'Quinta-feira',
                    options: [
                        {
                            name: 'Carne de Panela com Batatas',
                            price: 'R$ 25,00',
                            type: 'normal'
                        },
                        {
                            name: 'Lentilha Refogada com Legumes',
                            price: 'R$ 22,00',
                            type: 'vegetariano'
                        }
                    ]
                },
                {
                    day: 'Sexta-feira',
                    options: [
                        {
                            name: 'Fraldinha Assada com Batata',
                            price: 'R$ 25,00',
                            type: 'normal'
                        },
                        {
                            name: 'Berinjela à Milanesa com Abóbora Cozida',
                            price: 'R$ 22,00',
                            type: 'vegetariano'
                        }
                    ]
                }
            ],
            note: 'Todos os pratos acompanham: Arroz, feijão e batata frita',
            studentPrice: 'Para alunos e professores: R$ 15,00'
        }
    ];

    return (
        <div className="min-h-screen bg-amber-50">
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
                </div>
            </section>

            {/* Menu Categories */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {categories.map((category, index) => (
                        <div key={index} className="mb-16">
                            <div className="flex items-center justify-center mb-2">
                                <span className="text-5xl mr-4">
                                    {category.icon}
                                </span>
                                <h2 className="font-dancing text-5xl text-orange-900">
                                    {category.name}
                                </h2>
                            </div>

                            {category.subtitle && (
                                <p className="text-center text-gray-600 text-lg mb-6 font-sans">
                                    {category.subtitle}
                                </p>
                            )}

                            {/* Almoço - Layout especial */}
                            {category.special ? (
                                <div className="space-y-8">
                                    {category.days.map((dayMenu, dayIndex) => (
                                        <div
                                            key={dayIndex}
                                            className="bg-white p-8 rounded-lg shadow-lg"
                                        >
                                            <h3 className="font-dancing text-3xl text-orange-800 mb-6 text-center border-b-2 border-orange-200 pb-3">
                                                {dayMenu.day}
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {dayMenu.options.map(
                                                    (option, optIndex) => (
                                                        <div
                                                            key={optIndex}
                                                            className="bg-linear-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-md"
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-sans font-semibold text-xl text-gray-800 flex-1">
                                                                    {
                                                                        option.name
                                                                    }
                                                                    {option.type ===
                                                                        'vegetariano' && (
                                                                        <span className="ml-2 text-green-600 text-sm">
                                                                            🌱
                                                                        </span>
                                                                    )}
                                                                </h4>
                                                                <span className="text-xl font-bold text-orange-700 ml-4">
                                                                    {
                                                                        option.price
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Notas especiais do almoço */}
                                    <div className="bg-linear-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-300 shadow-md">
                                        <div className="flex items-start space-x-3 mb-4">
                                            <span className="text-2xl">✨</span>
                                            <p className="font-sans text-gray-700 text-lg">
                                                <strong className="text-green-800">
                                                    Importante:
                                                </strong>{' '}
                                                {category.note}
                                            </p>
                                        </div>
                                        <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-green-200">
                                            <span className="text-2xl">🎓</span>
                                            <p className="font-sans text-gray-700 text-lg">
                                                <strong className="text-amber-800">
                                                    Desconto Especial:
                                                </strong>{' '}
                                                {category.studentPrice}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Layout padrão para outras categorias */
                                <div className="grid md:grid-cols-2 gap-6">
                                    {category.items.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-orange-400"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-dancing text-2xl text-orange-900 mb-1">
                                                        {item.name}
                                                    </h3>
                                                    {item.weight && (
                                                        <span className="text-sm text-gray-500 font-sans">
                                                            {item.weight}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xl font-bold text-amber-700 ml-4">
                                                    {item.price}
                                                </span>
                                            </div>
                                            <p className="font-sans text-gray-600 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
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
