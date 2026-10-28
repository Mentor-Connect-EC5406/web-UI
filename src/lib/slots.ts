import { addMinutes, isValid, parseISO } from 'date-fns';
import type { Slot } from '@/types';
import { SESSION_LENGTH_MINUTES } from '@/config/constants';

// touching edges are allowed so back to back slots work
export const rangesOverlap = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => aStart < bEnd && bStart < aEnd;

export const findOverlap = (start: Date, end: Date, slots: Slot[]) =>
  slots.find((s) => rangesOverlap(start, end, parseISO(s.startsAt), parseISO(s.endsAt)));

export interface NewSlotErrors {
  date?: string;
  time?: string;
}

export type NewSlotResult =
  | { ok: true; startsAt: string; endsAt: string }
  | { ok: false; errors: NewSlotErrors };

// date and time come from native inputs in the viewer's local timezone
export function validateNewSlot(date: string, time: string, existing: Slot[], now: Date = new Date()): NewSlotResult {
  const errors: NewSlotErrors = {};
  if (!date) errors.date = 'Choose a date.';
  if (!time) errors.time = 'Choose a start time.';
  if (errors.date || errors.time) return { ok: false, errors };

  const start = new Date(`${date}T${time}`);
  if (!isValid(start)) return { ok: false, errors: { date: 'Enter a valid date and time.' } };
  if (start <= now) return { ok: false, errors: { time: 'This time has already passed. Choose a later time.' } };

  const end = addMinutes(start, SESSION_LENGTH_MINUTES);
  if (findOverlap(start, end, existing)) {
    return { ok: false, errors: { time: 'This overlaps one of your existing slots. Choose another time.' } };
  }
  return { ok: true, startsAt: start.toISOString(), endsAt: end.toISOString() };
}
