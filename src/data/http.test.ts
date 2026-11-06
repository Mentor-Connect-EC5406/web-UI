import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, api, describeFieldError, setAccessTokenProvider, setSessionExpiredHandler } from './http';

function respondWith(status: number, body?: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(body === undefined ? null : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setAccessTokenProvider(async () => null);
  });

  it('sends the bearer token, json body and query without empty values', async () => {
    const fetchMock = respondWith(200, { ok: true });
    setAccessTokenProvider(async () => 'token-123');
    await api('/api/mentors', { method: 'POST', body: { a: 1 }, query: { q: 'react', industries: ['A', 'B'], maxRateCents: '' } });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/mentors?q=react&industries=A&industries=B');
    expect(url).not.toContain('maxRateCents');
    expect(init.headers.Authorization).toBe('Bearer token-123');
    expect(init.body).toBe('{"a":1}');
  });

  it('returns nothing for 204', async () => {
    respondWith(204);
    expect(await api('/api/goals/1', { method: 'DELETE' })).toBeUndefined();
  });

  it('turns the backend error shape into a readable error', async () => {
    respondWith(409, { status: 409, error: 'CONFLICT', message: 'Slot is already booked', path: '/api/bookings' });
    await expect(api('/api/bookings', { method: 'POST', body: {} })).rejects.toMatchObject({ status: 409, message: 'Slot is already booked' });
  });

  it('shows the first field message for validation errors', async () => {
    respondWith(400, { message: 'Validation failed', fieldErrors: [{ field: 'firstName', message: 'must not be blank' }] });
    const error = (await api('/api/users/register').catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('First name must not be blank');
    expect(error.fieldErrors[0].field).toBe('firstName');
  });

  it('names the nested field in a validation error', () => {
    expect(describeFieldError({ field: 'experience.0.startMonth', message: 'must be YYYY-MM' })).toBe('Start month must be YYYY-MM');
  });

  it('explains when the server cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(api('/api/health')).rejects.toMatchObject({ status: 0, message: expect.stringMatching(/could not be reached/) });
  });
});

describe('expired access tokens', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setAccessTokenProvider(async () => null);
    setSessionExpiredHandler(() => {});
  });

  const reply = (status: number, body: unknown = {}) => new Response(JSON.stringify(body), { status });

  it('refreshes the token and retries once after a 401', async () => {
    const provider = vi.fn(async ({ refresh }: { refresh?: boolean } = {}) => (refresh ? 'fresh' : 'stale'));
    setAccessTokenProvider(provider);
    const fetchMock = vi.fn().mockResolvedValueOnce(reply(401, { message: 'Token expired' })).mockResolvedValueOnce(reply(200, { ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(api('/api/users/me')).resolves.toEqual({ ok: true });
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe('Bearer fresh');
  });

  it('reports an expired session when the retry is refused too', async () => {
    const expired = vi.fn();
    setAccessTokenProvider(async () => 'token');
    setSessionExpiredHandler(expired);
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => reply(401, { message: 'Missing bearer token' })));

    await expect(api('/api/mentors/me')).rejects.toMatchObject({ status: 401 });
    expect(expired).toHaveBeenCalledOnce();
  });
});
