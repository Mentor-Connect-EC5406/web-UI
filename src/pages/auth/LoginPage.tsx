import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSession } from '@/auth/session';
import { paths } from '@/app/paths';

// log in hands off to asgardeo
export default function LoginPage() {
  const signIn = useSession((s) => s.signIn);
  const signOut = useSession((s) => s.signOut);
  const error = useSession((s) => s.error);
  const checking = useSession((s) => s.status === 'loading');
  const [leaving, setLeaving] = useState(false);

  function handleSignIn() {
    // asgardeo takes over the page, the spinner covers the short wait before it does
    setLeaving(true);
    signIn();
  }

  return (
    <Card className="p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-secondary">Log in to continue your mentoring journey</p>
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl bg-accent-soft p-3 text-xs text-accent">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      <Button
        size="lg"
        loading={checking || (leaving && !error)}
        className="w-full font-semibold transition-all duration-300 ease-out hover:scale-[1.01]"
        onClick={handleSignIn}
      >
        {error ? 'Try again' : 'Log in'}
      </Button>
      {/* signing out of asgardeo is the only way to switch to another account after a failed sign in */}
      {error && (
        <Button size="lg" variant="secondary" className="mt-3 w-full" onClick={signOut}>Sign out and use another account</Button>
      )}
      <p className="mt-3 text-center text-xs text-ink-muted">Secure sign-in with Asgardeo</p>

      <p className="mt-8 text-center text-sm text-ink-secondary">
        New to MentorConnect?{' '}
        <Link to={paths.signup} className="font-semibold text-ink hover:underline">
          Create an account
        </Link>
      </p>
    </Card>
  );
}