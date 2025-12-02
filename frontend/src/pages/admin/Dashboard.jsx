import React, { useState, useEffect } from 'react';
import {
    productService,
    scheduleService,
    productClassService
} from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        classes: 0,
        schedules: 0,
        todaySchedules: 0
    });
    const [recentSchedules, setRecentSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [products, classes, schedules] = await Promise.all([
                productService.getAll(),
                productClassService.getAll(),
                scheduleService.getAll()
            ]);

            const today = new Date().toISOString().split('T')[0];
            const todayCount = (schedules.data || []).filter(
                s => s.Date && s.Date.startsWith(today)
            ).length;

            setStats({
                products: (products.data || []).length,
                classes: (classes.data || []).length,
                schedules: (schedules.data || []).length,
                todaySchedules: todayCount
            });

            // Últimos 5 agendamentos
            setRecentSchedules((schedules.data || []).slice(-5).reverse());
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon, label, value, color }) => (
        <div
            className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${color}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{label}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                <span className="text-4xl">{icon}</span>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon="🍕"
                    label="Produtos"
                    value={stats.products}
                    color="border-orange-500"
                />
                <StatCard
                    icon="📁"
                    label="Categorias"
                    value={stats.classes}
                    color="border-blue-500"
                />
                <StatCard
                    icon="📅"
                    label="Total Agendamentos"
                    value={stats.schedules}
                    color="border-green-500"
                />
                <StatCard
                    icon="🔔"
                    label="Agendamentos Hoje"
                    value={stats.todaySchedules}
                    color="border-purple-500"
                />
            </div>

            {/* Recent Schedules */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    📅 Últimos Agendamentos
                </h2>

                {recentSchedules.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Nenhum agendamento encontrado
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Data
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Pessoas
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Contato
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentSchedules.map(schedule => (
                                    <tr
                                        key={schedule.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {schedule.Date
                                                ? new Date(
                                                      schedule.Date
                                                  ).toLocaleDateString('pt-BR')
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {schedule.HM_Peoples} pessoas
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {schedule.Number_to_Contact}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
