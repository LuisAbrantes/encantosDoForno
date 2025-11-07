import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logoSemFundo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = path => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/cardapio', label: 'Cardápio' },
        { path: '/agendamento', label: 'Agendamento' },
        { path: '/fila', label: 'Fila' }
    ];

    return (
        <nav className="bg-linear-to-r from-orange-800 to-red-900 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <img
                            src={logo}
                            alt="Encantos do Forno Logo"
                            className="h-8 w-8 group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="font-pacifico text-2xl text-amber-100 group-hover:text-white transition-colors duration-300 tracking-wide">
                            Encantos do Forno
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                                    isActive(link.path)
                                        ? 'text-white'
                                        : 'text-amber-100 hover:text-white'
                                }`}
                            >
                                {link.label}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 animate-pulse"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-amber-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg p-2 transition-colors duration-300"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                        isActive(link.path)
                                            ? 'bg-orange-900 text-white'
                                            : 'text-amber-100 hover:bg-orange-700 hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
