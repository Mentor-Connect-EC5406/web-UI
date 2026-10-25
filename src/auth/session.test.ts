import { beforeEach, describe, expect, it } from 'vitest';
import { useSession } from './session';

describe('session sign-up flow', () => {
  beforeEach(() => useSession.getState().signOut());

  it('starts signed out', () => {
    expect(useSession.getState().user).toBeNull();
    expect(useSession.getState().newAccount).toBeNull();
  });

  it('sign-up creates a pending account without a role', () => {
    useSession.getState().signUp();
    const { user, newAccount } = useSession.getState();
    expect(user).toBeNull();
    expect(newAccount?.email).toBeTruthy();
  });

  it('completing onboarding signs the person in with the chosen role', () => {
    useSession.getState().signUp();
    useSession.getState().completeOnboarding('MENTOR');
    const { user, newAccount } = useSession.getState();
    expect(user?.role).toBe('MENTOR');
    expect(newAccount).toBeNull();
  });

  it('ignores onboarding when there is no pending account', () => {
    useSession.getState().completeOnboarding('STUDENT');
    expect(useSession.getState().user).toBeNull();
  });
});
