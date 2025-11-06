import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { RESTAURANT_CONFIG, SOCIAL_MEDIA, IMAGES } from '../config/constants';

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <HeroSection />

            {/* Sobre o Restaurante */}
            <section className="py-20 bg-amber-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-dancing text-5xl md:text-6xl text-orange-900 mb-4">
                            Nossa História
                        </h2>
                        <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <p className="font-sans text-lg text-gray-700 leading-relaxed">
                                Localizado no coração de{' '}
                                <strong>Jacareí</strong>, o Encantos do Forno
                                nasceu do sonho de criar um espaço onde as
                                pessoas pudessem se reunir em torno de comida
                                feita com amor e dedicação.
                            </p>
                            <p className="font-sans text-lg text-gray-700 leading-relaxed">
                                Nossos pratos são preparados com{' '}
                                <strong>ingredientes frescos</strong> e
                                selecionados, respeitando receitas tradicionais
                                e trazendo o sabor autêntico que aquece o
                                coração.
                            </p>
                            <p className="font-sans text-lg text-gray-700 leading-relaxed">
                                Aqui, tradição e sabor se encontram para
                                proporcionar uma experiência gastronômica
                                inesquecível.
                            </p>

                            <div className="grid grid-cols-3 gap-4 pt-6">
                                <div className="text-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="text-3xl mb-2">🌟</div>
                                    <div className="font-bold text-orange-900">
                                        Qualidade
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="text-3xl mb-2">🔥</div>
                                    <div className="font-bold text-orange-900">
                                        Artesanal
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="text-3xl mb-2">❤️</div>
                                    <div className="font-bold text-orange-900">
                                        Acolhedor
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070"
                                alt="Interior aconchegante do restaurante"
                                className="rounded-lg shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-lg shadow-xl">
                                <p className="text-3xl font-bold">+10</p>
                                <p className="text-sm">Anos de tradição</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nossa Equipe */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-dancing text-5xl md:text-6xl text-orange-900 mb-4">
                            Nossa Equipe
                        </h2>
                        <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
                        <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">
                            Conheça as pessoas apaixonadas que preparam cada
                            prato com carinho e dedicação
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Chef 1 */}
                        <div className="bg-amber-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="h-64 bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center">
                                <div className="text-8xl">👨‍🍳</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-dancing text-3xl text-orange-900 mb-2">
                                    Chef Antonio Silva
                                </h3>
                                <p className="font-sans text-amber-700 font-semibold mb-3">
                                    Chef Executivo
                                </p>
                                <p className="font-sans text-gray-600">
                                    Com 20 anos de experiência, Chef Antonio
                                    traz técnicas tradicionais e um toque de
                                    inovação para cada receita.
                                </p>
                            </div>
                        </div>

                        {/* Chef 2 */}
                        <div className="bg-amber-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="h-64 bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                <div className="text-8xl">👩‍🍳</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-dancing text-3xl text-orange-900 mb-2">
                                    Chef Maria Santos
                                </h3>
                                <p className="font-sans text-amber-700 font-semibold mb-3">
                                    Confeiteira
                                </p>
                                <p className="font-sans text-gray-600">
                                    Especialista em doces artesanais, Maria cria
                                    sobremesas que são verdadeiras obras de
                                    arte.
                                </p>
                            </div>
                        </div>

                        {/* Proprietário */}
                        <div className="bg-amber-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="h-64 bg-linear-to-br from-red-400 to-orange-600 flex items-center justify-center">
                                <div className="text-8xl">🧑‍💼</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-dancing text-3xl text-orange-900 mb-2">
                                    João Oliveira
                                </h3>
                                <p className="text-amber-700 font-semibold mb-3">
                                    Proprietário
                                </p>
                                <p className="text-gray-600">
                                    Fundador do Encantos do Forno, João
                                    transformou seu amor pela gastronomia em um
                                    espaço acolhedor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cardápio em Destaque */}
            <section className="py-20 bg-linear-to-b from-amber-50 to-orange-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-dancing text-5xl md:text-6xl text-orange-900 mb-4">
                            Pratos em Destaque
                        </h2>
                        <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
                        <p className="font-sans text-lg text-gray-700 max-w-2xl mx-auto">
                            Conheça alguns dos nossos pratos mais amados,
                            preparados com ingredientes locais e muito sabor
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Prato 1 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="h-48 bg-linear-to-br from-red-400 to-orange-500 flex items-center justify-center">
                                <div className="text-7xl">🍕</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-dancing text-3xl text-orange-900 mb-2">
                                    Pizza Artesanal
                                </h3>
                                <p className="font-sans text-gray-600 mb-4 leading-relaxed">
                                    Massa fermentada por 48h, assada em forno a
                                    lenha com ingredientes frescos e
                                    selecionados.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-amber-700">
                                        R$ 45,00
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        🔥 Especialidade
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Prato 2 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="h-48 bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                                <div className="text-7xl">🥖</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-dancing text-3xl text-orange-900 mb-2">
                                    Pão de Fermentação Natural
                                </h3>
                                <p className="font-sans text-gray-600 mb-4 leading-relaxed">
                                    Pães artesanais feitos com fermentação
                                    lenta, crocantes por fora e macios por
                                    dentro.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-amber-700">
                                        R$ 18,00
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        🌾 Tradicional
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Prato 3 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="h-48 bg-linear-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                                <div className="text-7xl">🍰</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-dancing text-3xl text-orange-900 mb-2">
                                    Torta da Casa
                                </h3>
                                <p className="font-sans text-gray-600 mb-4 leading-relaxed">
                                    Torta artesanal com recheios variados, feita
                                    diariamente com ingredientes premium.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-amber-700">
                                        R$ 28,00
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ⭐ Favorita
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Prato 4 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="h-48 bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center">
                                <div className="text-7xl">🍝</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-dancing text-3xl text-orange-900 mb-2">
                                    Massa Fresca
                                </h3>
                                <p className="font-sans text-gray-600 mb-4 leading-relaxed">
                                    Massas preparadas na casa, com molhos
                                    caseiros e ingredientes da região.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-amber-700">
                                        R$ 38,00
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        🍝 Artesanal
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Prato 5 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="h-48 bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <div className="text-7xl">🥩</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-dancing text-3xl text-orange-900 mb-2">
                                    Carne Assada
                                </h3>
                                <p className="font-sans text-gray-600 mb-4 leading-relaxed">
                                    Carnes nobres preparadas no forno a lenha,
                                    macias e suculentas.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-amber-700">
                                        R$ 52,00
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        🥩 Premium
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Prato 6 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="h-48 bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                <div className="text-7xl">☕</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-dancing text-3xl text-orange-900 mb-2">
                                    Café Especial
                                </h3>
                                <p className="font-sans text-gray-600 mb-4 leading-relaxed">
                                    Cafés especiais da região, torrados e moídos
                                    na hora para máximo frescor.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-amber-700">
                                        R$ 12,00
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ☕ Local
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/cardapio"
                            className="inline-block bg-orange-700 hover:bg-orange-800 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 hover:scale-105 shadow-xl"
                        >
                            Ver Cardápio Completo →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Depoimentos */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-dancing text-5xl md:text-6xl text-orange-900 mb-4">
                            O Que Dizem Nossos Clientes
                        </h2>
                        <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
                        <p className="font-sans text-lg text-gray-600">
                            A opinião de quem já experimentou nossos pratos
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Depoimento 1 */}
                        <div className="bg-amber-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-amber-500 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="font-allura text-2xl text-gray-700 mb-4 italic text-readable leading-relaxed">
                                "A melhor pizza artesanal que já comi em
                                Jacareí! O ambiente é super acolhedor e o
                                atendimento impecável. Voltarei com certeza!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl mr-4">
                                    👤
                                </div>
                                <div>
                                    <p className="font-sans font-bold text-orange-900">
                                        Ana Paula
                                    </p>
                                    <p className="font-sans text-sm text-gray-500">
                                        Cliente desde 2023
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Depoimento 2 */}
                        <div className="bg-amber-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-amber-500 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="font-allura text-2xl text-gray-700 mb-4 italic text-readable leading-relaxed">
                                "Os pães são incríveis! Você sente que foram
                                feitos com amor. Virou tradição da família vir
                                aqui todo domingo."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-linear-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mr-4">
                                    👤
                                </div>
                                <div>
                                    <p className="font-bold text-orange-900">
                                        Carlos Eduardo
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Cliente desde 2022
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Depoimento 3 */}
                        <div className="bg-amber-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-amber-500 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="font-allura text-2xl text-gray-700 mb-4 italic text-readable leading-relaxed">
                                "Lugar perfeito para um almoço em família.
                                Comida de qualidade, ambiente agradável e preços
                                justos. Recomendo muito!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-linear-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-2xl mr-4">
                                    👤
                                </div>
                                <div>
                                    <p className="font-bold text-orange-900">
                                        Mariana Costa
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Cliente desde 2024
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-linear-to-r from-orange-800 to-red-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-dancing text-5xl md:text-6xl mb-6 text-readable-dark">
                        Pronto para uma experiência inesquecível?
                    </h2>
                    <p className="font-sans text-xl mb-8 text-amber-100 leading-relaxed">
                        Faça sua reserva e venha nos visitar! Estamos ansiosos
                        para receber você.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/agendamento"
                            className="font-vibes text-2xl bg-white text-orange-900 hover:bg-amber-100 py-4 px-10 rounded-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                        >
                            Agendar Visita 📅
                        </Link>
                        <a
                            href={SOCIAL_MEDIA.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-vibes text-2xl bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                        >
                            WhatsApp 💬
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
