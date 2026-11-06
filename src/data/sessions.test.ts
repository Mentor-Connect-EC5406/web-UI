import { afterEach, describe, expect, it, vi } from 'vitest';
import { sessionsApi, type BookingResponse } from './sessions';

const booking = (patch: Partial<BookingResponse>): BookingResponse => ({
  id: 'b1', studentId: 's1', studentName: 'Kasun Fernando', mentorId: 'm1', mentorName: 'Nimal Silva', meetingUrl: null,
  reviewed: false, scheduledStart: '2026-12-01T04:30:00.000Z', scheduledEnd: '2026-12-01T05:30:00.000Z', topic: null,
  priceCents: 250000, status: 'PENDING', ...patch,
});

function respondWith(body: unknown) {
  const fetchMock = vi.fn().mockImplementation(async () => new Response(JSON.stringify(body), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('sessionsApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('maps bookings to sessions and hides the ones that were replaced', async () => {
    respondWith({
      content: [booking({ id: 'old', status: 'RESCHEDULED' }), booking({ id: 'new', status: 'CONFIRMED' }), booking({ id: 'gone', status: 'NO_SHOW' })],
      page: 0, size: 100, totalElements: 3, totalPages: 1,
    });
    const sessions = await sessionsApi.forStudent();
    expect(sessions.map((s) => [s.id, s.status])).toEqual([['new', 'CONFIRMED'], ['gone', 'CANCELLED']]);
    expect(sessions[0]).toMatchObject({ price: 2500, topic: 'Mentoring session', startsAt: '2026-12-01T04:30:00.000Z', mentorId: 'm1' });
  });

  it('asks only for pending bookings as requests', async () => {
    const fetchMock = respondWith({ content: [], page: 0, size: 100, totalElements: 0, totalPages: 0 });
    await sessionsApi.requests();
    expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get('status')).toBe('PENDING');
  });

  it('accepts or declines through separate endpoints', async () => {
    const fetchMock = respondWith(booking({}));
    await sessionsApi.respondToRequest({ requestId: 'b1', accept: false });
    expect(fetchMock.mock.calls[0][0]).toContain('/api/bookings/b1/decline');
  });

  it('sends the review text as the comment', async () => {
    const fetchMock = respondWith({});
    await sessionsApi.review({ sessionId: 'b1', rating: 5, text: '  Great advice for my internship plans.  ' });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ rating: 5, comment: 'Great advice for my internship plans.' });
  });
});

describe('sessionsApi changes', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('books with the topic and leaves an empty topic out', async () => {
    const fetchMock = respondWith(booking({}));
    await sessionsApi.book({ slotId: 'slot-1', topic: '  CV review  ' });
    await sessionsApi.book({ slotId: 'slot-1', topic: ' ' });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ slotId: 'slot-1', topic: 'CV review' });
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ slotId: 'slot-1' });
  });

  it('sends a cancel reason only when one is given', async () => {
    const fetchMock = respondWith(booking({}));
    await sessionsApi.cancel({ sessionId: 'b1', reason: 'Exam that day' });
    await sessionsApi.cancel({ sessionId: 'b1' });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ reason: 'Exam that day' });
    expect(fetchMock.mock.calls[1][1].body).toBeUndefined();
  });
});
