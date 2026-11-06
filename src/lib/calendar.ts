import { addDays, format, parseISO, startOfWeek } from 'date-fns';

// calendars start on Monday, as is usual in Sri Lanka
const WEEK_STARTS_ON = 1;

// local calendar day, e.g. "2026-11-10"
export const dayKey = (value: Date | string) => format(typeof value === 'string' ? parseISO(value) : value, 'yyyy-MM-dd');

// the seven days of the week that contains the anchor
export function weekDays(anchor: Date): Date[] {
  const first = startOfWeek(anchor, { weekStartsOn: WEEK_STARTS_ON });
  return Array.from({ length: 7 }, (_, i) => addDays(first, i));
}

export const startOfWeekOf = (date: Date) => startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });

// items grouped by their local day, each day sorted by time
export function groupByDay<T>(items: T[], startOf: (item: T) => string): Map<string, T[]> {
  const days = new Map<string, T[]>();
  const sorted = [...items].sort((a, b) => Date.parse(startOf(a)) - Date.parse(startOf(b)));
  for (const item of sorted) {
    const key = dayKey(startOf(item));
    days.set(key, [...(days.get(key) ?? []), item]);
  }
  return days;
}

// output example "10 – 16 Nov 2026"
export function formatWeekRange(days: Date[]) {
  const first = days[0];
  const last = days[days.length - 1];
  const sameMonth = first.getMonth() === last.getMonth();
  return `${format(first, sameMonth ? 'd' : 'd MMM')} – ${format(last, 'd MMM yyyy')}`;
}
