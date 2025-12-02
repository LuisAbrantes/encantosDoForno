const express = require('express');
const router = express.Router();
const Employees = require('../Data/Tables/Employees');
const {
    generateToken,
    authenticate,
    requireAdmin
} = require('../middleware/auth');
const { responseHandler } = require('../utils/responseHandler');

// ============================================================
// CONSTANTES DE VALIDAÇÃO
// ============================================================
const VALIDATION = {
    PASSWORD_MIN_LENGTH: 6,
    MESSAGES: {
        INVALID_CREDENTIALS: 'Credenciais inválidas',
        EMAIL_PASSWORD_REQUIRED: 'Email e senha são obrigatórios',
        ALL_FIELDS_REQUIRED: 'Nome, email e senha são obrigatórios',
        EMAIL_EXISTS: 'Este email já está cadastrado',
        USER_NOT_FOUND: 'Usuário não encontrado',
        CURRENT_PASSWORD_REQUIRED: 'Senha atual e nova senha são obrigatórias',
        WRONG_PASSWORD: 'Senha atual incorreta',
        LOGIN_SUCCESS: 'Login realizado com sucesso',
        REGISTER_SUCCESS: 'Funcionário cadastrado com sucesso',
        PASSWORD_CHANGED: 'Senha alterada com sucesso'
    }
};

// ============================================================
// FUNÇÕES AUXILIARES (HELPERS)
// ============================================================

/**
 * Formata os dados do funcionário para resposta da API
 * @param {Object} employee - Objeto do funcionário do banco
 * @returns {Object} Dados formatados do usuário
 */
const formatUserResponse = employee => ({
    id: employee.id,
    name: employee.Employed_Name,
    email: employee.Employed_Email,
    role: employee.Role
});

/**
 * Gera resposta de autenticação com token e dados do usuário
 * @param {Object} employee - Objeto do funcionário
 * @returns {Object} Token e dados do usuário
 */
const createAuthResponse = employee => {
    const user = formatUserResponse(employee);
    const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    });
    return { token, user };
};

// ============================================================
// ROTAS PÚBLICAS
// ============================================================

/**
 * @route   POST /api/auth/login
 * @desc    Autentica um funcionário e retorna um token JWT
 * @access  Public
 */
router.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return responseHandler.error(
                res,
                { message: VALIDATION.MESSAGES.EMAIL_PASSWORD_REQUIRED },
                400
            );
        }

        const employee = await Employees.findOne({
            where: { Employed_Email: email.toLowerCase().trim() }
        });

        if (!employee) {
            return responseHandler.error(
                res,
                { message: VALIDATION.MESSAGES.INVALID_CREDENTIALS },
                401
            );
        }

        const isValidPassword = await employee.validatePassword(password);

        if (!isValidPassword) {
            return responseHandler.error(
                res,
                { message: VALIDATION.MESSAGES.INVALID_CREDENTIALS },
                401
            );
        }

        const authData = createAuthResponse(employee);
        return responseHandler.success(
            res,
            authData,
            VALIDATION.MESSAGES.LOGIN_SUCCESS
        );
    } catch (error) {
        console.error('Erro no login:', error);
        return responseHandler.error(res, error);
    }
});

// ============================================================
// ROTAS PROTEGIDAS - APENAS ADMIN
// ============================================================

/**
 * @route   POST /api/auth/register
 * @desc    Registra um novo funcionário (apenas admins autenticados)
 * @access  Private/Admin
 */
router.post(
    '/api/auth/register',
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password) {
                return responseHandler.error(
                    res,
                    { message: VALIDATION.MESSAGES.ALL_FIELDS_REQUIRED },
                    400
                );
            }

            const existingEmployee = await Employees.findOne({
                where: { Employed_Email: email.toLowerCase().trim() }
            });

            if (existingEmployee) {
                return responseHandler.error(
                    res,
                    { message: VALIDATION.MESSAGES.EMAIL_EXISTS },
                    409
                );
            }

            const employee = await Employees.create({
                Employed_Name: name.trim(),
                Employed_Email: email.toLowerCase().trim(),
                Employed_Password: password,
                Role: role || 'employee'
            });

            return responseHandler.created(
                res,
                { user: formatUserResponse(employee) },
                VALIDATION.MESSAGES.REGISTER_SUCCESS
            );
        } catch (error) {
            console.error('Erro no registro:', error);
            return responseHandler.error(res, error);
        }
    }
);

/**
 * @route   GET /api/employees
 * @desc    Lista todos os funcionários (apenas admins)
 * @access  Private/Admin
 */
router.get('/api/employees', authenticate, requireAdmin, async (req, res) => {
    try {
        const employees = await Employees.findAll({
            attributes: [
                'id',
                'Employed_Name',
                'Employed_Email',
                'Role',
                'createdAt'
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedEmployees = employees.map(emp => ({
            id: emp.id,
            name: emp.Employed_Name,
            email: emp.Employed_Email,
            role: emp.Role,
            createdAt: emp.createdAt
        }));

        return responseHandler.success(res, formattedEmployees);
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
        return responseHandler.error(res, error);
    }
});

/**
 * @route   DELETE /api/employees/:id
 * @desc    Remove um funcionário (apenas admins, não pode remover a si mesmo)
 * @access  Private/Admin
 */
router.delete(
    '/api/employees/:id',
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            // Impede que o admin delete a si mesmo
            if (parseInt(id) === req.user.id) {
                return responseHandler.error(
                    res,
                    { message: 'Você não pode remover sua própria conta' },
                    400
                );
            }

            const employee = await Employees.findByPk(id);

            if (!employee) {
                return responseHandler.notFound(
                    res,
                    VALIDATION.MESSAGES.USER_NOT_FOUND
                );
            }

            await employee.destroy();
            return responseHandler.success(
                res,
                null,
                'Funcionário removido com sucesso'
            );
        } catch (error) {
            console.error('Erro ao remover funcionário:', error);
            return responseHandler.error(res, error);
        }
    }
);

// ============================================================
// ROTAS PROTEGIDAS - USUÁRIO AUTENTICADO
// ============================================================

/**
 * @route   GET /api/auth/me
 * @desc    Retorna os dados do usuário autenticado
 * @access  Private
 */
router.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const employee = await Employees.findByPk(req.user.id, {
            attributes: ['id', 'Employed_Name', 'Employed_Email', 'Role']
        });

        if (!employee) {
            return responseHandler.notFound(
                res,
                VALIDATION.MESSAGES.USER_NOT_FOUND
            );
        }

        return responseHandler.success(res, formatUserResponse(employee));
    } catch (error) {
        return responseHandler.error(res, error);
    }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Altera a senha do usuário autenticado
 * @access  Private
 */
router.post('/api/auth/change-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return responseHandler.error(
                res,
                { message: VALIDATION.MESSAGES.CURRENT_PASSWORD_REQUIRED },
                400
            );
        }

        const employee = await Employees.findByPk(req.user.id);

        if (!employee) {
            return responseHandler.notFound(
                res,
                VALIDATION.MESSAGES.USER_NOT_FOUND
            );
        }

        const isValidPassword = await employee.validatePassword(
            currentPassword
        );

        if (!isValidPassword) {
            return responseHandler.error(
                res,
                { message: VALIDATION.MESSAGES.WRONG_PASSWORD },
                401
            );
        }

        employee.Employed_Password = newPassword;
        await employee.save();

        return responseHandler.success(
            res,
            null,
            VALIDATION.MESSAGES.PASSWORD_CHANGED
        );
    } catch (error) {
        return responseHandler.error(res, error);
    }
});

module.exports = router;
