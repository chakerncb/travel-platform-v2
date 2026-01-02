import { useState, useEffect } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  autoFetch?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for API calls with loading and error states
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const { initialData = null, onSuccess, onError, autoFetch = true } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for mutation operations (POST, PUT, DELETE)
 */
export function useMutation<T, TVariables = void>(
  mutationFunction: (variables: TVariables) => Promise<T>,
  options: {
    onSuccess?: (data: T, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: TVariables) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFunction(variables);
      setData(result);
      options.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      options.onError?.(error, variables);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, data, loading, error, reset };
}
