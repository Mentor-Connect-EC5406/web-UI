import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSession } from '@/auth/session';
import { paths } from '@/app/paths';

// the login button will hand off to Asgardeo once connected, demo mode signs in directly
export default function LoginPage() {
  const { signIn, signInAs } = useSession();

  return (
    <Card className="p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-secondary">Log in to continue your mentoring journey</p>
      </div>

      <Button size="lg" className="w-full" onClick={signIn}>Log in</Button>
      <p className="mt-3 text-center text-xs text-ink-muted">Secure sign-in with Asgardeo</p>

      <p className="mt-8 text-center text-sm text-ink-secondary">
        New to MentorConnect?{' '}
        <Link to={paths.signup} className="font-semibold text-ink hover:underline">Create an account</Link>
      </p>

      {import.meta.env.DEV && (
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
