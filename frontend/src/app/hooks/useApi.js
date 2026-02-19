import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API calls with loading and error states
 * @param {Function} apiFunc - API function to call
 * @param {boolean} immediate - Whether to call immediately on mount
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunc, immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...params) => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiFunc(...params);
                setData(result);
                return result;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [apiFunc]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, []);

    return { data, loading, error, execute, reset };
};

export default useApi;
