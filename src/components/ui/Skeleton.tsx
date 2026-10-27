import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

// animated placeholder for loading states
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden className={cn('animate-pulse rounded-xl bg-surface-muted', className)} {...props} />;
}
