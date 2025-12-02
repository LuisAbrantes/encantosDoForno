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

// Importação dos middlewares
const {
    defaultRateLimiter,
    errorHandler,
    notFoundHandler
} = require('./middleware');

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
 * Configuração de middlewares globais
 */
const configureMiddlewares = () => {
    // CORS para permitir requisições do frontend
    app.use(cors());

    // Parsing de JSON e URL-encoded
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting global (proteção contra DDoS/spam)
    app.use('/api/', defaultRateLimiter);

    // Header de segurança básico
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        next();
    });

    // Log de requisições (em desenvolvimento)
    if (process.env.NODE_ENV !== 'production') {
        app.use((req, res, next) => {
            console.log(
                chalk.gray(`[${new Date().toISOString()}]`),
                chalk.cyan(req.method),
                req.path
            );
            next();
        });
    }
};

/**
 * Configuração das rotas
 */
const configureRoutes = () => {
    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

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

    // Handler para rotas não encontradas
    app.use(notFoundHandler);

    // Error handler global (DEVE ser o último)
    app.use(errorHandler);
};

/**
 * Graceful shutdown - fecha conexões antes de encerrar
 */
const setupGracefulShutdown = () => {
    const shutdown = async signal => {
        console.log(chalk.yellow(`\n⚠️  ${signal} recebido. Encerrando...`));

        try {
            const database = require('./Data/config');
            await database.close();
            console.log(chalk.green('✅ Conexões fechadas com sucesso'));
            process.exit(0);
        } catch (error) {
            console.error(chalk.red('❌ Erro ao encerrar:'), error);
            process.exit(1);
        }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
};

/**
 * Inicialização do servidor
 */
const startServer = async () => {
    await initializeDatabase();
    configureMiddlewares();
    configureRoutes();
    setupGracefulShutdown();

    app.listen(PORT, () => {
        console.log(
            chalk.blue('\n🚀 Servidor rodando em ') +
                chalk.red(`http://localhost:${PORT}`)
        );
        console.log(chalk.gray('   Pressione CTRL+C para parar\n'));
    });
};

// Tratamento de erros não capturados
process.on('uncaughtException', err => {
    console.error(chalk.bgRed.white(' ❌ Uncaught Exception: '), err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.bgRed.white(' ❌ Unhandled Rejection: '), reason);
});

// Iniciar aplicação
startServer();
