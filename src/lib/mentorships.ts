import { addDays, addMonths, addWeeks, format, isValid, parse, startOfDay } from 'date-fns';
import type { Mentorship, MentorshipSchedule, Weekday } from '@/types';
import { MENTORSHIP_GOALS_MAX_LENGTH, MENTORSHIP_TITLE_MAX_LENGTH } from '@/config/constants';
import { WEEKDAY_OPTIONS } from '@/config/options';
import { viewerTimezone } from './format';

// monthly sessions stop at the 28th so every month has the day
export const MAX_DAY_OF_MONTH = 28;

const weekdayName = (day: Weekday) => WEEKDAY_OPTIONS.find((o) => o.value === String(day))?.label ?? '';

// 1 becomes "1st", 22 becomes "22nd"
export function ordinal(n: number) {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`;
}

// "18:30" becomes "6:30 PM"
export const formatClockTime = (time: string) => format(parse(time, 'HH:mm', new Date()), 'h:mm a');

// output example "Every other Tuesday at 6:00 PM"
export function describeSchedule({ frequency, weekday, dayOfMonth, time }: MentorshipSchedule) {
  const at = formatClockTime(time);
  if (frequency === 'MONTHLY') return `Monthly on the ${ordinal(dayOfMonth)} at ${at}`;
  return `${frequency === 'BIWEEKLY' ? 'Every other' : 'Every'} ${weekdayName(weekday)} at ${at}`;
}

// the first few session dates from the start date, in the viewer's timezone
export function upcomingDates(schedule: MentorshipSchedule, count: number): Date[] {
  const start = parse(schedule.startDate, 'yyyy-MM-dd', new Date());
  const [hours, minutes] = schedule.time.split(':').map(Number);
  if (!isValid(start) || Number.isNaN(hours)) return [];
  const withTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes);

  if (schedule.frequency === 'MONTHLY') {
    let first = new Date(start.getFullYear(), start.getMonth(), schedule.dayOfMonth);
    if (first < startOfDay(start)) first = addMonths(first, 1);
    return Array.from({ length: count }, (_, i) => withTime(addMonths(first, i)));
  }
  const first = addDays(start, (schedule.weekday - start.getDay() + 7) % 7);
  const step = schedule.frequency === 'BIWEEKLY' ? 2 : 1;
  return Array.from({ length: count }, (_, i) => withTime(addWeeks(first, i * step)));
}

// a week from today at 6 PM, a common after lectures slot
export function defaultSchedule(now: Date = new Date()): MentorshipSchedule {
  const start = addDays(now, 7);
  return {
    frequency: 'WEEKLY',
    weekday: start.getDay() as Weekday,
    dayOfMonth: Math.min(start.getDate(), MAX_DAY_OF_MONTH),
    time: '18:00',
    startDate: format(start, 'yyyy-MM-dd'),
    timezone: viewerTimezone(),
  };
}

export interface MentorshipErrors {
  title?: string;
  goals?: string;
  startDate?: string;
  time?: string;
}

export function validateSchedule(schedule: MentorshipSchedule, now: Date = new Date()): MentorshipErrors {
  const errors: MentorshipErrors = {};
  const start = parse(schedule.startDate, 'yyyy-MM-dd', new Date());
  if (!schedule.startDate || !isValid(start)) errors.startDate = 'Choose a start date.';
  else if (start < startOfDay(now)) errors.startDate = 'Choose today or a later date.';
  if (!/^\d{2}:\d{2}$/.test(schedule.time)) errors.time = 'Choose a time.';
  return errors;
}

export function validateMentorshipRequest(
  values: { title: string; goals: string; schedule: MentorshipSchedule },
  now: Date = new Date(),
): MentorshipErrors {
  const errors = validateSchedule(values.schedule, now);
  const title = values.title.trim();
  const goals = values.goals.trim();
  if (!title) errors.title = 'Give the mentorship a short title.';
  else if (title.length > MENTORSHIP_TITLE_MAX_LENGTH) errors.title = `Keep the title under ${MENTORSHIP_TITLE_MAX_LENGTH} characters.`;
  if (!goals) errors.goals = 'Tell the mentor what you want to achieve.';
  else if (goals.length > MENTORSHIP_GOALS_MAX_LENGTH) errors.goals = `Keep this under ${MENTORSHIP_GOALS_MAX_LENGTH} characters.`;
  return errors;
}

export const hasErrors = (errors: object) => Object.keys(errors).length > 0;

export const isOpenMentorship = (m: Mentorship) => m.status === 'REQUESTED' || m.status === 'ACTIVE';
