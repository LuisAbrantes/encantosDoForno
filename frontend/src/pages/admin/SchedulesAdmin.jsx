import React, { useState, useEffect } from 'react';
import { scheduleService } from '../../services/api';

const SchedulesAdmin = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, today, upcoming, past

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await scheduleService.getSorted('desc');
            setSchedules(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async id => {
        if (
            window.confirm('Tem certeza que deseja excluir este agendamento?')
        ) {
            try {
                await scheduleService.delete(id);
                fetchSchedules();
            } catch (error) {
                console.error('Erro ao excluir agendamento:', error);
                alert('Erro ao excluir agendamento');
            }
        }
    };

    const formatDate = dateString => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = dateString => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFilteredSchedules = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return schedules.filter(schedule => {
            if (!schedule.Date) return filter === 'all';

            const scheduleDate = new Date(schedule.Date);
            scheduleDate.setHours(0, 0, 0, 0);

            switch (filter) {
                case 'today':
                    return scheduleDate.getTime() === today.getTime();
                case 'upcoming':
                    return scheduleDate.getTime() >= today.getTime();
                case 'past':
                    return scheduleDate.getTime() < today.getTime();
                default:
                    return true;
            }
        });
    };

    const getStatusBadge = dateString => {
        if (!dateString) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduleDate = new Date(dateString);
        scheduleDate.setHours(0, 0, 0, 0);

        if (scheduleDate.getTime() === today.getTime()) {
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Hoje
                </span>
            );
        } else if (scheduleDate.getTime() > today.getTime()) {
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    Futuro
                </span>
            );
        } else {
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    Passado
                </span>
            );
        }
    };

    const filteredSchedules = getFilteredSchedules();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    📅 Agendamentos
                </h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition ${
                            filter === 'all'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        Todos ({schedules.length})
                    </button>
                    <button
                        onClick={() => setFilter('today')}
                        className={`px-4 py-2 rounded-lg transition ${
                            filter === 'today'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        Hoje
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg transition ${
                            filter === 'upcoming'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        Futuros
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-lg transition ${
                            filter === 'past'
                                ? 'bg-gray-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        Passados
                    </button>
                </div>
            </div>

            {/* Schedules Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {filteredSchedules.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">
                        Nenhum agendamento encontrado
                    </p>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Data
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Horário
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Pessoas
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Contato
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredSchedules.map(schedule => (
                                <tr
                                    key={schedule.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        {getStatusBadge(schedule.Date)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800">
                                        {formatDate(schedule.Date)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800">
                                        {formatTime(schedule.Date)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800">
                                        👥 {schedule.HM_Peoples} pessoas
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={`tel:${schedule.Number_to_Contact}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            📞 {schedule.Number_to_Contact}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <a
                                            href={`https://wa.me/55${schedule.Number_to_Contact?.replace(
                                                /\D/g,
                                                ''
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:text-green-800 mr-4"
                                        >
                                            💬 WhatsApp
                                        </a>
                                        <button
                                            onClick={() =>
                                                handleDelete(schedule.id)
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SchedulesAdmin;
