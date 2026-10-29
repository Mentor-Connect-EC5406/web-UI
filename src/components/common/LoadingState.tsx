import { cn } from '@/lib/cn';

interface LoadingStateProps {
  message?: string;
  fullscreen?: boolean;
}

/** Spinner for page-level loading */
export function LoadingState({ message = 'Loading…', fullscreen }: LoadingStateProps) {
  return (
    <div role="status" className={cn('flex flex-col items-center justify-center gap-3', fullscreen ? 'min-h-screen' : 'py-16')}>
      <div className="size-10 animate-spin rounded-full border-4 border-surface-muted border-t-brand" />
      <p className="text-sm text-ink-secondary">{message}</p>
    </div>
  );
}
