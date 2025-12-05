import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES, RESTAURANT_CONFIG } from '../config/constants';

const HeroSection = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${IMAGES.hero})`,
                    filter: 'brightness(0.4)'
                }}
                aria-hidden="true"
            />

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-50"
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="font-pacifico text-4xl sm:text-5xl md:text-7xl text-white mb-4 sm:mb-6 animate-fade-in text-readable-dark">
                    Bem-vindo ao{' '}
                    <span className="text-amber-400">
                        {RESTAURANT_CONFIG.name}
                    </span>
                </h1>
                <p className="font-dancing text-xl sm:text-2xl md:text-3xl text-amber-100 mb-6 sm:mb-8 animate-slide-up">
                    Um espaço acolhedor com comida artesanal de Jacareí
                </p>
                <p className="font-sans text-base sm:text-lg text-amber-50 mb-8 sm:mb-10 max-w-2xl mx-auto animate-slide-up delay-100 leading-relaxed">
                    Saboreie pratos preparados com ingredientes frescos, muito
                    carinho e a tradição que aquece o coração.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up delay-200 px-4 sm:px-0">
                    <Link
                        to="/cardapio"
                        className="font-vibes text-xl sm:text-2xl bg-amber-600 hover:bg-amber-700 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                    >
                        Ver Cardápio 🍽️
                    </Link>
                    <Link
                        to="/agendamento"
                        className="font-vibes text-xl sm:text-2xl bg-orange-700 hover:bg-orange-800 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                    >
                        Faça sua Reserva 📅
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg
                    className="w-6 h-6 text-amber-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
};

export default HeroSection;
