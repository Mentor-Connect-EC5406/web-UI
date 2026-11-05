import { useState, type FormEvent } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import type { OnboardingRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/common/LoadingState';
import { MentorDetailsFields, NameFields, StudentDetailsFields } from '@/components/auth/DetailsFields';
import { RoleChoice } from '@/components/auth/RoleChoice';
import { readSignupRole, useSession } from '@/auth/session';
import { homePathFor, paths } from '@/app/paths';
import { firstName } from '@/lib/format';
import { readOnboardingForm } from '@/lib/onboarding';

// reached after sign up, creates the account with the chosen role and the first profile details
export default function OnboardingPage() {
  const user = useSession((s) => s.user);
  const newAccount = useSession((s) => s.newAccount);
  const status = useSession((s) => s.status);
  const completeOnboarding = useSession((s) => s.completeOnboarding);
  const [searchParams] = useSearchParams();
  const isMentorParam = searchParams.get('role') === 'mentor' || readSignupRole() === 'MENTOR';
  const [role, setRole] = useState<OnboardingRole>(isMentorParam ? 'MENTOR' : 'STUDENT');
  const [step, setStep] = useState<'role' | 'details'>(isMentorParam ? 'details' : 'role');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === 'loading') return <LoadingState message="Checking your account…" />;
  if (user) return <Navigate to={homePathFor(user.role)} replace />;
  if (!newAccount) return <Navigate to={paths.login} replace />;

  const needsName = !newAccount.firstName || !newAccount.lastName;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newAccount) return;
    setSaving(true);
    setError(null);
    try {
      // the redirect at the top of this component runs once the user is set
      await completeOnboarding(readOnboardingForm(role, new FormData(e.currentTarget), newAccount));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your account could not be created. Please try again.');
      setSaving(false);
    }
  }

  return (
    <Card className="p-8">
      {step === 'role' ? (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-ink">Welcome{newAccount.name ? `, ${firstName(newAccount.name)}` : ''}</h1>
            <p className="mt-1 text-sm text-ink-secondary">Tell us who you are so we can set up the right experience.</p>
          </div>
          <RoleChoice value={role} onChange={setRole} />
          <Button size="lg" className="mt-6 w-full" onClick={() => setStep('details')}>
            Continue <ArrowRight />
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" onClick={() => setStep('role')} className="-ml-3" disabled={saving}>
            <ArrowLeft /> Back
          </Button>
          <h1 className="mt-2 mb-6 text-xl font-semibold text-ink">
            {role === 'STUDENT' ? 'A little about your studies' : 'A little about your work'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={saving} className="space-y-4">
              {needsName && <NameFields />}
              {role === 'STUDENT' ? <StudentDetailsFields /> : <MentorDetailsFields />}
            </fieldset>
            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-xl bg-accent-soft p-3 text-sm text-accent">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {error}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" loading={saving}>
              {role === 'STUDENT' ? 'Start finding mentors' : 'Set up my mentor profile'}
            </Button>
          </form>
        </>
      )}
    </Card>
  );
}
