import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ============================================================
// CONSTANTES
// ============================================================
const MESSAGES = {
    ERROR_GENERIC: 'Ocorreu um erro. Tente novamente.',
    INFO_TEXT: 'Acesso exclusivo para funcionários cadastrados.',
    INFO_CONTACT: 'Contate o administrador para obter credenciais.'
};

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

/**
 * Componente de alerta de erro reutilizável
 */
const ErrorAlert = ({ message }) => (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {message}
    </div>
);

/**
 * Componente de spinner de loading
 */
const LoadingSpinner = () => (
    <>
        <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
        Entrando...
    </>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = field => e => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.error);
            }
        } catch {
            setError(MESSAGES.ERROR_GENERIC);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl mb-2">🍞</h1>
                    <h2 className="text-2xl font-bold text-orange-900">
                        Encantos do Forno
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Acesso restrito para funcionários
                    </p>
                </header>

                {/* Error Alert */}
                {error && <ErrorAlert message={error} />}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            placeholder="seu@email.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            placeholder="••••••••"
                            minLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <LoadingSpinner /> : 'Entrar'}
                    </button>
                </form>

                {/* Info */}
                <footer className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        {MESSAGES.INFO_TEXT}
                        <br />
                        {MESSAGES.INFO_CONTACT}
                    </p>
                    <a
                        href="/"
                        className="inline-block mt-4 text-gray-500 hover:text-gray-700 text-sm"
                    >
                        ← Voltar para o site
                    </a>
                </footer>
            </div>
        </div>
    );
};

export default Login;
