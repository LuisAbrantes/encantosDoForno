import React, { useState, useEffect } from 'react';

const Fila = () => {
    // Mock data - será substituído por dados reais do backend
    const [filaAtual, setFilaAtual] = useState([
        {
            id: 1,
            nome: 'João S.',
            pessoas: 4,
            status: 'chamando',
            tempo: 'Agora'
        },
        {
            id: 2,
            nome: 'Maria P.',
            pessoas: 2,
            status: 'proximo',
            tempo: '~5 min'
        },
        {
            id: 3,
            nome: 'Carlos E.',
            pessoas: 3,
            status: 'aguardando',
            tempo: '~10 min'
        },
        {
            id: 4,
            nome: 'Ana L.',
            pessoas: 2,
            status: 'aguardando',
            tempo: '~15 min'
        },
        {
            id: 5,
            nome: 'Pedro M.',
            pessoas: 5,
            status: 'aguardando',
            tempo: '~20 min'
        }
    ]);

    const [tempoEspera, setTempoEspera] = useState(15);
    const [usuarioNaFila, setUsuarioNaFila] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        pessoas: '2'
    });

    // Simula atualização em tempo real
    useEffect(() => {
        const interval = setInterval(() => {
            setTempoEspera(prev =>
                Math.max(5, prev + Math.floor(Math.random() * 3) - 1)
            );
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEntrarNaFila = e => {
        e.preventDefault();
        const novoUsuario = {
            id: filaAtual.length + 1,
            nome: formData.nome,
            pessoas: parseInt(formData.pessoas),
            status: 'aguardando',
            tempo: `~${(filaAtual.length + 1) * 5} min`
        };
        setFilaAtual([...filaAtual, novoUsuario]);
        setUsuarioNaFila(novoUsuario);
        // TODO: Integrar com backend
        alert('Você entrou na fila! Fique atento ao seu celular.');
    };

    const getStatusColor = status => {
        switch (status) {
            case 'chamando':
                return 'bg-green-500 animate-pulse';
            case 'proximo':
                return 'bg-amber-500';
            default:
                return 'bg-gray-400';
        }
    };

    const getStatusText = status => {
        switch (status) {
            case 'chamando':
                return 'Sua vez! 🔔';
            case 'proximo':
                return 'Próximo na fila';
            default:
                return 'Aguardando';
        }
    };

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Header */}
            <section className="bg-linear-to-r from-orange-800 to-red-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-pacifico text-6xl md:text-7xl mb-4 text-readable-dark">
                        Fila Virtual
                    </h1>
                    <p className="font-dancing text-2xl text-amber-100">
                        Entre na fila e aguarde confortavelmente
                    </p>
                </div>
            </section>

            {/* Status da Fila */}
            <section className="py-8 bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="p-6 bg-amber-50 rounded-lg">
                            <div className="text-4xl font-bold text-orange-900 mb-2">
                                {filaAtual.length}
                            </div>
                            <div className="text-gray-600">Pessoas na fila</div>
                        </div>
                        <div className="p-6 bg-amber-50 rounded-lg">
                            <div className="text-4xl font-bold text-orange-900 mb-2">
                                ~{tempoEspera} min
                            </div>
                            <div className="text-gray-600">
                                Tempo médio de espera
                            </div>
                        </div>
                        <div className="p-6 bg-amber-50 rounded-lg">
                            <div className="text-4xl font-bold text-green-600 mb-2">
                                ●
                            </div>
                            <div className="text-gray-600">Sistema ativo</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Fila Atual */}
                    <div>
                        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                            <h2 className="text-3xl font-bold text-orange-900 mb-6 flex items-center">
                                <span className="text-4xl mr-3">👥</span>
                                Fila Atual
                            </h2>

                            <div className="space-y-4">
                                {filaAtual.map((pessoa, index) => (
                                    <div
                                        key={pessoa.id}
                                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                            pessoa.status === 'chamando'
                                                ? 'border-green-500 bg-green-50 shadow-lg'
                                                : pessoa.status === 'proximo'
                                                ? 'border-amber-500 bg-amber-50'
                                                : 'border-gray-200 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${getStatusColor(
                                                            pessoa.status
                                                        )}`}
                                                    ></div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        #{index + 1}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">
                                                        {pessoa.nome}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {pessoa.pessoas}{' '}
                                                        {pessoa.pessoas === 1
                                                            ? 'pessoa'
                                                            : 'pessoas'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-orange-900">
                                                    {pessoa.tempo}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {getStatusText(
                                                        pessoa.status
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Informações */}
                        <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                                <span className="text-2xl mr-2">💡</span>
                                Como funciona?
                            </h3>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>
                                    • Entre na fila preenchendo o formulário ao
                                    lado
                                </li>
                                <li>
                                    • Acompanhe sua posição em tempo real nesta
                                    página
                                </li>
                                <li>
                                    • Você receberá uma notificação por SMS
                                    quando estiver próximo
                                </li>
                                <li>
                                    • Quando for sua vez, seu nome será chamado
                                    no painel
                                </li>
                                <li>
                                    • Aguarde no local indicado ou retorne ao
                                    restaurante
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Formulário de Entrada */}
                    <div>
                        {!usuarioNaFila ? (
                            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 sticky top-24">
                                <h2 className="text-3xl font-bold text-orange-900 mb-6 flex items-center">
                                    <span className="text-4xl mr-3">📝</span>
                                    Entrar na Fila
                                </h2>

                                <form
                                    onSubmit={handleEntrarNaFila}
                                    className="space-y-6"
                                >
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
                                            name="nome"
                                            required
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                                            placeholder="Seu nome"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="telefone"
                                            className="block text-sm font-bold text-orange-900 mb-2"
                                        >
                                            Telefone (para notificações) *
                                        </label>
                                        <input
                                            type="tel"
                                            id="telefone"
                                            name="telefone"
                                            required
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                                            placeholder="(12) 99999-9999"
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
                                            name="pessoas"
                                            required
                                            value={formData.pessoas}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                                        >
                                            <option value="1">1 pessoa</option>
                                            <option value="2">2 pessoas</option>
                                            <option value="3">3 pessoas</option>
                                            <option value="4">4 pessoas</option>
                                            <option value="5">5 pessoas</option>
                                            <option value="6">6 pessoas</option>
                                            <option value="7+">
                                                7 ou mais pessoas
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                                    >
                                        Entrar na Fila 🎫
                                    </button>
                                </form>

                                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                                    <p className="text-sm text-gray-700 text-center">
                                        ⏱️ Tempo estimado de espera:{' '}
                                        <strong>~{tempoEspera} minutos</strong>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 sticky top-24">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">✅</div>
                                    <h2 className="text-3xl font-bold text-green-700 mb-4">
                                        Você está na fila!
                                    </h2>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                                        <p className="text-lg text-gray-700 mb-2">
                                            Olá,{' '}
                                            <strong>
                                                {usuarioNaFila.nome}
                                            </strong>
                                            !
                                        </p>
                                        <p className="text-3xl font-bold text-green-700 mb-2">
                                            Posição: #
                                            {filaAtual.findIndex(
                                                p => p.id === usuarioNaFila.id
                                            ) + 1}
                                        </p>
                                        <p className="text-gray-600">
                                            Tempo estimado:{' '}
                                            <strong>
                                                {usuarioNaFila.tempo}
                                            </strong>
                                        </p>
                                    </div>
                                    <p className="text-gray-600 mb-6">
                                        Fique atento! Enviaremos uma notificação
                                        quando estiver próximo da sua vez.
                                    </p>
                                    <button
                                        onClick={() => {
                                            if (
                                                confirm('Deseja sair da fila?')
                                            ) {
                                                setFilaAtual(
                                                    filaAtual.filter(
                                                        p =>
                                                            p.id !==
                                                            usuarioNaFila.id
                                                    )
                                                );
                                                setUsuarioNaFila(null);
                                            }
                                        }}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                                    >
                                        Sair da Fila
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fila;
