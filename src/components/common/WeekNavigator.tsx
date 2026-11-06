import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface WeekNavigatorProps {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  // shown when the visible week is not the current one
  onToday?: () => void;
  className?: string;
}

export function WeekNavigator({ label, onPrevious, onNext, previousDisabled, nextDisabled, onToday, className }: WeekNavigatorProps) {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <Button variant="ghost" size="icon" aria-label="Previous week" onClick={onPrevious} disabled={previousDisabled}>
        <ChevronLeft />
      </Button>
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-sm font-semibold text-ink" aria-live="polite">{label}</p>
        {onToday && <Button variant="secondary" size="sm" onClick={onToday}>This week</Button>}
      </div>
      <Button variant="ghost" size="icon" aria-label="Next week" onClick={onNext} disabled={nextDisabled}>
        <ChevronRight />
      </Button>
    </div>
  );
}
