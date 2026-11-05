import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/common/LoadingState';
import { useSession } from '@/auth/session';
import { homePathFor, paths } from './paths';

// already signed in users go to their dashboard or back to where they were
export function RedirectIfSignedIn() {
  const user = useSession((s) => s.user);
  const newAccount = useSession((s) => s.newAccount);
  const status = useSession((s) => s.status);
  const from = (useLocation().state as { from?: string } | null)?.from;

  if (status === 'loading') return <LoadingState message="Checking your account…" />;
  // signed in with asgardeo but not registered yet, finish the account first
  if (newAccount) return <Navigate to={paths.onboarding} replace />;
  if (!user) return <Outlet />;
  const home = homePathFor(user.role);
  return <Navigate to={from?.startsWith(home) ? from : home} replace />;
}
