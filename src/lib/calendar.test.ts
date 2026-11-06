import { describe, expect, it } from 'vitest';
import { dayKey, formatWeekRange, groupByDay, weekDays } from './calendar';

describe('calendar helpers', () => {
  it('builds a Monday to Sunday week around any day', () => {
    const days = weekDays(new Date('2026-11-12T15:00'));
    expect(days.map(dayKey)).toEqual(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15']);
    expect(formatWeekRange(days)).toBe('9 – 15 Nov 2026');
  });

  it('names both months when a week crosses them', () => {
    expect(formatWeekRange(weekDays(new Date('2026-11-30T10:00')))).toBe('30 Nov – 6 Dec 2026');
  });

  it('groups items by local day in time order', () => {
    const at = (d: string, t: string) => new Date(`${d}T${t}`).toISOString();
    const items = [{ at: at('2026-11-10', '14:00') }, { at: at('2026-11-11', '09:00') }, { at: at('2026-11-10', '09:00') }];
    const days = groupByDay(items, (i) => i.at);
    expect([...days.keys()]).toEqual(['2026-11-10', '2026-11-11']);
    expect(days.get('2026-11-10')?.map((i) => i.at)).toEqual([at('2026-11-10', '09:00'), at('2026-11-10', '14:00')]);
  });
});
