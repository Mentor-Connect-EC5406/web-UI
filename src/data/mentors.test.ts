import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MentorFilterValues } from '@/types';
import { mentorsApi, type MentorSummaryResponse } from './mentors';

const summary: MentorSummaryResponse = {
  id: 'm1', firstName: 'Nimal', lastName: 'Silva', profileImageKey: null, title: 'Engineer', organization: 'WSO2',
  industry: 'Software Engineering', bio: null, headline: 'Helping students', location: 'Colombo', skills: ['React'],
  experienceYears: 8, hourlyRateCents: 250000, currency: 'LKR', ratingAvg: 4.67, ratingCount: 3,
};

function respondWith(status: number, body?: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(body === undefined ? null : JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const filters: MentorFilterValues = { query: ' react ', industries: ['Software Engineering'], minRating: '4', maxRate: '3000', sort: 'price' };

describe('mentorsApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends the filters with the price in cents and maps the page', async () => {
    const fetchMock = respondWith(200, { content: [summary], page: 0, size: 100, totalElements: 1, totalPages: 1 });
    const [mentor] = await mentorsApi.search(filters);
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe('/api/mentors');
    expect(url.searchParams.get('query')).toBe('react');
    expect(url.searchParams.getAll('industries')).toEqual(['Software Engineering']);
    expect(url.searchParams.get('maxRateCents')).toBe('300000');
    expect(url.searchParams.get('sort')).toBe('price');
    expect(mentor).toMatchObject({ id: 'm1', name: 'Nimal Silva', hourlyRate: 2500, rating: 4.7, reviewCount: 3, bio: '', isVerified: true });
    expect(mentor.experience).toEqual([]);
  });

  it('returns null for a mentor that does not exist', async () => {
    respondWith(404, { message: 'Mentor not found' });
    expect(await mentorsApi.get('missing')).toBeNull();
  });

  it('keeps other errors so the screen can offer a retry', async () => {
    respondWith(500, {});
    await expect(mentorsApi.get('m1')).rejects.toMatchObject({ status: 500 });
  });

  it('maps a full profile with its account id and verification', async () => {
    respondWith(200, {
      ...summary, userId: 'u1', verificationStatus: 'PENDING', links: { linkedin: '', github: '', website: '' },
      experience: [], education: [], certificates: [], projects: [], languages: [{ name: 'English', level: 'Fluent' }],
    });
    const mentor = await mentorsApi.get('m1');
    expect(mentor).toMatchObject({ userId: 'u1', isVerified: false, verificationStatus: 'PENDING', languages: [{ name: 'English', level: 'Fluent' }] });
  });

  it('adds a slot with the api field names', async () => {
    const fetchMock = respondWith(201, { id: 's1', startTime: 'a', endTime: 'b', status: 'AVAILABLE' });
    await mentorsApi.addSlot({ startsAt: '2026-12-01T04:30:00.000Z', endsAt: '2026-12-01T05:30:00.000Z' });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({ startTime: '2026-12-01T04:30:00.000Z', endTime: '2026-12-01T05:30:00.000Z' });
    expect(body.timezone).toBeTruthy();
  });
});
