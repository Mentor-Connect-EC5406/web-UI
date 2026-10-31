import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack React Query Client Configuration
 * Sets up global default options for caching, refetching, and stale times.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      gcTime: 1000 * 60 * 10,   // Garbage collection time (cache time) is set to 10 minutes
      retry: 1,                 // Retry failed requests once automatically
      refetchOnWindowFocus: false, // Prevent refetching when window regains focus
    },
    mutations: {
      retry: false,
    },
  },
});