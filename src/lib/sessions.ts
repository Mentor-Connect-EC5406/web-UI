import { differenceInMinutes, parseISO } from 'date-fns';
import type { MentoredStudent, Session, SessionTaskInput } from '@/types';
import {
  CANCELLATION_WINDOW_HOURS,
  JOIN_EARLY_MINUTES,
  REVIEW_MAX_LENGTH,
  REVIEW_MIN_LENGTH,
  TASK_DETAILS_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
} from '@/config/constants';

// changes inside the window leave the mentor too little notice to fill the slot
export const isInsideChangeWindow = (startsAt: string, now: Date = new Date()) =>
  differenceInMinutes(parseISO(startsAt), now) < CANCELLATION_WINDOW_HOURS * 60;

export const isUpcoming = (s: Session) => s.status === 'PENDING' || s.status === 'CONFIRMED';

export const hasStarted = (s: Session, now: Date = new Date()) => parseISO(s.startsAt) <= now;

// both sides use the same link, which opens a little before the start and closes at the end
export function joinState(s: Session, now: Date = new Date()): 'open' | 'early' | 'ended' | 'unavailable' {
  if (s.status !== 'CONFIRMED' || !s.meetingUrl) return 'unavailable';
  if (parseISO(s.endsAt) < now) return 'ended';
  return differenceInMinutes(parseISO(s.startsAt), now) > JOIN_EARLY_MINUTES ? 'early' : 'open';
}

// a pending request can be withdrawn any time, a confirmed session only outside the change window
export const canCancel = (s: Session, now: Date = new Date()) =>
  s.status === 'PENDING' ? !hasStarted(s, now) : s.status === 'CONFIRMED' && !isInsideChangeWindow(s.startsAt, now);

export const canReschedule = (s: Session, now: Date = new Date()) => isUpcoming(s) && !isInsideChangeWindow(s.startsAt, now);

// meeting providers all use https, anything else is likely a typo
export const isMeetingUrl = (value: string) => {
  try {
    return new URL(value.trim()).protocol === 'https:';
  } catch {
    return false;
  }
};

export const sortByStart =(list: Session[], direction: 'asc' | 'desc' = 'asc') =>
  [...list].sort((a, b) => (direction === 'asc' ? 1 : -1) * (Date.parse(a.startsAt) - Date.parse(b.startsAt)));

export interface TaskErrors {
  title?: string;
  details?: string;
}

export function validateTask({ title, details }: Pick<SessionTaskInput, 'title' | 'details'>): TaskErrors {
  const errors: TaskErrors = {};
  if (!title.trim()) errors.title = 'Give it a short title.';
  else if (title.trim().length > TASK_TITLE_MAX_LENGTH) errors.title = `Keep the title under ${TASK_TITLE_MAX_LENGTH} characters.`;
  if (details.trim().length > TASK_DETAILS_MAX_LENGTH) errors.details = `Keep the details under ${TASK_DETAILS_MAX_LENGTH} characters.`;
  return errors;
}

export interface ReviewErrors {
  rating?: string;
  text?: string;
}

export function validateReview(rating: number, text: string): ReviewErrors {
  const errors: ReviewErrors = {};
  const length = text.trim().length;
  if (rating < 1 || rating > 5) errors.rating = 'Choose a rating from 1 to 5 stars.';
  if (length < REVIEW_MIN_LENGTH) errors.text = `Write at least ${REVIEW_MIN_LENGTH} characters.`;
  else if (length > REVIEW_MAX_LENGTH) errors.text = `Keep it under ${REVIEW_MAX_LENGTH} characters.`;
  return errors;
}

// cancelled sessions do not count as mentoring, newest contact first
export function mentoredStudents(sessions: Session[]): MentoredStudent[] {
  const byStudent = new Map<string, MentoredStudent>();
  for (const s of sessions) {
    if (s.status === 'CANCELLED') continue;
    const key = s.studentId ?? s.studentName;
    const current = byStudent.get(key);
    if (!current) {
      byStudent.set(key, { key, studentId: s.studentId ?? null, name: s.studentName, sessionCount: 1, lastSessionAt: s.startsAt });
    } else {
      current.sessionCount += 1;
      if (parseISO(s.startsAt) > parseISO(current.lastSessionAt)) current.lastSessionAt = s.startsAt;
    }
  }
  return [...byStudent.values()].sort((a, b) => parseISO(b.lastSessionAt).getTime() - parseISO(a.lastSessionAt).getTime());
}
