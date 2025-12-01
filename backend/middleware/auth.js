const jwt = require('jsonwebtoken');
const response = require('../utils/responseHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'encantos-do-forno-secret-key-2024';
const JWT_EXPIRES_IN = '7d'; // Token válido por 7 dias

/**
 * Gera um token JWT para o usuário
 * @param {Object} payload - Dados do usuário (id, email, role)
 * @returns {string} Token JWT
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Middleware para verificar autenticação
 * Verifica se o token JWT é válido
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.error(res, { message: 'Token não fornecido' }, 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Adiciona os dados do usuário ao request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return response.error(res, { message: 'Token expirado' }, 401);
        }
        return response.error(res, { message: 'Token inválido' }, 401);
    }
};

/**
 * Middleware para verificar se o usuário é admin
 * Deve ser usado após o middleware authenticate
 */
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return response.error(res, { message: 'Acesso negado. Requer privilégios de administrador.' }, 403);
    }
};

module.exports = {
    generateToken,
    authenticate,
    requireAdmin,
    JWT_SECRET
};
