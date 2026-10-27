import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'neutral' | 'brand' | 'info' | 'success' | 'accent';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-ink-secondary',
  brand: 'bg-brand-soft text-ink',
  info: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
  accent: 'bg-accent-soft text-accent',
};

interface BadgeProps extends ComponentProps<'span'> {
  tone?: BadgeTone;
}


export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', toneClasses[tone], className)}
      {...props}
    />
  );
}
