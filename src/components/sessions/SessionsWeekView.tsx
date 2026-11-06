import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addWeeks } from 'date-fns';
import type { Session } from '@/types';
import { WeekCalendar } from '@/components/common/WeekCalendar';
import { WeekNavigator } from '@/components/common/WeekNavigator';
import { cn } from '@/lib/cn';
import { formatWeekRange, groupByDay, startOfWeekOf, weekDays } from '@/lib/calendar';
import { formatTime } from '@/lib/format';
import { sessionStatusMeta } from '@/lib/status';

interface SessionsWeekViewProps {
  sessions: Session[];
  counterpart: 'mentor' | 'student';
  detailsHref: (id: string) => string;
}

// a week of sessions as a calendar, each one opens its page
export function SessionsWeekView({ sessions, counterpart, detailsHref }: SessionsWeekViewProps) {
  const thisWeek = startOfWeekOf(new Date());
  const [weekStart, setWeekStart] = useState(thisWeek);
  const days = weekDays(weekStart);

  return (
    <div className="space-y-4">
      <WeekNavigator
        label={formatWeekRange(days)}
        onPrevious={() => setWeekStart((w) => addWeeks(w, -1))}
        onNext={() => setWeekStart((w) => addWeeks(w, 1))}
        onToday={weekStart.getTime() !== thisWeek.getTime() ? () => setWeekStart(thisWeek) : undefined}
        className="sm:max-w-md"
      />
      <WeekCalendar
        days={days}
        itemsByDay={groupByDay(sessions, (s) => s.startsAt)}
        itemKey={(s) => s.id}
        emptyDayLabel="No sessions"
        renderItem={(s) => (
          <Link
            to={detailsHref(s.id)}
            className={cn(
              'block rounded-xl border p-2 text-xs transition-colors hover:border-ink',
              s.status === 'PENDING' ? 'border-dashed border-line-strong bg-brand-soft' : 'border-line bg-surface-subtle',
            )}
          >
            <span className="block font-semibold text-ink">{formatTime(s.startsAt)}</span>
            <span className="block truncate text-ink">{counterpart === 'mentor' ? s.mentorName : s.studentName}</span>
            <span className="block text-ink-secondary">{sessionStatusMeta[s.status].label}</span>
          </Link>
        )}
      />
    </div>
  );
}
