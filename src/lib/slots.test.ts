import { describe, expect, it } from 'vitest';
import type { Slot } from '@/types';
import { buildSlotRanges, rangesOverlap } from './slots';

// local times so the test does not depend on the machine timezone
const at = (date: string, time: string) => new Date(`${date}T${time}`).toISOString();
const slot = (start: string, end: string): Slot => ({ id: start, startsAt: at('2026-11-10', start), endsAt: at('2026-11-10', end), status: 'AVAILABLE' });
const now = new Date('2026-11-01T09:00');
const existing = [slot('10:00', '11:00')];
const input = (startTime: string, endTime: string, repeatWeeks = 1, date = '2026-11-10') => ({ date, startTime, endTime, repeatWeeks });

describe('rangesOverlap', () => {
  const d = (t: string) => new Date(`2026-11-10T${t}`);
  it('treats touching edges as free', () => {
    expect(rangesOverlap(d('09:00'), d('10:00'), d('10:00'), d('11:00'))).toBe(false);
  });
  it('detects partial and full overlap', () => {
    expect(rangesOverlap(d('09:30'), d('10:30'), d('10:00'), d('11:00'))).toBe(true);
    expect(rangesOverlap(d('10:15'), d('10:45'), d('10:00'), d('11:00'))).toBe(true);
  });
});

describe('buildSlotRanges', () => {
  it('requires a date, start and end', () => {
    expect(buildSlotRanges(input('', ''), existing, now)).toEqual({
      ok: false,
      errors: { startTime: 'Choose a start time.', endTime: 'Choose an end time.' },
    });
  });

  it('rejects a range shorter than one session or not in whole sessions', () => {
    const short = buildSlotRanges(input('12:00', '12:30'), existing, now);
    const uneven = buildSlotRanges(input('12:00', '13:30'), existing, now);
    expect(!short.ok && short.errors.endTime).toMatch(/at least/);
    expect(!uneven.ok && uneven.errors.endTime).toMatch(/whole sessions/);
  });

  it('rejects a start that has passed', () => {
    const result = buildSlotRanges(input('08:00', '09:00', 1, '2026-11-01'), existing, now);
    expect(!result.ok && result.errors.startTime).toMatch(/already passed/);
  });

  it('splits a range into one hour slots and skips the existing one', () => {
    const result = buildSlotRanges(input('09:00', '12:00'), existing, now);
    expect(result).toEqual({
      ok: true,
      skipped: 1,
      ranges: [
        { startsAt: at('2026-11-10', '09:00'), endsAt: at('2026-11-10', '10:00') },
        { startsAt: at('2026-11-10', '11:00'), endsAt: at('2026-11-10', '12:00') },
      ],
    });
  });

  it('repeats the range weekly', () => {
    const result = buildSlotRanges(input('14:00', '15:00', 3), existing, now);
    expect(result.ok && result.ranges.map((r) => r.startsAt)).toEqual([
      at('2026-11-10', '14:00'),
      at('2026-11-17', '14:00'),
      at('2026-11-24', '14:00'),
    ]);
  });

  it('refuses a save that would create too many slots', () => {
    const result = buildSlotRanges(input('00:00', '23:00', 8), existing, now);
    expect(!result.ok && result.errors.endTime).toMatch(/at most/);
  });

  it('explains when every time overlaps', () => {
    const result = buildSlotRanges(input('10:00', '11:00'), existing, now);
    expect(!result.ok && result.errors.startTime).toMatch(/overlap/);
  });
});
