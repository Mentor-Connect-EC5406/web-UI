import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSession } from '@/auth/session';
import { paths } from '@/app/paths';

// sign up will hand off to Asgardeo once connected, demo mode creates an account directly
export default function SignupPage() {
  const signUp = useSession((s) => s.signUp);
  const navigate = useNavigate();

  function handleSignUp() {
    signUp();
    navigate(paths.onboarding);
  }

  return (
    <Card className="p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-ink">Join MentorConnect</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Create your account in a minute. You'll tell us if you're a student or a mentor next.
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={handleSignUp}>Sign up</Button>
      <p className="mt-3 text-center text-xs text-ink-muted">Secure sign-up with Asgardeo</p>

      <p className="mt-8 text-center text-sm text-ink-secondary">
        Already have an account?{' '}
        <Link to={paths.login} className="font-semibold text-ink hover:underline">Log in</Link>
      </p>
    </Card>
  );
}
