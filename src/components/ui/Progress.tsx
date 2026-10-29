import { cn } from '@/lib/cn';

interface ProgressProps {
  // 0 to 100
  value: number;
  label: string;
  className?: string;
}

export function Progress({ value, label, className }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-muted', className)}
    >
      <div className="h-full rounded-full bg-brand transition-[width] duration-200" style={{ width: `${value}%` }} />
    </div>
  );
}
