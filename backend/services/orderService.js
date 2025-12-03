const { Transaction, Op } = require('sequelize');
const sequelize = require('../Data/config');
const Order = require('../Data/Tables/Order');
const OrderItem = require('../Data/Tables/OrderItem');
const Product = require('../Data/Tables/Products');
const RestaurantTables = require('../Data/Tables/RestaurantTables');
const { ORDER_STATUS } = require('../Data/Tables/Order');

// ============================================================
// CONSTANTES
// ============================================================
const ACTIVE_STATUSES = Object.freeze([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PREPARING,
    ORDER_STATUS.READY
]);

const ERROR_MESSAGES = Object.freeze({
    TABLE_NOT_FOUND: 'Mesa não encontrada',
    ORDER_NOT_FOUND: 'Pedido não encontrado',
    EMPTY_CART: 'Carrinho vazio',
    PRODUCT_NOT_FOUND: 'Produto não encontrado',
    INVALID_QUANTITY: 'Quantidade inválida',
    CANNOT_MODIFY: 'Pedido não pode ser modificado'
});

// ============================================================
// SERVIÇO DE PEDIDOS
// ============================================================

class OrderService {
    /**
     * Cria um novo pedido com itens (transação atômica)
     * @param {Object} orderData - Dados do pedido
     * @param {number} orderData.table_id - ID da mesa
     * @param {Array} orderData.items - Array de {product_id, quantity, notes?}
     * @param {string} orderData.customer_name - Nome opcional
     * @param {string} orderData.notes - Observações gerais
     */
    async createOrder(orderData) {
        const { table_id, items, customer_name, notes } = orderData;

        // Validações básicas
        if (!items || items.length === 0) {
            throw new Error(ERROR_MESSAGES.EMPTY_CART);
        }

        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        });

        try {
            // Valida mesa
            const table = await RestaurantTables.findByPk(table_id, {
                transaction
            });

            if (!table) {
                throw new Error(ERROR_MESSAGES.TABLE_NOT_FOUND);
            }

            // Marca mesa como ocupada se disponível
            if (table.status === 'available') {
                table.status = 'occupied';
                await table.save({ transaction });
            } else if (table.status !== 'occupied') {
                throw new Error('Mesa não está disponível');
            }

            // Busca produtos e valida
            const productIds = items.map(item => item.product_id);
            const products = await Product.findAll({
                where: { id: productIds },
                transaction
            });

            if (products.length !== productIds.length) {
                throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            const productMap = new Map(products.map(p => [p.id, p]));

            // Calcula total e prepara itens
            let total = 0;
            const orderItems = items.map(item => {
                const product = productMap.get(item.product_id);
                const unitPrice = parseFloat(product.Product_Price);
                const quantity = parseInt(item.quantity) || 1;

                if (quantity < 1 || quantity > 99) {
                    throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
                }

                total += unitPrice * quantity;

                return {
                    product_id: item.product_id,
                    quantity,
                    unit_price: unitPrice,
                    notes: item.notes || null
                };
            });

            // Cria pedido
            const order = await Order.create(
                {
                    table_id,
                    customer_name: customer_name?.trim() || null,
                    notes: notes?.trim() || null,
                    total,
                    status: ORDER_STATUS.PENDING
                },
                { transaction }
            );

            // Cria itens do pedido
            const itemsWithOrderId = orderItems.map(item => ({
                ...item,
                order_id: order.id
            }));

            await OrderItem.bulkCreate(itemsWithOrderId, { transaction });

            await transaction.commit();

            // Retorna pedido completo
            return this.getOrderById(order.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Busca pedido por ID com todos os relacionamentos
     */
    async getOrderById(orderId) {
        return Order.findByPk(orderId, {
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                },
                { model: RestaurantTables, as: 'table' }
            ]
        });
    }

    /**
     * Lista pedidos ativos (para dashboard do funcionário)
     */
    async getActiveOrders() {
        return Order.findAll({
            where: { status: ACTIVE_STATUSES },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                },
                { model: RestaurantTables, as: 'table' }
            ],
            order: [
                ['status', 'ASC'], // pending primeiro
                ['createdAt', 'ASC'] // mais antigo primeiro
            ]
        });
    }

    /**
     * Lista pedidos por mesa
     */
    async getOrdersByTable(tableId) {
        return Order.findAll({
            where: { table_id: tableId },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    /**
     * Atualiza status do pedido
     */
    async updateStatus(orderId, newStatus) {
        const order = await Order.findByPk(orderId);

        if (!order) {
            throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        }

        await order.updateStatus(newStatus);
        return this.getOrderById(orderId);
    }

    /**
     * Cancela pedido
     */
    async cancelOrder(orderId) {
        const order = await Order.findByPk(orderId);

        if (!order) {
            throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        }

        if (!order.canBeModified()) {
            throw new Error(ERROR_MESSAGES.CANNOT_MODIFY);
        }

        await order.cancel();
        return this.getOrderById(orderId);
    }

    /**
     * Lista todos os pedidos com filtros (para histórico)
     */
    async getAllOrders(filters = {}) {
        const { status, tableId, startDate, endDate, limit = 50 } = filters;

        const where = {};

        if (status) {
            where.status = status;
        }

        if (tableId) {
            where.table_id = tableId;
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate);
        }

        return Order.findAll({
            where,
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                },
                { model: RestaurantTables, as: 'table' }
            ],
            order: [['createdAt', 'DESC']],
            limit
        });
    }

    /**
     * Obtém estatísticas de pedidos do dia
     */
    async getTodayStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const orders = await Order.findAll({
            where: {
                createdAt: { [Op.gte]: today }
            }
        });

        const stats = {
            total: orders.length,
            pending: 0,
            preparing: 0,
            ready: 0,
            totalDelivered: 0,
            cancelled: 0,
            totalRevenue: 0,
            avgPrepTime: 0
        };

        let totalPrepTime = 0;
        let completedCount = 0;

        orders.forEach(order => {
            if (order.status === ORDER_STATUS.DELIVERED) {
                stats.totalDelivered++;
                stats.totalRevenue += parseFloat(order.total);

                // Calcula tempo de preparo
                if (order.delivered_at) {
                    const prepTime =
                        (new Date(order.delivered_at) -
                            new Date(order.createdAt)) /
                        60000;
                    totalPrepTime += prepTime;
                    completedCount++;
                }
            } else if (order.status === ORDER_STATUS.CANCELLED) {
                stats.cancelled++;
            } else {
                stats[order.status]++;
            }
        });

        if (completedCount > 0) {
            stats.avgPrepTime = Math.round(totalPrepTime / completedCount);
        }

        return stats;
    }
}

module.exports = Object.freeze(new OrderService());
