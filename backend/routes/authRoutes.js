const express = require('express');
const router = express.Router();
const Employees = require('../Data/Tables/Employees');
const { generateToken, authenticate } = require('../middleware/auth');
const response = require('../utils/responseHandler');

/**
 * @route   POST /api/auth/login
 * @desc    Autentica um funcionário e retorna um token JWT
 */
router.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validação básica
        if (!email || !password) {
            return response.error(res, { message: 'Email e senha são obrigatórios' }, 400);
        }

        // Busca o funcionário pelo email
        const employee = await Employees.findOne({
            where: { Employed_Email: email.toLowerCase().trim() }
        });

        if (!employee) {
            return response.error(res, { message: 'Credenciais inválidas' }, 401);
        }

        // Verifica a senha
        const isValidPassword = await employee.validatePassword(password);

        if (!isValidPassword) {
            return response.error(res, { message: 'Credenciais inválidas' }, 401);
        }

        // Gera o token JWT
        const token = generateToken({
            id: employee.id,
            email: employee.Employed_Email,
            name: employee.Employed_Name,
            role: employee.Role
        });

        return response.success(res, {
            token,
            user: {
                id: employee.id,
                name: employee.Employed_Name,
                email: employee.Employed_Email,
                role: employee.Role
            }
        }, 'Login realizado com sucesso');

    } catch (error) {
        console.error('Erro no login:', error);
        return response.error(res, error);
    }
});

/**
 * @route   POST /api/auth/register
 * @desc    Registra um novo funcionário (apenas para setup inicial ou admin)
 */
router.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validação básica
        if (!name || !email || !password) {
            return response.error(res, { message: 'Nome, email e senha são obrigatórios' }, 400);
        }

        // Verifica se o email já está em uso
        const existingEmployee = await Employees.findOne({
            where: { Employed_Email: email.toLowerCase().trim() }
        });

        if (existingEmployee) {
            return response.error(res, { message: 'Este email já está cadastrado' }, 409);
        }

        // Cria o funcionário (a senha é hasheada automaticamente pelo hook)
        const employee = await Employees.create({
            Employed_Name: name.trim(),
            Employed_Email: email.toLowerCase().trim(),
            Employed_Password: password,
            Role: role || 'employee'
        });

        // Gera o token JWT
        const token = generateToken({
            id: employee.id,
            email: employee.Employed_Email,
            name: employee.Employed_Name,
            role: employee.Role
        });

        return response.created(res, {
            token,
            user: {
                id: employee.id,
                name: employee.Employed_Name,
                email: employee.Employed_Email,
                role: employee.Role
            }
        }, 'Funcionário cadastrado com sucesso');

    } catch (error) {
        console.error('Erro no registro:', error);
        return response.error(res, error);
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Retorna os dados do usuário autenticado
 */
router.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const employee = await Employees.findByPk(req.user.id, {
            attributes: ['id', 'Employed_Name', 'Employed_Email', 'Role']
        });

        if (!employee) {
            return response.notFound(res, 'Usuário não encontrado');
        }

        return response.success(res, {
            id: employee.id,
            name: employee.Employed_Name,
            email: employee.Employed_Email,
            role: employee.Role
        });

    } catch (error) {
        return response.error(res, error);
    }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Altera a senha do usuário autenticado
 */
router.post('/api/auth/change-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return response.error(res, { message: 'Senha atual e nova senha são obrigatórias' }, 400);
        }

        const employee = await Employees.findByPk(req.user.id);

        if (!employee) {
            return response.notFound(res, 'Usuário não encontrado');
        }

        // Verifica a senha atual
        const isValidPassword = await employee.validatePassword(currentPassword);

        if (!isValidPassword) {
            return response.error(res, { message: 'Senha atual incorreta' }, 401);
        }

        // Atualiza a senha (será hasheada pelo hook beforeUpdate)
        employee.Employed_Password = newPassword;
        await employee.save();

        return response.success(res, null, 'Senha alterada com sucesso');

    } catch (error) {
        return response.error(res, error);
    }
});

module.exports = router;
