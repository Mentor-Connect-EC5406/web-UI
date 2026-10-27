import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/auth/session';
import { homePathFor } from './paths';

// already signed in users go to their dashboard or back to where they were
export function RedirectIfSignedIn() {
  const user = useSession((s) => s.user);
  const from = (useLocation().state as { from?: string } | null)?.from;

  if (!user) return <Outlet />;
  const home = homePathFor(user.role);
  return <Navigate to={from?.startsWith(home) ? from : home} replace />;
}
