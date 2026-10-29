import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** e.g. a <Button> leading the user to the next step */
  action?: ReactNode;
  /** Visual tone of the icon circle */
  tone?: 'neutral' | 'error';
  className?: string;
}

/** Centred message for empty lists, errors and unfinished pages — DESIGN.md §15 */
export function EmptyState({ icon: Icon, title, description, action, tone = 'neutral', className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      <div
        className={cn(
          'flex size-16 items-center justify-center rounded-full',
          tone === 'error' ? 'bg-accent-soft text-accent' : 'bg-surface-muted text-ink-muted',
        )}
      >
        <Icon className="size-8" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {description && <p className="max-w-sm text-sm text-ink-secondary">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
