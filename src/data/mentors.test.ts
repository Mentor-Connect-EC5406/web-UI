import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_FILTERS } from '@/lib/mentorFilters';
import { mentorsApi } from './mentors';

/** Runs a mock API call, skipping its simulated network delay */
async function run<T>(call: Promise<T>): Promise<T> {
  await vi.runAllTimersAsync();
  return call;
}

describe('mentorsApi.search (mock)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns every mentor, top rated first, with no filters', async () => {
    const list = await run(mentorsApi.search(EMPTY_FILTERS));
    expect(list.length).toBe(6);
    expect(list[0].rating).toBeGreaterThanOrEqual(list[1].rating);
  });

  it('matches the search text against name, company and skills', async () => {
    const list = await run(mentorsApi.search({ ...EMPTY_FILTERS, query: 'figma' }));
    expect(list.map((m) => m.name)).toEqual(['Chamari Wickramasinghe']);
  });

  it('combines industry and price filters', async () => {
    const fields = ['Software Engineering', 'Product Management'];
    const list = await run(mentorsApi.search({ ...EMPTY_FILTERS, industries: fields, maxRate: '2800' }));
    expect(list.map((m) => m.name)).toEqual(['Nimal Silva']);
  });

  it('sorts by lowest price', async () => {
    const list = await run(mentorsApi.search({ ...EMPTY_FILTERS, sort: 'price' }));
    const prices = list.map((m) => m.hourlyRate);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('returns null for an unknown mentor id', async () => {
    expect(await run(mentorsApi.get('nope'))).toBeNull();
  });
});
