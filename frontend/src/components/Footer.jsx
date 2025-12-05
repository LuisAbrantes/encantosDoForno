import React from 'react';
import { SOCIAL_MEDIA, ADDRESS, RESTAURANT_CONFIG } from '../config/constants';

const Footer = () => {
    return (
        <footer className="bg-linear-to-r from-orange-900 to-red-950 text-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Informações de Contato */}
                    <div>
                        <h3 className="font-dancing text-2xl mb-4 flex items-center space-x-2">
                            <span className="text-2xl">🔥</span>
                            <span>Encantos do Forno</span>
                        </h3>
                        <p className="font-sans text-amber-100 mb-2">
                            Localizado em Jacareí, SP
                        </p>
                        <div className="space-y-2 font-sans text-amber-100">
                            <p className="flex items-center space-x-2">
                                <span>📞</span>
                                <span>(12) 99261-1931</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <span>📧</span>
                                <span>contato@encantosdoforno.com.br</span>
                            </p>
                            <div className="flex items-start space-x-2">
                                <span className="text-xl">⏰</span>
                                <div className="space-y-1">
                                    <div>
                                        <p className="font-semibold text-amber-50">
                                            {
                                                RESTAURANT_CONFIG.schedule
                                                    .weekdays.days
                                            }
                                            :
                                        </p>
                                        <p className="text-sm">
                                            {
                                                RESTAURANT_CONFIG.schedule
                                                    .weekdays.hours
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-50">
                                            {
                                                RESTAURANT_CONFIG.schedule
                                                    .weekend.days
                                            }
                                            :
                                        </p>
                                        <p className="text-sm">
                                            {
                                                RESTAURANT_CONFIG.schedule
                                                    .weekend.hours
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Redes Sociais */}
                    <div>
                        <h3 className="font-dancing text-2xl mb-4">Siga-nos</h3>
                        <div className="flex space-x-4">
                            <a
                                href={SOCIAL_MEDIA.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-linear-to-br from-purple-600 to-pink-500 p-3 rounded-lg hover:scale-110 transition-transform duration-300 shadow-lg"
                                aria-label="Instagram"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href={SOCIAL_MEDIA.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 p-3 rounded-lg hover:scale-110 transition-transform duration-300 shadow-lg"
                                aria-label="WhatsApp"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </a>
                            <a
                                href={SOCIAL_MEDIA.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 p-3 rounded-lg hover:scale-110 transition-transform duration-300 shadow-lg"
                                aria-label="Facebook"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Localização */}
                    <div>
                        <h3 className="font-dancing text-2xl mb-4">
                            Onde Estamos
                        </h3>
                        <p className="text-amber-100 mb-4">
                            {ADDRESS.street}
                            <br />
                            {ADDRESS.neighborhood} - {ADDRESS.city}/
                            {ADDRESS.state}
                            <br />
                            CEP: {ADDRESS.zipCode}
                        </p>
                        <a
                            href={ADDRESS.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <span>📍</span>
                            <span>Ver no Mapa</span>
                        </a>
                    </div>
                </div>

                {/* Mapa Embed */}
                <div className="mt-8 rounded-lg overflow-hidden shadow-2xl">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14660.842624373948!2d-45.966659!3d-23.305278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cdc89a56ce3f83%3A0x3d2d5a3e3f3f3f3f!2sJacareí%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890123"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Localização Encantos do Forno"
                    ></iframe>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-orange-800 text-center text-amber-200">
                    <p>
                        &copy; 2025 Encantos do Forno - Jacareí/SP. Todos os
                        direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
