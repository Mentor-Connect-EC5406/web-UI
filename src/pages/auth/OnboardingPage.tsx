import { useState, type FormEvent } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { OnboardingRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MentorDetailsFields, StudentDetailsFields } from '@/components/auth/DetailsFields';
import { RoleChoice } from '@/components/auth/RoleChoice';
import { useSession } from '@/auth/session';
import { homePathFor, paths } from '@/app/paths';
import { firstName } from '@/lib/format';

// only reachable after a fresh sign up, role details will be sent to the profile API during integration
export default function OnboardingPage() {
  const user = useSession((s) => s.user);
  const newAccount = useSession((s) => s.newAccount);
  const completeOnboarding = useSession((s) => s.completeOnboarding);
  const [searchParams] = useSearchParams();
  const isMentorParam = searchParams.get('role') === 'mentor';
  const [role, setRole] = useState<OnboardingRole>(isMentorParam ? 'MENTOR' : 'STUDENT');
  const [step, setStep] = useState<'role' | 'details'>(isMentorParam ? 'details' : 'role');

  if (user) return <Navigate to={homePathFor(user.role)} replace />;
  if (!newAccount) return <Navigate to={paths.login} replace />;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // signing in triggers the redirect at the top of this component
    completeOnboarding(role);
  }

  return (
    <Card className="p-8">
      {step === 'role' ? (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-ink">Welcome, {firstName(newAccount.name)}</h1>
            <p className="mt-1 text-sm text-ink-secondary">Tell us who you are so we can set up the right experience.</p>
          </div>
          <RoleChoice value={role} onChange={setRole} />
          <Button size="lg" className="mt-6 w-full" onClick={() => setStep('details')}>
            Continue <ArrowRight />
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" onClick={() => setStep('role')} className="-ml-3">
            <ArrowLeft /> Back
          </Button>
          <h1 className="mt-2 mb-6 text-xl font-semibold text-ink">
            {role === 'STUDENT' ? 'A little about your studies' : 'A little about your work'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'STUDENT' ? <StudentDetailsFields /> : <MentorDetailsFields />}
            <Button type="submit" size="lg" className="w-full">
              {role === 'STUDENT' ? 'Start finding mentors' : 'Set up my mentor profile'}
            </Button>
          </form>
        </>
      )}
    </Card>
  );
}
