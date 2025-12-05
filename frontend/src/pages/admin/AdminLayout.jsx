import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Menu items - Funcionários só aparece para admins
    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
        { path: '/admin/orders', label: 'Pedidos', icon: '🍽️' },
        { path: '/admin/products', label: 'Produtos', icon: '🍕' },
        { path: '/admin/classes', label: 'Categorias', icon: '📁' },
        { path: '/admin/schedules', label: 'Agendamentos', icon: '📅' },
        { path: '/admin/queue', label: 'Fila de Espera', icon: '🎫' },
        { path: '/admin/tables', label: 'Mesas', icon: '🪑' },
        ...(user?.role === 'admin'
            ? [{ path: '/admin/employees', label: 'Funcionários', icon: '👥' }]
            : [])
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-orange-900 text-white px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-orange-800 transition-colors"
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {sidebarOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
                <h1 className="text-lg font-bold">🍞 Admin</h1>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-64 bg-orange-900 text-white min-h-screen
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col
                `}
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold">🍞 Admin</h1>
                    <p className="text-orange-200 text-sm">Encantos do Forno</p>
                </div>

                {/* User Info */}
                {user && (
                    <div className="px-6 py-3 bg-orange-800/50 border-y border-orange-700">
                        <p className="text-sm text-orange-200">Logado como:</p>
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-xs text-orange-300 truncate">
                            {user.email}
                        </p>
                    </div>
                )}

                <nav className="mt-4 flex-1 overflow-y-auto">
                    {menuItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={closeSidebar}
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

                <div className="p-6 space-y-3 border-t border-orange-800">
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
            <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 min-w-0">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
