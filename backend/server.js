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
    tableLocationRoutes,
    orderRoutes
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
        require('./Data/Tables/QueueDailyStats');
        require('./Data/Tables/Order');
        require('./Data/Tables/OrderItem');

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
    // CORS configurado para produção (Vercel + Railway)
    app.use(
        cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'X-Requested-With'
            ],
            credentials: true
        })
    );

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
    app.use(orderRoutes);

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

        // Limpa os jobs agendados
        if (global.cleanupIntervalId) {
            clearInterval(global.cleanupIntervalId);
        }
        if (global.dailyStatsTimeoutId) {
            clearTimeout(global.dailyStatsTimeoutId);
        }

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
 * Configuração do job de limpeza automática da fila
 * Executa a cada 15 minutos para expirar entradas antigas
 */
const setupQueueCleanupJob = () => {
    const CLEANUP_INTERVAL_MS = 15 * 60 * 1000; // 15 minutos

    const runCleanup = async () => {
        try {
            const queueService = require('./services/queueService');

            // 1. Expira entradas waiting/called muito antigas
            const result = await queueService.cleanupExpiredEntries();

            if (result.total > 0) {
                console.log(
                    chalk.yellow('🧹 Limpeza automática da fila:'),
                    chalk.gray(`${result.expiredWaiting} waiting expiradas,`),
                    chalk.gray(`${result.expiredCalled} called sem resposta`)
                );
            }

            // 2. Remove entradas finalizadas antigas (> 48h por padrão)
            const deleted = await queueService.deleteOldFinishedEntries();
            if (deleted > 0) {
                console.log(
                    chalk.yellow('🗑️  Entradas antigas removidas:'),
                    chalk.gray(`${deleted} entradas`)
                );
            }
        } catch (error) {
            console.error(
                chalk.red('❌ Erro na limpeza automática da fila:'),
                error.message
            );
        }
    };

    // Executa imediatamente na inicialização
    runCleanup();

    // Agenda execução periódica
    global.cleanupIntervalId = setInterval(runCleanup, CLEANUP_INTERVAL_MS);

    console.log(
        chalk.green('🧹 Job de limpeza da fila configurado'),
        chalk.gray(`(a cada ${CLEANUP_INTERVAL_MS / 60000} minutos)`)
    );
};

/**
 * Configuração do job de agregação diária de estatísticas
 * Executa à meia-noite para agregar estatísticas do dia anterior
 */
const setupDailyStatsJob = () => {
    const runDailyAggregation = async () => {
        try {
            const queueService = require('./services/queueService');

            // Agrega estatísticas do dia anterior
            const stats = await queueService.aggregateDailyStats();

            if (stats) {
                console.log(
                    chalk.blue('📊 Estatísticas diárias agregadas:'),
                    chalk.gray(
                        `${stats.total_customers} clientes, ${stats.customers_seated} sentados`
                    )
                );
            }
        } catch (error) {
            console.error(
                chalk.red('❌ Erro na agregação diária:'),
                error.message
            );
        }
    };

    // Calcula tempo até próxima meia-noite
    const scheduleNextRun = () => {
        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setDate(nextMidnight.getDate() + 1);
        nextMidnight.setHours(0, 5, 0, 0); // 00:05 para evitar problemas de timezone

        const msUntilMidnight = nextMidnight - now;

        // Agenda execução à meia-noite
        global.dailyStatsTimeoutId = setTimeout(() => {
            runDailyAggregation();
            // Re-agenda para próximo dia
            scheduleNextRun();
        }, msUntilMidnight);

        console.log(
            chalk.green('📊 Job de estatísticas diárias configurado'),
            chalk.gray(`(próxima execução: ${nextMidnight.toLocaleString()})`)
        );
    };

    // Executa imediatamente na inicialização (para dias anteriores não processados)
    runDailyAggregation();

    // Agenda próxima execução
    scheduleNextRun();
};

/**
 * Inicialização do servidor
 */
const startServer = async () => {
    await initializeDatabase();
    configureMiddlewares();
    configureRoutes();
    setupGracefulShutdown();
    setupQueueCleanupJob();
    setupDailyStatsJob();

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

// Log inicial para debug no Railway
console.log(chalk.blue('🔄 Iniciando servidor...'));

// Iniciar aplicação
startServer().catch(err => {
    console.error(chalk.bgRed.white(' ❌ Erro ao iniciar servidor: '), err);
    process.exit(1);
});
