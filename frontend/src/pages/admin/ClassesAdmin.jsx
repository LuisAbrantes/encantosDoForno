import React, { useState, useEffect } from 'react';
import { productClassService } from '../../services/api';

const ClassesAdmin = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [formData, setFormData] = useState({
        Name: '',
        Icon: '🍽️'
    });

    const emojiOptions = [
        '🍕',
        '🥖',
        '🍝',
        '🥩',
        '🍰',
        '☕',
        '🥗',
        '🍔',
        '🌮',
        '🍣',
        '🍽️',
        '🧁',
        '🍪',
        '🥤'
    ];

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await productClassService.getAll();
            setClasses(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (cls = null) => {
        if (cls) {
            setEditingClass(cls);
            setFormData({
                Name: cls.Name,
                Icon: cls.Icon || '🍽️'
            });
        } else {
            setEditingClass(null);
            setFormData({
                Name: '',
                Icon: '🍽️'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingClass(null);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editingClass) {
                await productClassService.update(editingClass.id, formData);
            } else {
                await productClassService.create(formData);
            }
            closeModal();
            fetchClasses();
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            alert('Erro ao salvar categoria');
        }
    };

    const handleDelete = async id => {
        if (
            window.confirm(
                'Tem certeza que deseja excluir esta categoria? Produtos associados podem ser afetados.'
            )
        ) {
            try {
                await productClassService.delete(id);
                fetchClasses();
            } catch (error) {
                console.error('Erro ao excluir categoria:', error);
                alert(
                    'Erro ao excluir categoria. Verifique se não há produtos associados.'
                );
            }
        }
    };

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
                    📁 Categorias
                </h1>
                <button
                    onClick={() => openModal()}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition flex items-center"
                >
                    + Nova Categoria
                </button>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-12">
                        Nenhuma categoria cadastrada
                    </p>
                ) : (
                    classes.map(cls => (
                        <div
                            key={cls.id}
                            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <span className="text-4xl mr-3">
                                        {cls.Icon || '🍽️'}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {cls.Name}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => openModal(cls)}
                                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(cls.id)}
                                    className="text-red-600 hover:text-red-800 px-3 py-1"
                                >
                                    🗑️ Excluir
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingClass
                                ? 'Editar Categoria'
                                : 'Nova Categoria'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.Name}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            Name: e.target.value
                                        })
                                    }
                                    placeholder="Ex: Pizzas, Massas, Bebidas"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ícone
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {emojiOptions.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    Icon: emoji
                                                })
                                            }
                                            className={`text-2xl p-2 rounded-lg border-2 transition ${
                                                formData.Icon === emoji
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassesAdmin;
