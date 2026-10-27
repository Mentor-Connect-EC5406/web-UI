import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

interface ListSkeletonProps {
  rows?: number;
  // tailwind height class for each row e.g. "h-20"
  rowClassName?: string;
  className?: string;
}

// placeholder rows for list shaped loading states
export function ListSkeleton({ rows = 3, rowClassName = 'h-20', className }: ListSkeletonProps) {
  return (
    <div role="status" aria-label="Loading" className={cn('space-y-3', className)}>
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} className={rowClassName} />)}
    </div>
  );
}
