import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mentorsApi } from './mentors';
import { sessionsApi } from './sessions';

// runs a mock API call, skipping its simulated network delay
async function run<T>(call: Promise<T>): Promise<T> {
  await vi.runAllTimersAsync();
  return call;
}

// attaches the rejection check before the delay runs so the failure is never unhandled
async function runRejects(call: Promise<unknown>, message?: RegExp) {
  const check = expect(call).rejects.toThrow(message);
  await vi.runAllTimersAsync();
  await check;
}

describe('sessionsApi (mock)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-28T09:00:00+05:30'));
  });
  afterEach(() => vi.useRealTimers());

  it('moves a session to another free slot and swaps the slot statuses', async () => {
    await run(sessionsApi.reschedule({ sessionId: 'b1', slotId: 's4' }));
    const session = (await run(sessionsApi.forStudent())).find((s) => s.id === 'b1');
    const slots = await run(mentorsApi.slots('mentor-1'));
    expect(session?.startsAt).toBe('2026-11-04T16:00:00+05:30');
    expect(slots.find((s) => s.id === 's4')?.status).toBe('BOOKED');
    expect(slots.find((s) => s.id === 's1')?.status).toBe('AVAILABLE');
  });

  it('refuses to move a session inside the change window', async () => {
    vi.setSystemTime(new Date('2026-11-06T06:00:00+05:30'));
    await runRejects(sessionsApi.reschedule({ sessionId: 'b2', slotId: 's3' }), /cannot be moved/);
  });

  it('marks the session reviewed and adds the review to the mentor', async () => {
    const before = await run(mentorsApi.get('mentor-2'));
    await run(sessionsApi.review({ sessionId: 'b3', rating: 5, text: 'Clear, practical advice on moving into product.' }));
    const session = (await run(sessionsApi.forStudent())).find((s) => s.id === 'b3');
    const reviews = await run(mentorsApi.reviews('mentor-2'));
    const after = await run(mentorsApi.get('mentor-2'));
    expect(session?.reviewed).toBe(true);
    expect(reviews[0]).toMatchObject({ author: 'Ashan P.', rating: 5 });
    expect(after?.reviewCount).toBe((before?.reviewCount ?? 0) + 1);
    await runRejects(sessionsApi.review({ sessionId: 'b3', rating: 4, text: 'Trying to review the same session twice.' }));
  });
});
