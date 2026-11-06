import { describe, expect, it } from 'vitest';
import { parseFeatures } from './features';

describe('parseFeatures', () => {
  it('is empty by default so unfinished screens stay hidden', () => {
    expect(parseFeatures(undefined).size).toBe(0);
    expect(parseFeatures('').size).toBe(0);
  });

  it('turns on known names and ignores typos', () => {
    expect([...parseFeatures(' mentorships , sessionTasks,unknown')]).toEqual(['mentorships', 'sessionTasks']);
  });
});
