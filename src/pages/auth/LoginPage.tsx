import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Input';
import { useSession } from '@/auth/session';
import { USE_MOCKS } from '@/config/env';
import { paths } from '@/app/paths';

function GoogleIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const signIn = useSession((s) => s.signIn);
  const error = useSession((s) => s.error);
  const [leaving, setLeaving] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!USE_MOCKS) setLeaving(true);
    signIn();
  }

  return (
    <Card className="p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-secondary">Log in to continue your mentoring journey</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-accent-soft p-3 text-xs text-accent">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="origin-center transition-all duration-300 ease-out hover:scale-[1.02] focus:scale-[1.02] hover:border-brand/70 hover:shadow-sm focus:shadow-md"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="origin-center transition-all duration-300 ease-out hover:scale-[1.02] focus:scale-[1.02] hover:border-brand/70 hover:shadow-sm focus:shadow-md"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          loading={leaving}
          className="w-full font-semibold shadow-sm transition-all duration-300 ease-out hover:scale-[1.01]"
        >
          Log In
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-3 font-medium text-ink-muted">OR</span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full font-medium transition-all duration-300 ease-out hover:scale-[1.01]"
        onClick={() => {
          if (!USE_MOCKS) setLeaving(true);
          signIn();
        }}
      >
        <GoogleIcon />
        Sign in with Google
      </Button>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Don&apos;t have an account?{' '}
        <Link to={paths.signup} className="font-semibold text-ink hover:underline">
          Sign Up
        </Link>
      </p>
    </Card>
  );
}
