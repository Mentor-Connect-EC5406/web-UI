import { create } from 'zustand';
import type { NewAccount, OnboardingRole, Role, User } from '@/types';
import { DEMO_NEW_ACCOUNT, DEMO_USERS } from '@/mocks/users';

// this is a demo authertication 

const USER_KEY = 'mc_demo_user';
const NEW_ACCOUNT_KEY = 'mc_demo_new_account';

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Storage can be unavailable (private browsing, tests); the session then lasts until reload */
function write(key: string, value: unknown) {
  try {
    if (value) localStorage.setItem(key, JSON.stringify(value));
    else localStorage.removeItem(key);
  } catch {
    // Ignore — keeping the value in memory is enough
  }
}

interface SessionState {
  user: User | null;
  newAccount: NewAccount | null;
  /** Demo: signs in the demo student. Real: redirects to the identity provider. */
  signIn: () => void;
  /** Demo: creates a pending account. Real: redirects to the provider's sign-up. */
  signUp: () => void;
  /** Turns the pending account into a signed-in user with the chosen role */
  completeOnboarding: (role: OnboardingRole) => void;
  /** Demo only: sign in as a specific demo role */
  signInAs: (role: Role) => void;
  signOut: () => void;
}

export const useSession = create<SessionState>((set, get) => {
  const setUser = (user: User) => {
    write(USER_KEY, user);
    write(NEW_ACCOUNT_KEY, null);
    set({ user, newAccount: null });
  };

  return {
    user: read<User>(USER_KEY),
    newAccount: read<NewAccount>(NEW_ACCOUNT_KEY),
    signIn: () => setUser(DEMO_USERS.STUDENT),
    signUp: () => {
      write(NEW_ACCOUNT_KEY, DEMO_NEW_ACCOUNT);
      set({ newAccount: DEMO_NEW_ACCOUNT });
    },
    completeOnboarding: (role) => {
      const { newAccount } = get();
      if (!newAccount) return;
      setUser({ id: `${role.toLowerCase()}-new`, name: newAccount.name, email: newAccount.email, avatarUrl: null, role });
    },
    signInAs: (role) => setUser(DEMO_USERS[role]),
    signOut: () => {
      write(USER_KEY, null);
      write(NEW_ACCOUNT_KEY, null);
      set({ user: null, newAccount: null });
    },
  };
});
