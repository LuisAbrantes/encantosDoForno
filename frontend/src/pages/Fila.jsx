import React, { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '../config/constants';

// ============================================================
// CONSTANTES
// ============================================================
const API_BASE = API_CONFIG.BASE_URL;
const POLLING_INTERVAL = 10000; // 10 segundos

const STATUS_CONFIG = {
    waiting: {
        color: 'bg-gray-400',
        text: 'Aguardando',
        bgClass: 'border-gray-200 bg-white'
    },
    called: {
        color: 'bg-green-500 animate-pulse',
        text: 'Sua vez! 🔔',
        bgClass: 'border-green-500 bg-green-50 shadow-lg'
    }
};

const MESSAGES = {
    QUEUE_CLOSED: 'A fila está fechada no momento. Volte mais tarde!',
    QUEUE_FULL:
        'A fila está cheia no momento. Tente novamente em alguns minutos.',
    ALREADY_IN_QUEUE: 'Este telefone já está na fila.',
    SUCCESS_JOIN: 'Você entrou na fila! Fique atento ao seu celular.',
    CONFIRM_LEAVE: 'Deseja sair da fila?',
    ERROR_GENERIC: 'Ocorreu um erro. Tente novamente.'
};

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

/**
 * Componente de status da fila
 */
const QueueStats = ({ queueInfo, loading }) => {
    if (loading) {
        return (
            <section className="py-8 bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-500">
                        Carregando...
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-6 sm:py-8 bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
                    <div className="p-3 sm:p-6 bg-amber-50 rounded-lg">
                        <div className="text-2xl sm:text-4xl font-bold text-orange-900 mb-1 sm:mb-2">
                            {queueInfo?.currentWaiting || 0}
                        </div>
                        <div className="text-xs sm:text-base text-gray-600">
                            Pessoas na fila
                        </div>
                    </div>
                    <div className="p-3 sm:p-6 bg-amber-50 rounded-lg">
                        <div className="text-2xl sm:text-4xl font-bold text-orange-900 mb-1 sm:mb-2">
                            ~{queueInfo?.estimatedWaitMinutes || 0} min
                        </div>
                        <div className="text-xs sm:text-base text-gray-600">
                            Tempo de espera
                        </div>
                    </div>
                    <div className="p-3 sm:p-6 bg-amber-50 rounded-lg">
                        <div
                            className={`text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 ${
                                queueInfo?.isOpen
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}
                        >
                            ●
                        </div>
                        <div className="text-xs sm:text-base text-gray-600">
                            {queueInfo?.isOpen ? 'Fila aberta' : 'Fila fechada'}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/**
 * Item da fila
 */
const QueueItem = ({ item, index, isCurrentUser }) => {
    const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.waiting;
    const isNext = index === 1 && item.status === 'waiting';

    return (
        <div
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isCurrentUser
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
                    : isNext
                    ? 'border-amber-500 bg-amber-50'
                    : statusConfig.bgClass
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-3 h-3 rounded-full ${
                                isNext ? 'bg-amber-500' : statusConfig.color
                            }`}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">
                            #{index}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-gray-800">
                            {item.customer_name}
                            {isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                    Você
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-600">
                            {item.party_size}{' '}
                            {item.party_size === 1 ? 'pessoa' : 'pessoas'}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-semibold text-orange-900">
                        ~
                        {item.estimated_wait_minutes ||
                            item.waitTimeMinutes ||
                            0}{' '}
                        min
                    </div>
                    <div className="text-xs text-gray-500">
                        {isNext ? 'Próximo na fila' : statusConfig.text}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Lista de informações
 */
const InfoBox = () => (
    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
            <span className="text-xl sm:text-2xl mr-2">💡</span>
            Como funciona?
        </h3>
        <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs sm:text-sm">
            <li>• Entre na fila preenchendo o formulário</li>
            <li>• Acompanhe sua posição em tempo real</li>
            <li>• Você será notificado via WhatsApp</li>
            <li>• Quando for sua vez, seu nome aparecerá como "Chamando"</li>
            <li>• Dirija-se à recepção do restaurante</li>
        </ul>
    </div>
);

/**
 * Formulário de entrada na fila
 */
const JoinQueueForm = ({
    formData,
    onChange,
    onSubmit,
    loading,
    estimatedWait,
    canJoin,
    queueInfo
}) => (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 lg:sticky lg:top-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-900 mb-4 sm:mb-6 flex items-center">
            <span className="text-3xl sm:text-4xl mr-2 sm:mr-3">📝</span>
            Entrar na Fila
        </h2>

        {!queueInfo?.isOpen && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-semibold">
                    {MESSAGES.QUEUE_CLOSED}
                </p>
                <p className="text-sm text-red-600 mt-1">
                    Horário: {queueInfo?.openingTime || '11:00'} às{' '}
                    {queueInfo?.closingTime || '22:00'}
                </p>
            </div>
        )}

        {queueInfo?.isFull && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-700 font-semibold">
                    {MESSAGES.QUEUE_FULL}
                </p>
            </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="nome"
                    className="block text-sm font-bold text-orange-900 mb-2"
                >
                    Nome *
                </label>
                <input
                    type="text"
                    id="nome"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                    placeholder="Seu nome"
                    disabled={!canJoin || loading}
                />
            </div>

            <div>
                <label
                    htmlFor="telefone"
                    className="block text-sm font-bold text-orange-900 mb-2"
                >
                    Telefone (WhatsApp) *
                </label>
                <input
                    type="tel"
                    id="telefone"
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                    placeholder="(12) 99999-9999"
                    disabled={!canJoin || loading}
                />
            </div>

            <div>
                <label
                    htmlFor="pessoas"
                    className="block text-sm font-bold text-orange-900 mb-2"
                >
                    Número de Pessoas *
                </label>
                <select
                    id="pessoas"
                    name="party_size"
                    required
                    value={formData.party_size}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                    disabled={!canJoin || loading}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>
                            {n} {n === 1 ? 'pessoa' : 'pessoas'}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={!canJoin || loading}
                className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {loading ? 'Entrando...' : 'Entrar na Fila 🎫'}
            </button>
        </form>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
                ⏱️ Tempo estimado de espera:{' '}
                <strong>~{estimatedWait} minutos</strong>
            </p>
        </div>
    </div>
);

/**
 * Card do usuário na fila
 */
const UserInQueueCard = ({
    userStatus,
    onLeave,
    onUpdatePartySize,
    loading
}) => {
    const [editing, setEditing] = useState(false);
    const [newPartySize, setNewPartySize] = useState(
        userStatus?.party_size || 2
    );

    const handleSave = () => {
        onUpdatePartySize(newPartySize);
        setEditing(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 lg:sticky lg:top-24">
            <div className="text-center">
                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
                    {userStatus?.status === 'called' ? '🔔' : '✅'}
                </div>
                <h2
                    className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 ${
                        userStatus?.status === 'called'
                            ? 'text-green-700 animate-pulse'
                            : 'text-green-700'
                    }`}
                >
                    {userStatus?.status === 'called'
                        ? 'Sua mesa está pronta!'
                        : 'Você está na fila!'}
                </h2>

                <div
                    className={`border rounded-lg p-6 mb-6 ${
                        userStatus?.status === 'called'
                            ? 'bg-green-100 border-green-300'
                            : 'bg-green-50 border-green-200'
                    }`}
                >
                    <p className="text-lg text-gray-700 mb-2">
                        Olá, <strong>{userStatus?.customer_name}</strong>!
                    </p>
                    <p className="text-3xl font-bold text-green-700 mb-2">
                        {userStatus?.status === 'called'
                            ? 'Sua vez chegou!'
                            : `Posição: #${userStatus?.position || '-'}`}
                    </p>
                    <p className="text-gray-600">
                        {editing ? (
                            <span className="flex items-center justify-center gap-2">
                                <select
                                    value={newPartySize}
                                    onChange={e =>
                                        setNewPartySize(e.target.value)
                                    }
                                    className="px-2 py-1 border rounded"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleSave}
                                    className="text-green-600 hover:text-green-800"
                                >
                                    ✓
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    ✕
                                </button>
                            </span>
                        ) : (
                            <span>
                                {userStatus?.party_size}{' '}
                                {userStatus?.party_size === 1
                                    ? 'pessoa'
                                    : 'pessoas'}
                                <button
                                    onClick={() => setEditing(true)}
                                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    ✏️ Editar
                                </button>
                            </span>
                        )}
                    </p>
                    {userStatus?.status !== 'called' && (
                        <p className="text-gray-600 mt-2">
                            Tempo de espera:{' '}
                            <strong>
                                ~{userStatus?.estimatedWaitMinutes || 0} min
                            </strong>
                        </p>
                    )}
                </div>

                {userStatus?.status === 'called' ? (
                    <p className="text-green-700 font-semibold mb-6">
                        Por favor, dirija-se à recepção do restaurante!
                    </p>
                ) : (
                    <p className="text-gray-600 mb-6">
                        Fique atento! Enviaremos uma notificação quando estiver
                        próximo da sua vez.
                    </p>
                )}

                <button
                    onClick={onLeave}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                    {loading ? 'Saindo...' : 'Sair da Fila'}
                </button>
            </div>
        </div>
    );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const Fila = () => {
    // Estado
    const [queueInfo, setQueueInfo] = useState(null);
    const [queueList, setQueueList] = useState([]);
    const [userStatus, setUserStatus] = useState(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        phone_number: '',
        party_size: '2'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Recupera ID salvo do localStorage
    const savedEntryId = localStorage.getItem('queueEntryId');

    // ========================================================
    // FUNÇÕES DE API
    // ========================================================

    /**
     * Busca informações públicas da fila
     */
    const fetchQueueInfo = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/queue/info`);
            const result = await response.json();
            if (result.success) {
                setQueueInfo(result.data);
            }
        } catch (err) {
            console.error('Erro ao buscar info da fila:', err);
        }
    }, []);

    /**
     * Busca status do usuário na fila
     * Limpa localStorage automaticamente se entrada não existe ou expirou
     */
    const fetchUserStatus = useCallback(async entryId => {
        if (!entryId) return;

        try {
            const response = await fetch(`${API_BASE}/queue/status/${entryId}`);
            const result = await response.json();

            if (result.success && result.data) {
                // Reseta contador de erros em caso de sucesso
                sessionStorage.removeItem('queueErrorCount');

                // Verifica se a entrada ainda está ativa
                const activeStatuses = ['waiting', 'called'];
                if (activeStatuses.includes(result.data.status)) {
                    setUserStatus(result.data);
                } else {
                    // Entrada existe mas foi finalizada (seated, cancelled, no_show)
                    console.log('Entrada finalizada:', result.data.status);
                    localStorage.removeItem('queueEntryId');
                    setUserStatus(null);
                }
            } else {
                // Entrada não encontrada ou expirada - limpa localStorage
                console.log('Entrada não encontrada, limpando localStorage');
                localStorage.removeItem('queueEntryId');
                setUserStatus(null);
            }
        } catch (err) {
            console.error('Erro ao buscar status:', err);
            // Em caso de erro de rede persistente, também limpa
            // para evitar usuário preso com entrada fantasma
            // Usa um contador de erros para não limpar no primeiro erro
            const errorCount = parseInt(
                sessionStorage.getItem('queueErrorCount') || '0'
            );
            if (errorCount >= 3) {
                console.log('Múltiplos erros de rede, limpando localStorage');
                localStorage.removeItem('queueEntryId');
                sessionStorage.removeItem('queueErrorCount');
                setUserStatus(null);
            } else {
                sessionStorage.setItem(
                    'queueErrorCount',
                    String(errorCount + 1)
                );
            }
        }
    }, []);

    /**
     * Busca lista pública da fila (limitada)
     */
    const fetchQueueList = useCallback(async () => {
        try {
            // Usa o endpoint de info que já tem a contagem
            // A lista pública mostra apenas posições, não dados sensíveis
            const response = await fetch(`${API_BASE}/queue/info`);
            const result = await response.json();
            if (result.success) {
                // Simula lista básica com base na contagem
                // O backend não expõe lista completa publicamente
                setQueueList([]);
            }
        } catch (err) {
            console.error('Erro ao buscar lista:', err);
        }
    }, []);

    // ========================================================
    // HANDLERS
    // ========================================================

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleJoinQueue = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE}/queue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: formData.customer_name,
                    phone_number: formData.phone_number.replace(/\D/g, ''),
                    party_size: parseInt(formData.party_size)
                })
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('queueEntryId', result.data.id);
                setUserStatus(result.data);
                alert(MESSAGES.SUCCESS_JOIN);
            } else {
                setError(result.error || MESSAGES.ERROR_GENERIC);
            }
        } catch (err) {
            setError(MESSAGES.ERROR_GENERIC);
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveQueue = async () => {
        if (!confirm(MESSAGES.CONFIRM_LEAVE)) return;

        setLoading(true);
        setError(''); // Limpa erros anteriores
        const entryId = localStorage.getItem('queueEntryId');

        try {
            const response = await fetch(`${API_BASE}/queue/${entryId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            // IDEMPOTENTE: Sempre limpa localStorage, independente do resultado
            // Isso garante que o usuário sempre consegue "sair" da fila
            localStorage.removeItem('queueEntryId');
            setUserStatus(null);
            fetchQueueInfo();

            // Mostra feedback apropriado, mas não bloqueia
            if (!result.success) {
                // Entrada já foi finalizada/expirada - não é um erro real
                console.log(
                    'Entrada já finalizada:',
                    result.message || result.error
                );
            }
        } catch (err) {
            // IDEMPOTENTE: Mesmo em erro de rede, limpa localStorage
            // O objetivo é que o cliente não fique "preso" na fila
            console.error('Erro ao sair da fila:', err);
            localStorage.removeItem('queueEntryId');
            setUserStatus(null);
            fetchQueueInfo();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePartySize = async newSize => {
        const entryId = localStorage.getItem('queueEntryId');
        if (!entryId) return;

        try {
            const response = await fetch(`${API_BASE}/queue/${entryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ party_size: parseInt(newSize) })
            });

            const result = await response.json();
            if (result.success) {
                setUserStatus(result.data);
            }
        } catch (err) {
            console.error('Erro ao atualizar:', err);
        }
    };

    // ========================================================
    // EFEITOS
    // ========================================================

    // Carrega dados iniciais
    useEffect(() => {
        fetchQueueInfo();
        fetchQueueList();

        if (savedEntryId) {
            fetchUserStatus(savedEntryId);
        }
    }, [fetchQueueInfo, fetchQueueList, fetchUserStatus, savedEntryId]);

    // Polling para atualização em tempo real
    useEffect(() => {
        const interval = setInterval(() => {
            fetchQueueInfo();

            if (savedEntryId) {
                fetchUserStatus(savedEntryId);
            }
        }, POLLING_INTERVAL);

        return () => clearInterval(interval);
    }, [fetchQueueInfo, fetchUserStatus, savedEntryId]);

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Header */}
            <section className="bg-linear-to-r from-orange-800 to-red-900 text-white py-12 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-pacifico text-4xl sm:text-6xl md:text-7xl mb-4 text-readable-dark">
                        Fila Virtual
                    </h1>
                    <p className="font-dancing text-xl sm:text-2xl text-amber-100">
                        Entre na fila e aguarde confortavelmente
                    </p>
                </div>
            </section>

            {/* Status da Fila */}
            <QueueStats queueInfo={queueInfo} loading={!queueInfo} />

            {/* Erro */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Lado esquerdo - Informações */}
                    <div>
                        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-orange-900 mb-4 sm:mb-6 flex items-center">
                                <span className="text-3xl sm:text-4xl mr-2 sm:mr-3">
                                    👥
                                </span>
                                Fila Atual
                            </h2>

                            {queueInfo?.currentWaiting === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="text-4xl mb-4 block">
                                        🎉
                                    </span>
                                    Nenhuma pessoa na fila! Entre agora.
                                </div>
                            ) : userStatus ? (
                                <div className="space-y-4">
                                    <QueueItem
                                        item={userStatus}
                                        index={userStatus.position}
                                        isCurrentUser={true}
                                    />
                                    {userStatus.position > 1 && (
                                        <p className="text-center text-gray-500 text-sm">
                                            {userStatus.position - 1}{' '}
                                            {userStatus.position - 1 === 1
                                                ? 'pessoa na sua frente'
                                                : 'pessoas na sua frente'}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="mb-2">
                                        <strong>
                                            {queueInfo?.currentWaiting || 0}
                                        </strong>{' '}
                                        {queueInfo?.currentWaiting === 1
                                            ? 'pessoa aguardando'
                                            : 'pessoas aguardando'}
                                    </p>
                                    <p className="text-sm">
                                        Entre na fila para acompanhar sua
                                        posição
                                    </p>
                                </div>
                            )}
                        </div>

                        <InfoBox />
                    </div>

                    {/* Lado direito - Formulário ou Status */}
                    <div>
                        {!userStatus ? (
                            <JoinQueueForm
                                formData={formData}
                                onChange={handleChange}
                                onSubmit={handleJoinQueue}
                                loading={loading}
                                estimatedWait={
                                    queueInfo?.estimatedWaitMinutes || 0
                                }
                                canJoin={queueInfo?.canJoin}
                                queueInfo={queueInfo}
                            />
                        ) : (
                            <UserInQueueCard
                                userStatus={userStatus}
                                onLeave={handleLeaveQueue}
                                onUpdatePartySize={handleUpdatePartySize}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fila;
