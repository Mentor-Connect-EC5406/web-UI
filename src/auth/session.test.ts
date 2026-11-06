import { beforeEach, describe, expect, it } from 'vitest';
import { readSignupRole, rememberSignupRole, useSession } from './session';

describe('session store', () => {
  beforeEach(() => rememberSignupRole(null));

  it('starts loading and signed out until asgardeo answers', () => {
    const { user, newAccount, status } = useSession.getState();
    expect([user, newAccount, status]).toEqual([null, null, 'loading']);
  });

  it('remembers the mentor choice across the sign in redirect', () => {
    rememberSignupRole('MENTOR');
    expect(readSignupRole()).toBe('MENTOR');
    rememberSignupRole(null);
    expect(readSignupRole()).toBeNull();
  });

  it('ignores a stored value that is not a role', () => {
    sessionStorage.setItem('mc_signup_role', 'ADMIN');
    expect(readSignupRole()).toBeNull();
  });
});
