import React, { useState, useEffect } from 'react';
import { productService, productClassService } from '../../services/api';

const ProductsAdmin = () => {
    const [products, setProducts] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        Product_Name: '',
        Product_Description: '',
        Product_Price: '',
        Product_Weight: '',
        Product_Class: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, classesRes] = await Promise.all([
                productService.getAll(),
                productClassService.getAll()
            ]);
            setProducts(productsRes.data || []);
            setClasses(classesRes.data || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                Product_Name: product.Product_Name,
                Product_Description: product.Product_Description || '',
                Product_Price: product.Product_Price,
                Product_Weight: product.Product_Weight || '',
                Product_Class: product.productClassId
            });
        } else {
            setEditingProduct(null);
            setFormData({
                Product_Name: '',
                Product_Description: '',
                Product_Price: '',
                Product_Weight: '',
                Product_Class: classes[0]?.id || ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productService.update(editingProduct.id, formData);
            } else {
                await productService.create(formData);
            }
            closeModal();
            fetchData();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto');
        }
    };

    const handleDelete = async id => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await productService.delete(id);
                fetchData();
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                alert('Erro ao excluir produto');
            }
        }
    };

    const formatPrice = price => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const getClassName = classId => {
        const cls = classes.find(c => c.id === classId);
        return cls ? cls.Name : '-';
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
                    🍕 Produtos
                </h1>
                <button
                    onClick={() => openModal()}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition flex items-center"
                >
                    + Novo Produto
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">
                        Nenhum produto cadastrado
                    </p>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Categoria
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Preço
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Peso
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map(product => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {product.Product_Name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate max-w-xs">
                                                {product.Product_Description ||
                                                    '-'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {getClassName(product.productClassId)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">
                                        {formatPrice(product.Product_Price)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {product.Product_Weight || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => openModal(product)}
                                            className="text-blue-600 hover:text-blue-800 mr-4"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.Product_Name}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            Product_Name: e.target.value
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descrição
                                </label>
                                <textarea
                                    value={formData.Product_Description}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            Product_Description: e.target.value
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    rows="3"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Preço (R$) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.Product_Price}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                Product_Price: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Peso/Tamanho
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.Product_Weight}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                Product_Weight: e.target.value
                                            })
                                        }
                                        placeholder="Ex: 500g, Grande"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoria *
                                </label>
                                <select
                                    required
                                    value={formData.Product_Class}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            Product_Class: e.target.value
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Selecione...</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.Icon} {cls.Name}
                                        </option>
                                    ))}
                                </select>
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

export default ProductsAdmin;
