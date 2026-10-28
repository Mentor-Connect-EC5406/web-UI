import { describe, expect, it } from 'vitest';
import { GOAL_TITLE_MAX_LENGTH } from '@/config/constants';
import { validateGoal } from './goals';

const today = new Date('2026-11-01T09:00');
const valid = { title: 'Get an internship', targetDate: '2027-01-31', progress: 20 };

describe('validateGoal', () => {
  it('accepts a complete goal and one without a target date', () => {
    expect(validateGoal(valid, null, today)).toEqual({});
    expect(validateGoal({ ...valid, targetDate: null }, null, today)).toEqual({});
  });

  it('requires a title within the limit', () => {
    expect(validateGoal({ ...valid, title: '   ' }, null, today).title).toBeDefined();
    expect(validateGoal({ ...valid, title: 'x'.repeat(GOAL_TITLE_MAX_LENGTH + 1) }, null, today).title).toBeDefined();
  });

  it('rejects a new past target date but keeps an already saved one editable', () => {
    expect(validateGoal({ ...valid, targetDate: '2026-10-01' }, null, today).targetDate).toBeDefined();
    expect(validateGoal({ ...valid, targetDate: '2026-10-01' }, '2026-10-01', today)).toEqual({});
  });

  it('keeps progress a whole number from 0 to 100', () => {
    expect(validateGoal({ ...valid, progress: 101 }, null, today).progress).toBeDefined();
    expect(validateGoal({ ...valid, progress: 12.5 }, null, today).progress).toBeDefined();
    expect(validateGoal({ ...valid, progress: Number.NaN }, null, today).progress).toBeDefined();
  });
});
