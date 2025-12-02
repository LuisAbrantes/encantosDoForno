require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chalk = require('chalk');

// Importação das rotas limpas
const {
    productRoutes,
    scheduleRoutes,
    employeeRoutes,
    productClassRoutes,
    authRoutes,
    queueRoutes,
    tableRoutes,
    tableLocationRoutes
} = require('./routes');

// Importação das rotas legadas (para manter compatibilidade)
const GET = require('./API/GET');
const POST = require('./API/POST');
const DELETE = require('./API/DELETE');
const EDIT = require('./API/EDIT');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Inicialização do banco de dados
 */
const initializeDatabase = async () => {
    try {
        const database = require('./Data/config');

        // Carrega os models para sincronização
        require('./Data/Tables/Employees');
        require('./Data/Tables/Products');
        require('./Data/Tables/Schedules');
        require('./Data/Tables/ProductClass');
        require('./Data/Tables/Queue');
        require('./Data/Tables/RestaurantTables');
        require('./Data/Tables/QueueSettings');
        require('./Data/Tables/TableLocations');

        // Configura associações entre modelos
        const setupAssociations = require('./Data/associations');
        setupAssociations();

        // alter: true adiciona novas colunas sem perder dados existentes
        await database.sync({ alter: true });
        console.log(chalk.bgGreen.black(' ✅ Banco sincronizado com sucesso '));
    } catch (error) {
        console.error(
            chalk.bgRed.white(' ❌ Erro ao sincronizar banco: '),
            error
        );
        process.exit(1);
    }
};

/**
 * Configuração de middlewares
 */
const configureMiddlewares = () => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};

/**
 * Configuração das rotas
 */
const configureRoutes = () => {
    // Rotas de autenticação (públicas)
    app.use(authRoutes);

    // Novas rotas (Clean Code)
    app.use(productRoutes);
    app.use(scheduleRoutes);
    app.use(employeeRoutes);
    app.use(productClassRoutes);
    app.use(queueRoutes);
    app.use(tableRoutes);
    app.use(tableLocationRoutes);

    // Rotas legadas (mantidas para compatibilidade)
    app.use(GET);
    app.use(POST);
    app.use(DELETE);
    app.use(EDIT);
};

/**
 * Inicialização do servidor
 */
const startServer = async () => {
    await initializeDatabase();
    configureMiddlewares();
    configureRoutes();

    app.listen(PORT, () => {
        console.log(
            chalk.blue('\n🚀 Servidor rodando em ') +
                chalk.red(`http://localhost:${PORT}`)
        );
        console.log(chalk.gray('   Pressione CTRL+C para parar\n'));
    });
};

// Iniciar aplicação
startServer();
