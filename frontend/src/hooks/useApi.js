import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================================
// CONSTANTES
// ============================================================
const DEFAULT_TIMEOUT = 30000; // 30 segundos
const RETRY_DELAYS = [1000, 2000, 4000]; // Backoff exponencial

/**
 * Estados possíveis da requisição
 */
export const API_STATES = Object.freeze({
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
});

/**
 * Códigos de erro conhecidos
 */
export const ERROR_CODES = Object.freeze({
    NETWORK: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    NOT_FOUND: 'NOT_FOUND',
    SERVER: 'SERVER_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR'
});

// ============================================================
// HELPERS
// ============================================================

/**
 * Classifica o erro baseado na resposta
 */
const classifyError = (error, response) => {
    if (error.name === 'AbortError') {
        return {
            code: ERROR_CODES.TIMEOUT,
            message: 'Requisição cancelada por timeout'
        };
    }

    if (!response) {
        return {
            code: ERROR_CODES.NETWORK,
            message: 'Erro de conexão. Verifique sua internet.'
        };
    }

    switch (response.status) {
        case 401:
            return {
                code: ERROR_CODES.UNAUTHORIZED,
                message: 'Sessão expirada. Faça login novamente.'
            };
        case 404:
            return {
                code: ERROR_CODES.NOT_FOUND,
                message: 'Recurso não encontrado.'
            };
        case 500:
        case 502:
        case 503:
            return {
                code: ERROR_CODES.SERVER,
                message: 'Erro no servidor. Tente novamente mais tarde.'
            };
        default:
            return {
                code: ERROR_CODES.UNKNOWN,
                message: error.message || 'Erro desconhecido.'
            };
    }
};

/**
 * Aguarda um tempo antes de tentar novamente
 */
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// HOOK: useApi
// ============================================================

/**
 * Hook para fazer requisições à API com retry, timeout e tratamento de erros
 *
 * @param {Object} options - Opções de configuração
 * @param {number} options.timeout - Timeout em ms (default: 30000)
 * @param {number} options.retries - Número de tentativas (default: 0)
 * @param {boolean} options.throwOnError - Se deve lançar erro ou apenas retornar (default: false)
 *
 * @returns {Object} { execute, data, error, status, isLoading, reset }
 */
export const useApi = (options = {}) => {
    const {
        timeout = DEFAULT_TIMEOUT,
        retries = 0,
        throwOnError = false
    } = options;

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(API_STATES.IDLE);

    // Ref para controlar requisições canceladas
    const abortControllerRef = useRef(null);
    const isMountedRef = useRef(true);

    // Cleanup ao desmontar
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            abortControllerRef.current?.abort();
        };
    }, []);

    /**
     * Executa a requisição
     */
    const execute = useCallback(
        async (url, fetchOptions = {}) => {
            // Cancela requisição anterior se existir
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            // Atualiza estado
            if (isMountedRef.current) {
                setStatus(API_STATES.LOADING);
                setError(null);
            }

            let lastError = null;
            let response = null;

            // Tentativas com retry
            for (let attempt = 0; attempt <= retries; attempt++) {
                try {
                    // Timeout via AbortController
                    const timeoutId = setTimeout(() => {
                        abortControllerRef.current?.abort();
                    }, timeout);

                    response = await fetch(url, {
                        ...fetchOptions,
                        signal: abortControllerRef.current.signal
                    });

                    clearTimeout(timeoutId);

                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(
                            result.error ||
                                result.message ||
                                `HTTP ${response.status}`
                        );
                    }

                    // Sucesso
                    if (isMountedRef.current) {
                        setData(result.data);
                        setStatus(API_STATES.SUCCESS);
                    }

                    return { success: true, data: result.data };
                } catch (err) {
                    lastError = err;

                    // Se não foi cancelado manualmente e ainda tem tentativas, aguarda
                    if (err.name !== 'AbortError' && attempt < retries) {
                        await wait(
                            RETRY_DELAYS[attempt] ||
                                RETRY_DELAYS[RETRY_DELAYS.length - 1]
                        );
                    }
                }
            }

            // Falhou todas as tentativas
            const classifiedError = classifyError(lastError, response);

            if (isMountedRef.current) {
                setError(classifiedError);
                setStatus(API_STATES.ERROR);
            }

            if (throwOnError) {
                throw new Error(classifiedError.message);
            }

            return { success: false, error: classifiedError };
        },
        [timeout, retries, throwOnError]
    );

    /**
     * Reseta o estado
     */
    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setStatus(API_STATES.IDLE);
    }, []);

    /**
     * Cancela requisição em andamento
     */
    const cancel = useCallback(() => {
        abortControllerRef.current?.abort();
    }, []);

    return {
        execute,
        data,
        error,
        status,
        isLoading: status === API_STATES.LOADING,
        isSuccess: status === API_STATES.SUCCESS,
        isError: status === API_STATES.ERROR,
        reset,
        cancel
    };
};

// ============================================================
// HOOK: usePolling
// ============================================================

/**
 * Hook para polling automático de dados
 *
 * @param {Function} fetchFn - Função que retorna Promise com os dados
 * @param {number} interval - Intervalo em ms
 * @param {Object} options - Opções
 * @param {boolean} options.enabled - Se o polling está ativo (default: true)
 * @param {boolean} options.immediate - Se executa imediatamente (default: true)
 */
export const usePolling = (fetchFn, interval, options = {}) => {
    const { enabled = true, immediate = true } = options;

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const savedCallback = useRef(fetchFn);
    const intervalRef = useRef(null);

    // Atualiza a referência quando a função muda
    useEffect(() => {
        savedCallback.current = fetchFn;
    }, [fetchFn]);

    // Função de fetch
    const doFetch = useCallback(async () => {
        if (!enabled) return;

        setIsLoading(true);
        try {
            const result = await savedCallback.current();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [enabled]);

    // Setup do polling
    useEffect(() => {
        if (!enabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        if (immediate) {
            doFetch();
        }

        intervalRef.current = setInterval(doFetch, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, interval, immediate, doFetch]);

    // Refetch manual
    const refetch = useCallback(() => {
        doFetch();
    }, [doFetch]);

    return { data, error, isLoading, refetch };
};

export default useApi;
