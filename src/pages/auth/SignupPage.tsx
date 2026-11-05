import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSession } from '@/auth/session';
import { USE_MOCKS } from '@/config/env';
import { paths } from '@/app/paths';

// sign up hands off to asgardeo where people choose create account, demo mode creates an account directly
export default function SignupPage() {
  const signUp = useSession((s) => s.signUp);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMentor = searchParams.get('role') === 'mentor';
  const [leaving, setLeaving] = useState(false);

  function handleSignUp() {
    signUp(isMentor ? 'MENTOR' : undefined);
    if (USE_MOCKS) navigate(isMentor ? `${paths.onboarding}?role=mentor` : paths.onboarding);
    else setLeaving(true);
  }

  return (
    <Card className="p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-ink">
          {isMentor ? 'Mentor Registration' : 'Join MentorConnect'}
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          {isMentor
            ? 'Create your mentor account to start sharing your expertise and shaping student careers.'
            : "Create your account in a minute. You'll tell us if you're a student or a mentor next."}
        </p>
      </div>

      <Button
        size="lg"
        loading={leaving}
        className="w-full font-semibold transition-all duration-300 ease-out hover:scale-[1.01]"
        onClick={handleSignUp}
      >
        {isMentor ? 'Register as a mentor' : 'Sign up'}
      </Button>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-brand-soft p-3 text-xs sm:text-sm text-ink-secondary">
        <Info className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden />
        <div className="leading-snug">
          <p>Mentor profiles are reviewed before publishing.</p>
          <p>Start setting up now.</p>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-ink-secondary">
        Already have an account?{' '}
        <Link to={paths.login} className="font-semibold text-ink hover:underline">Log in</Link>
      </p>
    </Card>
  );
}
