const { TIMING, HTTP_STATUS } = require('../utils/constants');

// ============================================================
// RATE LIMITER EM MEMÓRIA
// ============================================================

/**
 * Rate Limiter simples em memória
 * Para produção, considere usar Redis para escalar horizontalmente
 */
class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.cleanupInterval = setInterval(
            () => this._cleanup(),
            TIMING.RATE_LIMIT_WINDOW_MS
        );
    }

    /**
     * Verifica se o cliente pode fazer requisição
     * @param {string} key - Identificador do cliente (IP, token, etc.)
     * @param {number} maxRequests - Máximo de requisições permitidas
     * @param {number} windowMs - Janela de tempo em ms
     * @returns {Object} { allowed: boolean, remaining: number, resetTime: Date }
     */
    check(
        key,
        maxRequests = TIMING.RATE_LIMIT_MAX_REQUESTS,
        windowMs = TIMING.RATE_LIMIT_WINDOW_MS
    ) {
        const now = Date.now();
        const windowStart = now - windowMs;

        // Obtém ou cria registro
        let record = this.requests.get(key);

        if (!record || record.windowStart < windowStart) {
            record = {
                count: 0,
                windowStart: now
            };
        }

        // Incrementa contador
        record.count++;
        this.requests.set(key, record);

        const remaining = Math.max(0, maxRequests - record.count);
        const resetTime = new Date(record.windowStart + windowMs);

        return {
            allowed: record.count <= maxRequests,
            remaining,
            resetTime,
            total: record.count
        };
    }

    /**
     * Limpa registros antigos
     * @private
     */
    _cleanup() {
        const now = Date.now();
        const windowMs = TIMING.RATE_LIMIT_WINDOW_MS;

        for (const [key, record] of this.requests.entries()) {
            if (record.windowStart < now - windowMs) {
                this.requests.delete(key);
            }
        }
    }

    /**
     * Destrói o limiter (para testes)
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        this.requests.clear();
    }
}

// Singleton
const limiter = new RateLimiter();

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * Middleware de rate limiting
 * @param {Object} options - Opções de configuração
 * @param {number} options.maxRequests - Máximo de requisições
 * @param {number} options.windowMs - Janela de tempo em ms
 * @param {Function} options.keyGenerator - Função para gerar chave (req) => string
 * @param {boolean} options.skipFailed - Se pula requisições que falharam
 */
const rateLimitMiddleware = (options = {}) => {
    const {
        maxRequests = TIMING.RATE_LIMIT_MAX_REQUESTS,
        windowMs = TIMING.RATE_LIMIT_WINDOW_MS,
        keyGenerator = req =>
            req.ip || req.headers['x-forwarded-for'] || 'unknown',
        message = 'Muitas requisições. Tente novamente mais tarde.'
    } = options;

    return (req, res, next) => {
        const key = keyGenerator(req);
        const result = limiter.check(key, maxRequests, windowMs);

        // Headers de rate limit
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', result.remaining);
        res.setHeader('X-RateLimit-Reset', result.resetTime.toISOString());

        if (!result.allowed) {
            res.setHeader(
                'Retry-After',
                Math.ceil((result.resetTime - Date.now()) / 1000)
            );
            return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
                success: false,
                error: message,
                retryAfter: result.resetTime.toISOString()
            });
        }

        next();
    };
};

/**
 * Rate limiter mais restritivo para rotas sensíveis (login, etc.)
 */
const strictRateLimiter = rateLimitMiddleware({
    maxRequests: 10,
    windowMs: 60000, // 1 minuto
    message: 'Muitas tentativas. Aguarde 1 minuto.'
});

/**
 * Rate limiter padrão para rotas da API
 */
const defaultRateLimiter = rateLimitMiddleware({
    maxRequests: 100,
    windowMs: 60000
});

module.exports = {
    rateLimitMiddleware,
    strictRateLimiter,
    defaultRateLimiter,
    limiter // Exporta para testes
};
