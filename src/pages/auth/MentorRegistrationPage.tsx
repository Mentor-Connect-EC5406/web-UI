import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/common/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { INDUSTRIES } from '@/config/options';
import { useSession } from '@/auth/session';
import { paths } from '@/app/paths';

/** Dedicated mentor registration form with work and profile details */
export default function MentorRegistrationPage() {
  const signInAs = useSession((s) => s.signInAs);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState<string>(INDUSTRIES[0]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // In demo mode, sign in as mentor and navigate to the mentor dashboard
    signInAs('MENTOR');
    navigate(paths.mentorArea.home);
  }

  return (
    <Card className="p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-ink">
          <Sparkles className="size-6 text-ink" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Mentor Registration</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Join our network of industry mentors to share your expertise and shape careers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField htmlFor="fullName" label="Full name" required>
          <Input id="fullName" name="fullName" placeholder="e.g. Sarah Jenkins" defaultValue="Sarah Jenkins" required />
        </FormField>

        <FormField htmlFor="email" label="Work email" required>
          <Input id="email" name="email" type="email" placeholder="sarah@company.com" defaultValue="sarah@company.com" required />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="jobTitle" label="Job title" required>
            <Input id="jobTitle" name="jobTitle" placeholder="e.g. Lead Engineer" defaultValue="Lead Engineer" required />
          </FormField>
          <FormField htmlFor="organization" label="Organisation" required>
            <Input id="organization" name="organization" placeholder="e.g. Google" defaultValue="Google" required />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="field" label="Industry field">
            <Select id="field" placeholder="Select your field" options={INDUSTRIES} value={field} onValueChange={setField} />
          </FormField>
          <FormField htmlFor="experience" label="Years of experience" required>
            <Input id="experience" name="experience" type="number" min={1} max={50} defaultValue="5" required />
          </FormField>
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-brand-soft p-3 text-xs sm:text-sm text-ink-secondary">
          <Info className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden />
          <span>Our team reviews every mentor profile. You can start setting up your availability immediately.</span>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Complete Mentor Registration'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Already have an account?{' '}
        <Link to={paths.login} className="font-semibold text-ink hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
