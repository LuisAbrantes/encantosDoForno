import React, { useState } from 'react';
import { scheduleService } from '../services/api';

const Agendamento = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        data: '',
        horario: '',
        pessoas: '2',
        observacoes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Formatar dados para o backend
            const scheduleData = {
                Date: `${formData.data}T${formData.horario}:00`,
                Peoples: formData.pessoas,
                Number: formData.telefone
            };

            await scheduleService.create(scheduleData);

            setMessage({
                type: 'success',
                text: '✅ Reserva realizada com sucesso! Entraremos em contato em breve.'
            });

            // Limpar formulário
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                data: '',
                horario: '',
                pessoas: '2',
                observacoes: ''
            });
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            setMessage({
                type: 'error',
                text: '❌ Erro ao fazer reserva. Tente novamente ou entre em contato pelo WhatsApp.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Header */}
            <section className="bg-linear-to-r from-orange-800 to-red-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-pacifico text-6xl md:text-7xl mb-4 text-readable-dark">
                        Faça sua Reserva
                    </h1>
                    <p className="font-dancing text-2xl text-amber-100">
                        Garanta seu lugar e desfrute de uma experiência
                        inesquecível
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12">
                        {/* Mensagem de feedback */}
                        {message.text && (
                            <div
                                className={`mb-6 p-4 rounded-lg ${
                                    message.type === 'success'
                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                        : 'bg-red-100 text-red-800 border border-red-300'
                                }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nome */}
                            <div>
                                <label
                                    htmlFor="nome"
                                    className="block font-sans text-sm font-bold text-orange-900 mb-2"
                                >
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    required
                                    value={formData.nome}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                                    placeholder="Seu nome completo"
                                />
                            </div>

                            {/* Email e Telefone */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block font-sans text-sm font-bold text-orange-900 mb-2"
                                    >
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="telefone"
                                        className="block font-sans text-sm font-bold text-orange-900 mb-2"
                                    >
                                        Telefone *
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
                            </div>

                            {/* Data e Horário */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="data"
                                        className="block font-sans text-sm font-bold text-orange-900 mb-2"
                                    >
                                        Data *
                                    </label>
                                    <input
                                        type="date"
                                        id="data"
                                        name="data"
                                        required
                                        value={formData.data}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="horario"
                                        className="block font-sans text-sm font-bold text-orange-900 mb-2"
                                    >
                                        Horário *
                                    </label>
                                    <select
                                        id="horario"
                                        name="horario"
                                        required
                                        value={formData.horario}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="11:00">11:00</option>
                                        <option value="11:30">11:30</option>
                                        <option value="12:00">12:00</option>
                                        <option value="12:30">12:30</option>
                                        <option value="13:00">13:00</option>
                                        <option value="13:30">13:30</option>
                                        <option value="18:00">18:00</option>
                                        <option value="18:30">18:30</option>
                                        <option value="19:00">19:00</option>
                                        <option value="19:30">19:30</option>
                                        <option value="20:00">20:00</option>
                                        <option value="20:30">20:30</option>
                                        <option value="21:00">21:00</option>
                                    </select>
                                </div>
                            </div>

                            {/* Número de Pessoas */}
                            <div>
                                <label
                                    htmlFor="pessoas"
                                    className="block font-sans text-sm font-bold text-orange-900 mb-2"
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

                            {/* Observações */}
                            <div>
                                <label
                                    htmlFor="observacoes"
                                    className="block font-sans text-sm font-bold text-orange-900 mb-2"
                                >
                                    Observações
                                </label>
                                <textarea
                                    id="observacoes"
                                    name="observacoes"
                                    rows="4"
                                    value={formData.observacoes}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-300"
                                    placeholder="Alguma restrição alimentar, celebração especial, ou preferências?"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg ${
                                        loading
                                            ? 'opacity-70 cursor-not-allowed'
                                            : 'hover:scale-105'
                                    }`}
                                >
                                    {loading
                                        ? 'Enviando...'
                                        : 'Confirmar Reserva 📅'}
                                </button>
                            </div>
                        </form>

                        {/* Info adicional */}
                        <div className="mt-8 p-6 bg-amber-50 rounded-lg">
                            <h3 className="font-bold text-orange-900 mb-3 flex items-center">
                                <span className="text-2xl mr-2">ℹ️</span>
                                Informações Importantes
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>
                                    • Reservas podem ser canceladas até 2 horas
                                    antes do horário agendado.
                                </li>
                                <li>
                                    • Em caso de atraso superior a 15 minutos, a
                                    reserva pode ser cancelada.
                                </li>
                                <li>
                                    • Para grupos acima de 7 pessoas, entre em
                                    contato direto pelo WhatsApp.
                                </li>
                                <li>
                                    • Confirmação será enviada por email e/ou
                                    telefone.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Alternatives */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-orange-900 mb-6">
                        Prefere falar conosco diretamente?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+5512396100000"
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Ligar Agora 📞
                        </a>
                        <a
                            href="https://wa.me/5512396100000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            WhatsApp 💬
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Agendamento;
