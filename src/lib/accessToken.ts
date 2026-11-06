// the api only accepts RS256 JWT access tokens issued for this client, see backend-new src/config/asgardeo.ts
// this explains a rejected token instead of leaving people in a sign in loop

function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
}

export function accessTokenProblem(token: string | null, clientId: string, now: Date = new Date()): string | null {
  if (!token) return 'Asgardeo did not return an access token. Sign out and sign in again.';
  if (token.split('.').length !== 3) {
    return 'Sign in is not set up correctly: Asgardeo is issuing opaque access tokens. In the Asgardeo console open Applications > MentorConnect > Protocol and set the access token type to JWT.';
  }
  const claims = decodePayload(token);
  if (!claims) return 'The access token from Asgardeo could not be read. Sign out and sign in again.';
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(clientId)) {
    return 'Sign in is not set up correctly: the access token was issued for a different Asgardeo application than the one the server expects.';
  }
  if (typeof claims.exp === 'number' && claims.exp * 1000 < now.getTime()) return 'Your session has expired. Sign out and sign in again.';
  return null;
}
