import { differenceInMinutes, parseISO } from 'date-fns';
import type { MentoredStudent, Session } from '@/types';
import { CANCELLATION_WINDOW_HOURS, REVIEW_MAX_LENGTH, REVIEW_MIN_LENGTH } from '@/config/constants';

// changes inside the window leave the mentor too little notice to fill the slot
export const isInsideChangeWindow = (startsAt: string, now: Date = new Date()) =>
  differenceInMinutes(parseISO(startsAt), now) < CANCELLATION_WINDOW_HOURS * 60;

export const isUpcoming = (s: Session) => s.status === 'PENDING' || s.status === 'CONFIRMED';

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
