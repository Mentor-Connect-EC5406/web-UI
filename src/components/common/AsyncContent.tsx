import type { ReactNode } from 'react';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';

interface QueryLike<T> {
  data: T | undefined;
  isPending: boolean;
  error: Error | null;
  refetch: () => unknown;
}

interface AsyncContentProps<T> {
  query: QueryLike<T>;
  // defaults to a spinner, pass a skeleton for list shaped content
  loading?: ReactNode;
  children: (data: T) => ReactNode;
}

// centralises loading error retry so each page does not repeat the same pattern
export function AsyncContent<T>({ query, loading, children }: AsyncContentProps<T>) {
  if (query.isPending) return <>{loading ?? <LoadingState />}</>;
  if (query.error || query.data === undefined) {
    return <ErrorState message={query.error?.message} onRetry={() => query.refetch()} />;
  }
  return <>{children(query.data)}</>;
}
