import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
        { path: '/admin/products', label: 'Produtos', icon: '🍕' },
        { path: '/admin/classes', label: 'Categorias', icon: '📁' },
        { path: '/admin/schedules', label: 'Agendamentos', icon: '📅' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-orange-900 text-white min-h-screen relative">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">🍞 Admin</h1>
                    <p className="text-orange-200 text-sm">Encantos do Forno</p>
                </div>

                {/* User Info */}
                {user && (
                    <div className="px-6 py-3 bg-orange-800/50 border-y border-orange-700">
                        <p className="text-sm text-orange-200">Logado como:</p>
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-xs text-orange-300 truncate">{user.email}</p>
                    </div>
                )}

                <nav className="mt-4">
                    {menuItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center px-6 py-3 hover:bg-orange-800 transition-colors ${
                                    isActive
                                        ? 'bg-orange-800 border-r-4 border-amber-400'
                                        : ''
                                }`
                            }
                        >
                            <span className="mr-3 text-xl">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-64 p-6 space-y-3">
                    <a
                        href="/"
                        className="flex items-center text-orange-200 hover:text-white transition-colors"
                    >
                        ← Voltar ao site
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-orange-200 hover:text-white transition-colors w-full"
                    >
                        🚪 Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
