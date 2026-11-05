import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '@/types';
import { LoadingState } from '@/components/common/LoadingState';
import { useSession } from '@/auth/session';
import { paths } from './paths';

// UI only guard, the backend must also enforce access independently
export function RequireRole({ role }: { role: Role }) {
  const user = useSession((s) => s.user);
  const newAccount = useSession((s) => s.newAccount);
  const status = useSession((s) => s.status);
  const location = useLocation();

  if (status === 'loading') return <LoadingState message="Checking your account…" fullscreen />;
  if (newAccount) return <Navigate to={paths.onboarding} replace />;
  if (!user) return <Navigate to={paths.login} state={{ from: location.pathname }} replace />;
  if (user.role !== role) return <Navigate to={paths.forbidden} replace />;
  return <Outlet />;
}
