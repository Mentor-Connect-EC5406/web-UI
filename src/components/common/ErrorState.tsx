import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from './EmptyState';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Failed-load message with an optional retry button */
export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      icon={AlertCircle}
      tone="error"
      title={title}
      description={message}
      action={onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    />
  );
}
