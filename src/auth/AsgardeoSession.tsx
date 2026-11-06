import { useEffect, useRef, type ReactNode } from 'react';
import { AuthProvider, useAuthContext } from '@asgardeo/auth-react';
import { ASGARDEO } from '@/config/env';
import { accountApi } from '@/data/account';
import { isApiError, setAccessTokenProvider } from '@/data/http';
import { queryClient } from '@/data/queryClient';
import { router } from '@/app/router';
import { homePathFor, paths } from '@/app/paths';
import type { NewAccount } from '@/types';
import { accessTokenProblem } from '@/lib/accessToken';
import { readSignupRole, rememberSignupRole, useSession } from './session';

// set before leaving for asgardeo so we know to route the person once they come back
const RETURNING_KEY = 'mc_returning_from_sign_in';

const config = {
  baseUrl: ASGARDEO.baseUrl,
  clientID: ASGARDEO.clientId,
  // must match the redirect urls registered in asgardeo exactly
  signInRedirectURL: window.location.origin,
  signOutRedirectURL: window.location.origin,
  scope: ['openid', 'profile', 'email'],
};

function markReturning(value: boolean) {
  try {
    if (value) sessionStorage.setItem(RETURNING_KEY, '1');
    else sessionStorage.removeItem(RETURNING_KEY);
  } catch {
    // without storage the person lands on the home page and can open their dashboard from there
  }
}

function isReturning() {
  try {
    return sessionStorage.getItem(RETURNING_KEY) === '1';
  } catch {
    return false;
  }
}

// after the asgardeo redirect the app opens at the root, so send the person where they belong
function routeAfterSignIn() {
  if (!isReturning()) return;
  markReturning(false);
  const { user, newAccount, error } = useSession.getState();
  // an existing account keeps its role, so a remembered sign up choice no longer applies
  if (user) rememberSignupRole(null);
  if (user) void router.navigate(homePathFor(user.role), { replace: true });
  else if (newAccount) void router.navigate(readSignupRole() === 'MENTOR' ? `${paths.onboarding}?role=mentor` : paths.onboarding, { replace: true });
  else if (error) void router.navigate(paths.login, { replace: true });
}

function claimText(claims: Record<string, unknown> | null, key: string) {
  const value = claims?.[key];
  return typeof value === 'string' ? value.trim() : '';
}

type AuthContext = ReturnType<typeof useAuthContext>;

// a 401 after a successful asgardeo login means the api rejected the token itself
async function rejectedTokenMessage(auth: AuthContext) {
  const token = await auth.getAccessToken().catch(() => null);
  return (
    accessTokenProblem(token, ASGARDEO.clientId) ??
    'The MentorConnect server could not verify your sign in. Try again, or sign out and sign in with your account again.'
  );
}

// finds the signed in person in our api, a 404 means they still have to finish onboarding
async function loadAccount(auth: AuthContext, isCancelled: () => boolean) {
  useSession.setState({ status: 'loading' });
  try {
    const user = await accountApi.me();
    if (isCancelled()) return;
    useSession.setState({ user, newAccount: null, status: 'ready', error: null });
  } catch (error) {
    if (isCancelled()) return;
    if (isApiError(error, 404)) {
      const claims = (await auth.getDecodedIDToken().catch(() => null)) as Record<string, unknown> | null;
      const firstName = claimText(claims, 'given_name');
      const lastName = claimText(claims, 'family_name');
      const email = claimText(claims, 'email') || auth.state.email || '';
      const newAccount: NewAccount = {
        firstName,
        lastName,
        email,
        name: `${firstName} ${lastName}`.trim() || auth.state.displayName || email,
      };
      if (!isCancelled()) useSession.setState({ user: null, newAccount, status: 'ready', error: null });
    } else {
      const message = isApiError(error, 401)
        ? await rejectedTokenMessage(auth)
        : isApiError(error, 403)
          ? 'Your account is not active. Contact the MentorConnect team for help.'
          : error instanceof Error
            ? error.message
            : 'We could not load your account. Please try again.';
      useSession.setState({ user: null, newAccount: null, status: 'ready', error: message });
    }
  }
  if (!isCancelled()) routeAfterSignIn();
}

function SessionBridge() {
  const auth = useAuthContext();
  // the sdk functions are not guaranteed to be stable, effects read the latest ones from here
  const authRef = useRef(auth);
  useEffect(() => {
    authRef.current = auth;
  });

  useEffect(() => {
    setAccessTokenProvider(async () => {
      try {
        return await authRef.current.getAccessToken();
      } catch {
        return null;
      }
    });

    useSession.setState({
      signIn: () => {
        markReturning(true);
        // the sdk ignores signIn while its session is live, so reload the account instead of doing nothing
        if (authRef.current.state.isAuthenticated) void loadAccount(authRef.current, () => false);
        else void authRef.current.signIn();
      },
      signUp: (role) => {
        rememberSignupRole(role ?? null);
        markReturning(true);
        // the asgardeo page offers create account next to sign in
        if (authRef.current.state.isAuthenticated) void loadAccount(authRef.current, () => false);
        else void authRef.current.signIn();
      },
      signOut: () => {
        queryClient.clear();
        rememberSignupRole(null);
        useSession.setState({ user: null, newAccount: null, error: null });
        void authRef.current.signOut();
      },
      completeOnboarding: async (details) => {
        let user;
        try {
          user = await accountApi.register(details);
        } catch (error) {
          if (!isApiError(error, 409)) throw error;
          // a retry after the profile save failed finds this login already registered,
          // a 404 here means the email belongs to another asgardeo login
          user = await accountApi.me().catch((meError: unknown) => {
            if (!isApiError(meError, 404)) throw meError;
            throw new Error(
              'This email is already linked to another MentorConnect login. Sign in with that account, or ask the MentorConnect team to remove the old one.',
            );
          });
        }
        await accountApi.saveOnboardingDetails(details);
        rememberSignupRole(null);
        useSession.setState({ user, newAccount: null, error: null });
      },
    });
  }, []);

  const { isAuthenticated, isLoading } = auth.state;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      useSession.setState({ user: null, newAccount: null, status: 'ready' });
      return;
    }

    let cancelled = false;
    void loadAccount(authRef.current, () => cancelled);

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading]);

  return null;
}

// real sign in with asgardeo, wraps the whole app when mocks are off
export function AsgardeoSession({ children }: { children: ReactNode }) {
  return (
    <AuthProvider config={config}>
      <SessionBridge />
      {children}
    </AuthProvider>
  );
}
