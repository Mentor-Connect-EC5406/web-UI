import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

// surface card with border
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('rounded-2xl border border-line bg-surface', className)} {...props} />;
}

interface CardHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  title: ReactNode;
  // optional element on the right e.g. a view all link
  action?: ReactNode;
}

export function CardHeader({ title, action, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3 px-6 pt-6 pb-4', className)} {...props}>
      <h2 className="flex items-center gap-2 text-base font-semibold text-ink">{title}</h2>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('px-6 pb-6', className)} {...props} />;
}
