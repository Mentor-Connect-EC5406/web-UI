import type { ReactNode } from 'react';
import { format, isToday } from 'date-fns';
import { cn } from '@/lib/cn';
import { dayKey } from '@/lib/calendar';

interface WeekCalendarProps<T> {
  days: Date[];
  itemsByDay: Map<string, T[]>;
  renderItem: (item: T) => ReactNode;
  itemKey: (item: T) => string;
  emptyDayLabel?: string;
}

// seven columns on wide screens, a list of days on phones where columns would be too narrow
export function WeekCalendar<T>({ days, itemsByDay, renderItem, itemKey, emptyDayLabel = 'Nothing scheduled' }: WeekCalendarProps<T>) {
  return (
    <ol className="grid grid-cols-1 gap-3 lg:grid-cols-7 lg:gap-2">
      {days.map((day) => {
        const items = itemsByDay.get(dayKey(day)) ?? [];
        const today = isToday(day);
        return (
          <li
            key={dayKey(day)}
            aria-label={`${format(day, 'EEEE d MMMM')}, ${items.length} ${items.length === 1 ? 'item' : 'items'}`}
            className={cn('rounded-2xl border bg-surface p-3 lg:min-h-48', today ? 'border-brand' : 'border-line')}
          >
            <p className="mb-2 flex items-baseline gap-2 lg:flex-col lg:gap-0">
              <span className="text-xs font-medium tracking-wide text-ink-secondary uppercase">{format(day, 'EEE')}</span>
              <span className="text-sm font-semibold text-ink lg:text-lg">{format(day, 'd MMM')}</span>
              {today && <span className="text-xs font-medium text-ink">Today</span>}
            </p>
            {items.length === 0 ? (
              <p className="text-xs text-ink-muted">{emptyDayLabel}</p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => <li key={itemKey(item)}>{renderItem(item)}</li>)}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
