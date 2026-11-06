import { afterEach, describe, expect, it, vi } from 'vitest';
import { messagesApi } from './messages';

// answers each request in order
function respondInOrder(...bodies: unknown[]) {
  const fetchMock = vi.fn();
  for (const body of bodies) fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const page = (content: unknown[]) => ({ content, page: 0, size: 100, totalElements: content.length, totalPages: 1 });

describe('messagesApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('lists conversations by latest activity and skips ones without another person', async () => {
    respondInOrder([
      { id: 'c1', with: { id: 'u2', name: 'Nimal', role: 'MENTOR', profileImageKey: null }, lastMessage: { content: 'Hi', sentAt: '2026-11-01T10:00:00Z' }, unreadCount: 1 },
      { id: 'c2', with: { id: 'u3', name: 'Ama', role: 'MENTOR', profileImageKey: null }, lastMessage: { content: 'Later', sentAt: '2026-11-02T10:00:00Z' }, unreadCount: 0 },
      { id: 'c3', with: null, lastMessage: null, unreadCount: 0 },
    ]);
    const list = await messagesApi.conversations();
    expect(list.map((c) => c.id)).toEqual(['c2', 'c1']);
    expect(list[1].lastMessage?.text).toBe('Hi');
  });

  it('shows the thread oldest first', async () => {
    respondInOrder(page([
      { id: 'm2', senderId: 'u1', content: 'Second', sentAt: '2026-11-01T10:05:00Z' },
      { id: 'm1', senderId: 'u2', content: 'First', sentAt: '2026-11-01T10:00:00Z' },
    ]));
    expect((await messagesApi.messages('c1')).map((m) => m.text)).toEqual(['First', 'Second']);
  });

  it('starts a chat with a mentor using their account id', async () => {
    const fetchMock = respondInOrder(
      {
        id: 'm1', userId: 'u9', firstName: 'Nimal', lastName: 'Silva', profileImageKey: null, title: null, organization: null,
        industry: null, bio: null, headline: '', location: '', skills: [], experienceYears: 1, hourlyRateCents: 0, currency: 'LKR',
        ratingAvg: 0, ratingCount: 0, verificationStatus: 'APPROVED', links: { linkedin: '', github: '', website: '' },
        experience: [], education: [], certificates: [], projects: [], languages: [],
      },
      { id: 'c7' },
    );
    expect(await messagesApi.start({ userId: 'u1', otherId: 'm1', mentorId: 'm1' })).toBe('c7');
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ participantId: 'u9' });
  });

  it('lets mentors message only the students who booked them', async () => {
    const booking = { studentId: 's1', studentName: 'Kasun Fernando', mentorId: 'm1', mentorName: 'Nimal', meetingUrl: null, reviewed: false,
      scheduledStart: '2026-12-01T04:30:00Z', scheduledEnd: '2026-12-01T05:30:00Z', topic: null, priceCents: 0, status: 'CONFIRMED' };
    respondInOrder(page([{ ...booking, id: 'b1' }, { ...booking, id: 'b2' }]));
    const contacts = await messagesApi.contacts('MENTOR', 'kas');
    expect(contacts).toEqual([expect.objectContaining({ id: 's1', name: 'Kasun Fernando', role: 'STUDENT' })]);
  });
});
