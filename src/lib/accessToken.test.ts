import { describe, expect, it } from 'vitest';
import { accessTokenProblem } from './accessToken';

const now = new Date('2026-11-06T10:00:00Z');
const base64url = (value: object) => btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const jwt = (claims: object) => `${base64url({ alg: 'RS256', kid: 'k1' })}.${base64url(claims)}.signature`;
const exp = now.getTime() / 1000 + 3600;

describe('accessTokenProblem', () => {
  it('explains an opaque token, the usual Asgardeo misconfiguration', () => {
    expect(accessTokenProblem('8f2c1d3e-opaque-token', 'client-1', now)).toMatch(/access token type to JWT/);
  });

  it('explains a token issued for another application', () => {
    expect(accessTokenProblem(jwt({ aud: 'other-app', exp }), 'client-1', now)).toMatch(/different Asgardeo application/);
  });

  it('explains an expired token', () => {
    expect(accessTokenProblem(jwt({ aud: ['client-1'], exp: exp - 7200 }), 'client-1', now)).toMatch(/expired/);
  });

  it('finds nothing wrong with a valid looking token', () => {
    expect(accessTokenProblem(jwt({ aud: 'client-1', exp }), 'client-1', now)).toBeNull();
    expect(accessTokenProblem(null, 'client-1', now)).toMatch(/did not return/);
  });
});
