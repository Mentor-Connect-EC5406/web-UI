import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSession } from '@/auth/session';
import { USE_MOCKS } from '@/config/env';
import { paths } from '@/app/paths';

// log in hands off to asgardeo, demo mode signs in directly
export default function LoginPage() {
  const signIn = useSession((s) => s.signIn);
  const signInAs = useSession((s) => s.signInAs);
  const error = useSession((s) => s.error);
  const [leaving, setLeaving] = useState(false);

  function handleSignIn() {
    // asgardeo takes over the page, the spinner covers the short wait before it does
    if (!USE_MOCKS) setLeaving(true);
    signIn();
  }

  return (
    <Card className="p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-secondary">Log in to continue your mentoring journey</p>
      </div>

      {error && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl bg-accent-soft p-3 text-sm text-accent">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {error}
        </p>
      )}

      <Button size="lg" className="w-full" onClick={handleSignIn} loading={leaving}>Log in</Button>
      <p className="mt-3 text-center text-xs text-ink-muted">Secure sign-in with Asgardeo</p>

      <p className="mt-8 text-center text-sm text-ink-secondary">
        New to MentorConnect?{' '}
        <Link to={paths.signup} className="font-semibold text-ink hover:underline">Create an account</Link>
      </p>

      {import.meta.env.DEV && USE_MOCKS && (
        <div className="mt-8 border-t border-line pt-6">
          <p className="mb-3 text-center text-xs text-ink-muted">Demo mode: preview an account without signing in</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="sm" onClick={() => signInAs('STUDENT')}><GraduationCap /> Student</Button>
            <Button variant="secondary" size="sm" onClick={() => signInAs('MENTOR')}><Briefcase /> Mentor</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
