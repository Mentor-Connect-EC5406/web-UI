import { describe, expect, it } from 'vitest';
import type { Session } from '@/types';
import { CANCELLATION_WINDOW_HOURS, REVIEW_MIN_LENGTH } from '@/config/constants';
import { canCancel, isInsideChangeWindow, joinState, mentoredStudents, validateReview, validateTask } from './sessions';

const now = new Date('2026-11-01T09:00:00Z');
const hoursFromNow = (h: number) => new Date(now.getTime() + h * 3_600_000).toISOString();

describe('isInsideChangeWindow', () => {
  it('allows changes before the window', () => {
    expect(isInsideChangeWindow(hoursFromNow(CANCELLATION_WINDOW_HOURS + 1), now)).toBe(false);
    expect(isInsideChangeWindow(hoursFromNow(CANCELLATION_WINDOW_HOURS), now)).toBe(false);
  });

  it('blocks changes inside the window and after the start', () => {
    expect(isInsideChangeWindow(hoursFromNow(CANCELLATION_WINDOW_HOURS - 1), now)).toBe(true);
    expect(isInsideChangeWindow(hoursFromNow(-2), now)).toBe(true);
  });
});

describe('validateReview', () => {
  it('needs a rating and enough text', () => {
    expect(validateReview(0, 'short')).toEqual({ rating: expect.any(String), text: expect.any(String) });
  });

  it('accepts a rated review of the minimum length', () => {
    expect(validateReview(4, 'x'.repeat(REVIEW_MIN_LENGTH))).toEqual({});
  });

  it('ignores surrounding spaces when counting', () => {
    expect(validateReview(5, `  ${'x'.repeat(REVIEW_MIN_LENGTH - 1)}  `).text).toBeDefined();
  });
});

describe('mentoredStudents', () => {
  const session = (over: Partial<Session>): Session => ({
    id: Math.random().toString(), mentorName: 'Nimal Silva', studentName: 'Kavya', topic: 'Topic',
    startsAt: '2026-10-01T10:00:00Z', endsAt: '2026-10-01T11:00:00Z', status: 'COMPLETED', meetingUrl: null, price: 0, ...over,
  });

  it('groups by student, counts sessions and keeps the latest date, newest first', () => {
    const result = mentoredStudents([
      session({ studentId: 's2', studentName: 'Kavya', startsAt: '2026-10-01T10:00:00Z' }),
      session({ studentId: 's2', studentName: 'Kavya', startsAt: '2026-10-20T10:00:00Z', status: 'CONFIRMED' }),
      session({ studentId: 's3', studentName: 'Dilan', startsAt: '2026-10-25T10:00:00Z' }),
    ]);
    expect(result).toEqual([
      { key: 's3', studentId: 's3', name: 'Dilan', sessionCount: 1, lastSessionAt: '2026-10-25T10:00:00Z' },
      { key: 's2', studentId: 's2', name: 'Kavya', sessionCount: 2, lastSessionAt: '2026-10-20T10:00:00Z' },
    ]);
  });

  it('leaves out cancelled sessions and falls back to the name without an id', () => {
    const result = mentoredStudents([
      session({ studentName: 'Tharushi' }),
      session({ studentName: 'Tharushi', status: 'CANCELLED', startsAt: '2026-10-30T10:00:00Z' }),
      session({ studentName: 'Sahan', status: 'CANCELLED' }),
    ]);
    expect(result).toEqual([{ key: 'Tharushi', studentId: null, name: 'Tharushi', sessionCount: 1, lastSessionAt: '2026-10-01T10:00:00Z' }]);
  });
});

describe('session actions', () => {
  const session = (status: Session['status'], startHours: number, meetingUrl: string | null = 'https://meet.jit.si/x'): Session => ({
    id: 'b1', mentorName: 'Nimal', studentName: 'Kasun', topic: 'CV review', price: 2500, meetingUrl, status,
    startsAt: hoursFromNow(startHours), endsAt: hoursFromNow(startHours + 1),
  });

  it('opens the meeting link shortly before the start and closes it after the end', () => {
    expect(joinState(session('CONFIRMED', 2), now)).toBe('early');
    expect(joinState(session('CONFIRMED', 0.2), now)).toBe('open');
    expect(joinState(session('CONFIRMED', -0.5), now)).toBe('open');
    expect(joinState(session('CONFIRMED', -2), now)).toBe('ended');
    expect(joinState(session('PENDING', 0.2), now)).toBe('unavailable');
    expect(joinState(session('CONFIRMED', 0.2, null), now)).toBe('unavailable');
  });

  it('lets a pending request be withdrawn freely but guards a confirmed session', () => {
    expect(canCancel(session('PENDING', 1), now)).toBe(true);
    expect(canCancel(session('CONFIRMED', 1), now)).toBe(false);
    expect(canCancel(session('CONFIRMED', CANCELLATION_WINDOW_HOURS + 1), now)).toBe(true);
    expect(canCancel(session('COMPLETED', 48), now)).toBe(false);
  });

  it('validates task titles', () => {
    expect(validateTask({ title: ' ', details: '' })).toEqual({ title: 'Give it a short title.' });
    expect(validateTask({ title: 'Read chapter 3', details: '' })).toEqual({});
  });
});
