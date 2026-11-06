import { afterEach, describe, expect, it, vi } from 'vitest';
import { notificationsApi } from './notifications';

describe('notificationsApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('maps notifications newest first with their topic and read state', async () => {
    const body = {
      content: [
        { id: 'n1', type: 'BOOKING_CREATED', title: 'New request', message: 'Kasun asked for a session', status: 'SENT', createdAt: '2026-11-01T08:00:00Z', readAt: null },
        { id: 'n2', type: 'BOOKING_CONFIRMED', title: 'Booking confirmed', message: 'See you then', status: 'READ', createdAt: '2026-11-02T08:00:00Z', readAt: '2026-11-02T09:00:00Z' },
      ],
      page: 0, size: 20, totalElements: 2, totalPages: 1,
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status: 200 })));
    const list = await notificationsApi.recent();
    expect(list.map((n) => [n.id, n.topic, n.read])).toEqual([['n2', 'session', true], ['n1', 'session', false]]);
  });
});
