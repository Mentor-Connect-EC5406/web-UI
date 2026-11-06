import { create } from 'zustand';
import type { NewAccount, OnboardingDetails, OnboardingRole, User } from '@/types';

// one store for the signed in person, AsgardeoSession fills in the actions once the sdk is ready

const SIGNUP_ROLE_KEY = 'mc_signup_role';

// storage can be unavailable in private browsing, the role is then forgotten after the redirect
export function rememberSignupRole(role: OnboardingRole | null) {
  try {
    if (role) sessionStorage.setItem(SIGNUP_ROLE_KEY, role);
    else sessionStorage.removeItem(SIGNUP_ROLE_KEY);
  } catch {
    // onboarding then asks for the role instead
  }
}

export function readSignupRole(): OnboardingRole | null {
  try {
    const value = sessionStorage.getItem(SIGNUP_ROLE_KEY);
    return value === 'STUDENT' || value === 'MENTOR' ? value : null;
  } catch {
    return null;
  }
}

export interface SessionState {
  user: User | null;
  // signed in with asgardeo but not registered with us yet
  newAccount: NewAccount | null;
  // loading while sign in checks who the person is
  status: 'loading' | 'ready';
  // shown on the login page when the account could not be loaded
  error: string | null;
  signIn: () => void;
  signUp: (role?: OnboardingRole) => void;
  // registers the account with the chosen role and saves the first profile details
  completeOnboarding: (details: OnboardingDetails) => Promise<void>;
  signOut: () => void;
}

const notReady = () => {
  throw new Error('Sign in is still starting. Try again in a moment.');
};

export const useSession = create<SessionState>(() => ({
  user: null,
  newAccount: null,
  status: 'loading',
  error: null,
  signIn: notReady,
  signUp: notReady,
  completeOnboarding: async () => notReady(),
  signOut: notReady,
}));
