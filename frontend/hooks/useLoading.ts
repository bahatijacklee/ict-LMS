/**
 * useLoading Hook - Phase 3 Enhancement
 * Manages loading states for components
 */

import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  error: Error | null;
  startLoading: () => void;
  stopLoading: (error?: Error) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}

/**
 * Custom hook to manage loading and error states
 * 
 * @example
 * const { isLoading, error, startLoading, stopLoading } = useLoading();
 * 
 * const handleFetch = async () => {
 *   startLoading();
 *   try {
 *     const data = await fetchData();
 *     stopLoading();
 *   } catch (err) {
 *     stopLoading(err as Error);
 *   }
 * };
 */
export function useLoading(): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback((error?: Error) => {
    setIsLoading(false);
    if (error) {
      setError(error);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError,
    reset,
  };
}

/**
 * Multiple Loading States Hook
 * Manage loading states for multiple async operations
 */
interface LoadingStates {
  [key: string]: boolean;
}

interface UseMultipleLoadingReturn {
  loadingStates: LoadingStates;
  isAnyLoading: boolean;
  setLoading: (key: string, loading: boolean) => void;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  reset: () => void;
}

export function useMultipleLoading(
  initialKeys: string[] = []
): UseMultipleLoadingReturn {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(
    initialKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const isAnyLoading = Object.values(loadingStates).some((state) => state);

  const setLoading = useCallback(
    (key: string, loading: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [key]: loading }));
    },
    []
  );

  const startLoading = useCallback(
    (key: string) => setLoading(key, true),
    [setLoading]
  );

  const stopLoading = useCallback(
    (key: string) => setLoading(key, false),
    [setLoading]
  );

  const reset = useCallback(() => {
    setLoadingStates(
      initialKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );
  }, [initialKeys]);

  return {
    loadingStates,
    isAnyLoading,
    setLoading,
    startLoading,
    stopLoading,
    reset,
  };
}
