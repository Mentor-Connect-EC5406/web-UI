import { useNavigate } from 'react-router-dom';
import type { OnboardingRole } from '@/types';
import { homePathFor } from '@/app/paths';
import { useSession } from './session';

// public buttons go straight to the asgardeo page, signed in people go to their dashboard instead
export function useAuthRedirect() {
  const user = useSession((s) => s.user);
  const signIn = useSession((s) => s.signIn);
  const signUp = useSession((s) => s.signUp);
  const navigate = useNavigate();

  return {
    logIn: () => (user ? navigate(homePathFor(user.role)) : signIn()),
    signUp: (role?: OnboardingRole) => (user ? navigate(homePathFor(user.role)) : signUp(role)),
  };
}
