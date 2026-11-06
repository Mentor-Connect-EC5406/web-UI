import { describe, expect, it } from 'vitest';
import { format } from 'date-fns';
import type { MentorshipSchedule } from '@/types';
import { describeSchedule, ordinal, upcomingDates, validateMentorshipRequest } from './mentorships';

const schedule = (changes: Partial<MentorshipSchedule> = {}): MentorshipSchedule => ({
  frequency: 'WEEKLY',
  weekday: 2,
  dayOfMonth: 5,
  time: '18:00',
  startDate: '2026-11-09',
  timezone: 'Asia/Colombo',
  ...changes,
});
const days = (list: Date[]) => list.map((d) => format(d, 'yyyy-MM-dd HH:mm'));

describe('mentorship schedules', () => {
  it('describes each frequency in plain words', () => {
    expect(describeSchedule(schedule())).toBe('Every Tuesday at 6:00 PM');
    expect(describeSchedule(schedule({ frequency: 'BIWEEKLY' }))).toBe('Every other Tuesday at 6:00 PM');
    expect(describeSchedule(schedule({ frequency: 'MONTHLY', dayOfMonth: 22 }))).toBe('Monthly on the 22nd at 6:00 PM');
    expect([1, 2, 3, 11, 21].map(ordinal)).toEqual(['1st', '2nd', '3rd', '11th', '21st']);
  });

  it('lists the first dates from the start date', () => {
    expect(days(upcomingDates(schedule(), 2))).toEqual(['2026-11-10 18:00', '2026-11-17 18:00']);
    expect(days(upcomingDates(schedule({ frequency: 'BIWEEKLY' }), 2))).toEqual(['2026-11-10 18:00', '2026-11-24 18:00']);
    // the 5th has passed in the start month, so the first session is next month
    expect(days(upcomingDates(schedule({ frequency: 'MONTHLY' }), 2))).toEqual(['2026-12-05 18:00', '2027-01-05 18:00']);
  });

  it('requires a title, goals and a start date that has not passed', () => {
    const now = new Date('2026-11-12T09:00');
    expect(validateMentorshipRequest({ title: '', goals: ' ', schedule: schedule() }, now)).toEqual({
      title: 'Give the mentorship a short title.',
      goals: 'Tell the mentor what you want to achieve.',
      startDate: 'Choose today or a later date.',
    });
    expect(validateMentorshipRequest({ title: 'Frontend career', goals: 'Get an internship', schedule: schedule({ startDate: '2026-11-12' }) }, now)).toEqual({});
  });
});
