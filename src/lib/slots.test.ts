import { describe, expect, it } from 'vitest';
import type { Slot } from '@/types';
import { rangesOverlap, validateNewSlot } from './slots';

// local times so the test does not depend on the machine timezone
const at = (date: string, time: string) => new Date(`${date}T${time}`).toISOString();
const slot = (start: string, end: string): Slot => ({ id: start, startsAt: at('2026-11-10', start), endsAt: at('2026-11-10', end), status: 'AVAILABLE' });
const now = new Date('2026-11-01T09:00');
const existing = [slot('10:00', '11:00')];

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

describe('validateNewSlot', () => {
  it('requires both date and time', () => {
    const result = validateNewSlot('', '', existing, now);
    expect(result).toEqual({ ok: false, errors: { date: 'Choose a date.', time: 'Choose a start time.' } });
  });

  it('rejects a time that has passed', () => {
    const result = validateNewSlot('2026-11-01', '08:00', existing, now);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.time).toMatch(/already passed/);
  });

  it('rejects a slot that overlaps an existing one', () => {
    const result = validateNewSlot('2026-11-10', '10:30', existing, now);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.time).toMatch(/overlaps/);
  });

  it('accepts a back to back slot with the session length', () => {
    const result = validateNewSlot('2026-11-10', '11:00', existing, now);
    expect(result).toEqual({ ok: true, startsAt: at('2026-11-10', '11:00'), endsAt: at('2026-11-10', '12:00') });
  });
});
