import { create } from 'zustand';
import type { NewAccount, OnboardingDetails, OnboardingRole, Role, User } from '@/types';
import { DEMO_NEW_ACCOUNT, DEMO_USERS } from '@/mocks/users';
import { USE_MOCKS } from '@/config/env';

// one store for both modes, the actions below are the demo ones and AsgardeoSession replaces them with real sign in

const USER_KEY = 'mc_demo_user';
const NEW_ACCOUNT_KEY = 'mc_demo_new_account';
const SIGNUP_ROLE_KEY = 'mc_signup_role';

function read<T>(key: string, storage: () => Storage = () => localStorage): T | null {
  try {
    const raw = storage().getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// storage can be unavailable in private browsing or tests, the value then lives until reload
function write(key: string, value: unknown, storage: () => Storage = () => localStorage) {
  try {
    if (value) storage().setItem(key, JSON.stringify(value));
    else storage().removeItem(key);
  } catch {
    // keeping the value in memory is enough
  }
}

// remembers that someone started from "become a mentor" across the asgardeo redirect
export const rememberSignupRole = (role: OnboardingRole | null) => write(SIGNUP_ROLE_KEY, role, () => sessionStorage);
export const readSignupRole = () => read<OnboardingRole>(SIGNUP_ROLE_KEY, () => sessionStorage);

export interface SessionState {
  user: User | null;
  // signed in with asgardeo but not registered with us yet
  newAccount: NewAccount | null;
  // loading while real sign in checks who the person is, demo mode is always ready
  status: 'loading' | 'ready';
  // shown on the login page when the account could not be loaded
  error: string | null;
  signIn: () => void;
  signUp: (role?: OnboardingRole) => void;
  // registers the account with the chosen role and saves the first profile details
  completeOnboarding: (details: OnboardingDetails) => Promise<void>;
  // demo only
  signInAs: (role: Role) => void;
  signOut: () => void;
}

export const useSession = create<SessionState>((set, get) => {
  const setUser = (user: User) => {
    write(USER_KEY, user);
    write(NEW_ACCOUNT_KEY, null);
    set({ user, newAccount: null, error: null });
  };

  return {
    user: USE_MOCKS ? read<User>(USER_KEY) : null,
    newAccount: USE_MOCKS ? read<NewAccount>(NEW_ACCOUNT_KEY) : null,
    status: USE_MOCKS ? 'ready' : 'loading',
    error: null,
    signIn: () => setUser(DEMO_USERS.STUDENT),
    signUp: () => {
      write(NEW_ACCOUNT_KEY, DEMO_NEW_ACCOUNT);
      set({ newAccount: DEMO_NEW_ACCOUNT });
    },
    completeOnboarding: async (details) => {
      const { newAccount } = get();
      if (!newAccount) return;
      const name = `${details.firstName} ${details.lastName}`.trim() || newAccount.name;
      setUser({ id: `${details.role.toLowerCase()}-new`, name, email: newAccount.email, avatarUrl: null, role: details.role });
    },
    signInAs: (role) => setUser(DEMO_USERS[role]),
    signOut: () => {
      write(USER_KEY, null);
      write(NEW_ACCOUNT_KEY, null);
      set({ user: null, newAccount: null, error: null });
    },
  };
});
