import { beforeEach, describe, expect, it } from 'vitest';
import { readSignupRole, rememberReturnPath, rememberSignupRole, takeReturnPath, useSession } from './session';

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

describe('return path', () => {
  it('is read once after the sign in redirect', () => {
    rememberReturnPath('/student/mentors/m1?slot=s1');
    expect(takeReturnPath()).toBe('/student/mentors/m1?slot=s1');
    expect(takeReturnPath()).toBeNull();
  });
});
