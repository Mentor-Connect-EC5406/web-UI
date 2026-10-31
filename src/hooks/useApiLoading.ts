import { useState, useCallback } from 'react';

/**
 * Custom Hook for managing API loading states, errors, and data in components.
 */
export const useApiLoading = <T = any>() => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    data,
    execute,
    setData,
    setError,
  };
};