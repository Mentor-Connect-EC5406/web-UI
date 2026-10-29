import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { messagesApi } from './messages';

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

describe('messagesApi (mock)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('lists only the user’s conversations with unread counts, newest first', async () => {
    const inbox = await run(messagesApi.conversations('student-1'));
    expect(inbox.map((c) => c.with.name)).toEqual(['Nimal Silva', 'Roshan Fernando', 'Priya Jayawardena']);
    expect(inbox.map((c) => c.unreadCount)).toEqual([1, 2, 0]);
  });

  it('clears the unread count when the conversation is read', async () => {
    await run(messagesApi.markRead({ conversationId: 'c3', userId: 'student-1' }));
    const inbox = await run(messagesApi.conversations('student-1'));
    expect(inbox.find((c) => c.id === 'c3')?.unreadCount).toBe(0);
  });

  it('adds a sent message to the thread and refuses an empty one', async () => {
    await run(messagesApi.send({ conversationId: 'c2', senderId: 'student-1', text: '  See you soon  ' }));
    const thread = await run(messagesApi.messages('c2'));
    expect(thread.at(-1)).toMatchObject({ senderId: 'student-1', text: 'See you soon' });
    await runRejects(messagesApi.send({ conversationId: 'c2', senderId: 'student-1', text: '   ' }));
  });

  it('reuses an existing conversation and creates a new one when needed', async () => {
    expect(await run(messagesApi.start({ userId: 'mentor-1', otherId: 'student-2' }))).toBe('c4');
    const id = await run(messagesApi.start({ userId: 'mentor-1', otherId: 'student-4' }));
    const inbox = await run(messagesApi.conversations('mentor-1'));
    expect(inbox.find((c) => c.id === id)).toMatchObject({ with: { name: 'Tharushi Senanayake' }, lastMessage: null, unreadCount: 0 });
  });
});
