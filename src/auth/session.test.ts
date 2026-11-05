import { beforeEach, describe, expect, it } from 'vitest';
import type { OnboardingDetails } from '@/types';
import { useSession } from './session';

const mentor: OnboardingDetails = {
  role: 'MENTOR', firstName: 'Kasun', lastName: 'Fernando', title: 'Engineer', organization: 'WSO2',
  industry: 'Software Engineering', experienceYears: 5, bio: 'I help students.',
};
const student: OnboardingDetails = {
  role: 'STUDENT', firstName: 'Kasun', lastName: 'Fernando', university: 'SLIIT', faculty: 'Computing', academicYear: 2,
};

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

  it('completing onboarding signs the person in with the chosen role', async () => {
    useSession.getState().signUp();
    await useSession.getState().completeOnboarding(mentor);
    const { user, newAccount } = useSession.getState();
    expect(user?.role).toBe('MENTOR');
    expect(user?.name).toBe('Kasun Fernando');
    expect(newAccount).toBeNull();
  });

  it('ignores onboarding when there is no pending account', async () => {
    await useSession.getState().completeOnboarding(student);
    expect(useSession.getState().user).toBeNull();
  });
});
