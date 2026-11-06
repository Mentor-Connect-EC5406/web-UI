import { useState } from 'react';
import { addWeeks, format, parseISO } from 'date-fns';
import type { Slot } from '@/types';
import { WeekNavigator } from '@/components/common/WeekNavigator';
import { cn } from '@/lib/cn';
import { dayKey, formatWeekRange, groupByDay, startOfWeekOf, weekDays } from '@/lib/calendar';
import { formatTime, viewerTimezone } from '@/lib/format';

interface SlotPickerProps {
  slots: Slot[];
  selectedId: string | null;
  onSelect: (slot: Slot) => void;
  // hides slots that cannot be picked, e.g. inside the change window
  isPickable?: (slot: Slot) => boolean;
  emptyMessage?: string;
  now?: Date;
}

// choose a day first, then a time on that day
export function SlotPicker({ slots, selectedId, onSelect, isPickable, emptyMessage = 'No free times right now.', now = new Date() }: SlotPickerProps) {
  const open = slots.filter((s) => s.status === 'AVAILABLE' && parseISO(s.startsAt) > now && (!isPickable || isPickable(s)));
  const byDay = groupByDay(open, (s) => s.startsAt);
  const firstWeek = startOfWeekOf(open.length ? parseISO(open[0].startsAt) : now);
  const lastWeek = startOfWeekOf(open.length ? parseISO(open[open.length - 1].startsAt) : now);
  // a time chosen before opening, e.g. from an invitation, opens on its week and day
  const preselected = open.find((s) => s.id === selectedId);
  const [weekStart, setWeekStart] = useState(() => (preselected ? startOfWeekOf(parseISO(preselected.startsAt)) : firstWeek));
  const days = weekDays(weekStart);
  const firstDayWithSlots = (week: Date[]) => week.find((d) => byDay.has(dayKey(d)));
  const [dayChoice, setDayChoice] = useState<string | null>(() => (preselected ? dayKey(preselected.startsAt) : null));
  // the chosen day only counts while it is in the visible week
  const visibleDay = days.find((d) => dayKey(d) === dayChoice) ?? firstDayWithSlots(days);
  const times = visibleDay ? byDay.get(dayKey(visibleDay)) ?? [] : [];

  if (open.length === 0) {
    return <p className="rounded-xl bg-surface-subtle p-4 text-sm text-ink-secondary">{emptyMessage}</p>;
  }

  function moveWeek(by: number) {
    setWeekStart((w) => addWeeks(w, by));
    setDayChoice(null);
  }

  return (
    <div>
      <WeekNavigator
        label={formatWeekRange(days)}
        onPrevious={() => moveWeek(-1)}
        onNext={() => moveWeek(1)}
        previousDisabled={weekStart <= firstWeek}
        nextDisabled={weekStart >= lastWeek}
        className="mb-2"
      />

      <div role="group" aria-label="Choose a day" className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const count = byDay.get(dayKey(day))?.length ?? 0;
          const active = visibleDay && dayKey(visibleDay) === dayKey(day);
          return (
            <button
              key={dayKey(day)}
              type="button"
              disabled={count === 0}
              aria-pressed={!!active}
              aria-label={`${format(day, 'EEEE d MMMM')}, ${count === 0 ? 'no free times' : `${count} free ${count === 1 ? 'time' : 'times'}`}`}
              onClick={() => setDayChoice(dayKey(day))}
              className={cn(
                'flex flex-col items-center rounded-xl border py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:border-transparent disabled:text-ink-muted',
                active ? 'border-ink bg-brand text-ink' : 'border-line bg-surface text-ink hover:border-line-strong',
              )}
            >
              <span className="font-medium">{format(day, 'EEEEE')}</span>
              <span className="text-sm font-semibold">{format(day, 'd')}</span>
              <span aria-hidden className={cn('mt-0.5 size-1.5 rounded-full', count > 0 ? 'bg-success' : 'bg-transparent')} />
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {visibleDay ? (
          <>
            <p className="mb-2 text-xs text-ink-secondary">
              {format(visibleDay, 'EEEE d MMMM')} · times in {viewerTimezone()}
            </p>
            <div role="group" aria-label="Choose a time" className="grid grid-cols-2 gap-2">
              {times.map((slot) => {
                const selected = slot.id === selectedId;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelect(slot)}
                    className={cn(
                      'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                      selected ? 'border-ink bg-brand-soft text-ink ring-2 ring-ink' : 'border-success bg-success-soft text-success hover:bg-surface',
                    )}
                  >
                    {formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-secondary">No free times this week. Try the next week.</p>
        )}
      </div>
    </div>
  );
}
