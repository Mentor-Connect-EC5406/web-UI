import { Check } from 'lucide-react';
import type { StudentProfile, StudentProfileUpdate } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import { ACADEMIC_YEARS, INDUSTRIES, UNIVERSITIES } from '@/config/options';
import { MAX_BIO_LENGTH, MAX_INTERESTS } from '@/config/constants';
import { cn } from '@/lib/cn';
import { profileProgress, validateStudentProfile } from '@/lib/profile';
import { FormActions } from './FormActions';
import { ProfileSummaryCard } from './ProfileSummaryCard';
import { useProfileForm } from './useProfileForm';

interface StudentProfileFormProps {
  profile: StudentProfile;
  avatarUrl: string | null;
  saving: boolean;
  onSave: (update: StudentProfileUpdate) => Promise<unknown>;
}

export function StudentProfileForm({ profile, avatarUrl, saving, onSave }: StudentProfileFormProps) {
  const { email, ...initial } = profile;
  const { values, saved, set, errors, dirty, status, discard, handleSubmit } = useProfileForm(initial, validateStudentProfile, onSave);

  const progress = profileProgress([
    { label: 'phone', value: values.phone },
    { label: 'about you', value: values.bio },
    { label: 'university', value: values.university },
    { label: 'degree', value: values.degree },
    { label: 'academic year', value: values.academicYear },
    { label: 'career interests', value: values.interests },
  ]);

  const interestsFull = values.interests.length >= MAX_INTERESTS;

  function toggleInterest(field: string) {
    set({
      interests: values.interests.includes(field)
        ? values.interests.filter((i) => i !== field)
        : [...values.interests, field],
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <ProfileSummaryCard
        name={`${saved.firstName} ${saved.lastName}`}
        email={email}
        avatarUrl={avatarUrl}
        subtitle={[saved.degree, saved.university].filter(Boolean).join(' · ') || undefined}
        progress={progress}
      />

      <fieldset disabled={saving} className="space-y-6">
        <Card>
          <CardHeader title="Personal information" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField htmlFor="firstName" label="First name" required error={errors.firstName}>
                <Input
                  id="firstName"
                  value={values.firstName}
                  onChange={(e) => set({ firstName: e.target.value })}
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName || undefined}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
              </FormField>
              <FormField htmlFor="lastName" label="Last name" required error={errors.lastName}>
                <Input
                  id="lastName"
                  value={values.lastName}
                  onChange={(e) => set({ lastName: e.target.value })}
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName || undefined}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
              </FormField>
            </div>
            <FormField htmlFor="email" label="Email" hint="Linked to your sign in account">
              <Input id="email" type="email" value={email} disabled aria-describedby="email-hint" />
            </FormField>
            <FormField htmlFor="phone" label="Phone" error={errors.phone}>
              <Input
                id="phone"
                type="tel"
                value={values.phone}
                onChange={(e) => set({ phone: e.target.value })}
                autoComplete="tel"
                placeholder="+94 77 000 0000"
                aria-invalid={!!errors.phone || undefined}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
            </FormField>
            <FormField htmlFor="bio" label="About you" error={errors.bio} hint={`${values.bio.length} / ${MAX_BIO_LENGTH}`}>
              <Textarea
                id="bio"
                value={values.bio}
                onChange={(e) => set({ bio: e.target.value })}
                maxLength={MAX_BIO_LENGTH}
                placeholder="Your interests and what you'd like help with"
                aria-invalid={!!errors.bio || undefined}
                aria-describedby={errors.bio ? 'bio-error' : 'bio-hint'}
              />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Academic details" />
          <CardBody className="space-y-4">
            <FormField htmlFor="university" label="University">
              <Select
                id="university"
                value={values.university}
                onValueChange={(university) => set({ university })}
                placeholder="Select your university"
                options={UNIVERSITIES}
              />
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField htmlFor="degree" label="Degree">
                <Input
                  id="degree"
                  value={values.degree}
                  onChange={(e) => set({ degree: e.target.value })}
                  placeholder="e.g. BSc Computer Science"
                />
              </FormField>
              <FormField htmlFor="year" label="Academic year">
                <Select
                  id="year"
                  value={values.academicYear}
                  onValueChange={(academicYear) => set({ academicYear })}
                  placeholder="Select year"
                  options={ACADEMIC_YEARS}
                />
              </FormField>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Career interests"
            action={<span className="text-sm text-ink-secondary">{values.interests.length} of {MAX_INTERESTS}</span>}
          />
          <CardBody>
            <p className="mb-4 text-sm text-ink-secondary">
              Pick up to {MAX_INTERESTS} fields so mentors know where you want to grow.
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Career interests">
              {INDUSTRIES.map((field) => {
                const selected = values.interests.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    aria-pressed={selected}
                    disabled={!selected && interestsFull}
                    onClick={() => toggleInterest(field)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      selected
                        ? 'border-brand bg-brand-soft font-medium text-ink'
                        : 'border-line bg-surface text-ink-secondary hover:bg-surface-subtle',
                    )}
                  >
                    {selected && <Check className="size-3.5" aria-hidden />}
                    {field}
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </fieldset>

      <FormActions dirty={dirty} saving={saving} status={status} onDiscard={discard} />
    </form>
  );
}
