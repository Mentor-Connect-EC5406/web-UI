import { addMinutes, addWeeks, differenceInMinutes, isValid, parseISO } from 'date-fns';
import type { Slot } from '@/types';
import { MAX_SLOTS_PER_SAVE, SESSION_LENGTH_MINUTES } from '@/config/constants';
import { sessionLengthLabel } from './format';

// touching edges are allowed so back to back slots work
export const rangesOverlap = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => aStart < bEnd && bStart < aEnd;

export const findOverlap = (start: Date, end: Date, slots: Slot[]) =>
  slots.find((s) => rangesOverlap(start, end, parseISO(s.startsAt), parseISO(s.endsAt)));

export interface SlotRange {
  startsAt: string;
  endsAt: string;
}

export interface SlotRangeInput {
  date: string;
  startTime: string;
  endTime: string;
  // 1 means only the chosen date
  repeatWeeks: number;
}

export interface SlotRangeErrors {
  date?: string;
  startTime?: string;
  endTime?: string;
}

export type SlotRangeResult =
  | { ok: true; ranges: SlotRange[]; skipped: number }
  | { ok: false; errors: SlotRangeErrors };

// the api only takes slots of one session length, so a range like 9:00 to 12:00 becomes three slots
// times that already passed or overlap an existing slot are skipped and counted
export function buildSlotRanges(input: SlotRangeInput, existing: Slot[], now: Date = new Date()): SlotRangeResult {
  const { date, startTime, endTime, repeatWeeks } = input;
  const errors: SlotRangeErrors = {};
  if (!date) errors.date = 'Choose a date.';
  if (!startTime) errors.startTime = 'Choose a start time.';
  if (!endTime) errors.endTime = 'Choose an end time.';
  if (errors.date || errors.startTime || errors.endTime) return { ok: false, errors };

  const firstStart = new Date(`${date}T${startTime}`);
  const firstEnd = new Date(`${date}T${endTime}`);
  if (!isValid(firstStart) || !isValid(firstEnd)) return { ok: false, errors: { date: 'Enter a valid date and time.' } };

  const minutes = differenceInMinutes(firstEnd, firstStart);
  if (minutes < SESSION_LENGTH_MINUTES) {
    return { ok: false, errors: { endTime: `End at least ${sessionLengthLabel()} after the start.` } };
  }
  if (minutes % SESSION_LENGTH_MINUTES !== 0) {
    return { ok: false, errors: { endTime: `Each session is ${sessionLengthLabel()}, so the range must divide into whole sessions.` } };
  }
  if (firstStart <= now) return { ok: false, errors: { startTime: 'This time has already passed. Choose a later time.' } };

  const perDay = minutes / SESSION_LENGTH_MINUTES;
  const total = perDay * repeatWeeks;
  if (total > MAX_SLOTS_PER_SAVE) {
    return { ok: false, errors: { endTime: `That makes ${total} slots. Add at most ${MAX_SLOTS_PER_SAVE} at a time.` } };
  }

  const ranges: SlotRange[] = [];
  let skipped = 0;
  for (let week = 0; week < repeatWeeks; week++) {
    // addWeeks keeps the wall clock time across daylight saving changes
    const dayStart = addWeeks(firstStart, week);
    for (let i = 0; i < perDay; i++) {
      const start = addMinutes(dayStart, i * SESSION_LENGTH_MINUTES);
      const end = addMinutes(start, SESSION_LENGTH_MINUTES);
      if (start <= now || findOverlap(start, end, existing)) skipped++;
      else ranges.push({ startsAt: start.toISOString(), endsAt: end.toISOString() });
    }
  }

  if (ranges.length === 0) {
    return { ok: false, errors: { startTime: 'These times overlap your existing slots. Choose another time.' } };
  }
  return { ok: true, ranges, skipped };
}
