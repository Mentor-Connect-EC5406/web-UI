import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Info } from 'lucide-react';
import type { Mentor, MentorProfileUpdate } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import { RatingStars } from '@/components/common/RatingStars';
import { TagInput } from '@/components/common/TagInput';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { INDUSTRIES } from '@/config/options';
import { CURRENCY, MAX_BIO_LENGTH, MAX_EXPERIENCE_YEARS, MAX_SKILLS } from '@/config/constants';
import { formatPrice, sessionLengthLabel } from '@/lib/format';
import { profileProgress, validateMentorProfile, type MentorProfileDraft } from '@/lib/profile';
import { FormActions } from './FormActions';
import { ProfileSummaryCard } from './ProfileSummaryCard';
import { useProfileForm } from './useProfileForm';

interface MentorProfileFormProps {
  mentor: Mentor;
  email: string;
  // where students see this profile
  publicPath: string;
  saving: boolean;
  onSave: (update: MentorProfileUpdate) => Promise<unknown>;
}

function toDraft(m: Mentor): MentorProfileDraft {
  const [firstName = '', ...rest] = m.name.split(' ');
  return {
    firstName,
    lastName: rest.join(' '),
    title: m.title,
    organization: m.organization,
    industry: m.industry,
    bio: m.bio,
    skills: m.skills,
    experienceYears: String(m.experienceYears),
    hourlyRate: String(m.hourlyRate),
  };
}

const toUpdate = (d: MentorProfileDraft): MentorProfileUpdate => ({
  ...d,
  firstName: d.firstName.trim(),
  lastName: d.lastName.trim(),
  title: d.title.trim(),
  organization: d.organization.trim(),
  bio: d.bio.trim(),
  experienceYears: Number(d.experienceYears),
  hourlyRate: Number(d.hourlyRate),
});

// links an input to its error or hint text below
const describedBy = (id: string, error?: string, hasHint = false) =>
  error ? `${id}-error` : hasHint ? `${id}-hint` : undefined;

export function MentorProfileForm({ mentor, email, publicPath, saving, onSave }: MentorProfileFormProps) {
  const { values, set, errors, dirty, status, discard, handleSubmit } = useProfileForm(
    toDraft(mentor),
    validateMentorProfile,
    (draft) => onSave(toUpdate(draft)),
  );

  const progress = profileProgress([
    { label: 'job title', value: values.title },
    { label: 'organisation', value: values.organization },
    { label: 'job field', value: values.industry },
    { label: 'about', value: values.bio },
    { label: 'skills', value: values.skills },
    { label: 'years of experience', value: values.experienceYears },
    { label: 'session price', value: values.hourlyRate },
  ]);

  const priceHint = /^\d+$/.test(values.hourlyRate)
    ? `Students see ${formatPrice(Number(values.hourlyRate))} for a ${sessionLengthLabel()} session`
    : `Price for one ${sessionLengthLabel()} session`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <ProfileSummaryCard
        name={mentor.name}
        email={email}
        avatarUrl={mentor.avatarUrl}
        subtitle={`${mentor.title} · ${mentor.organization}`}
        badges={
          <>
            {mentor.isVerified ? (
              <VerifiedBadge />
            ) : (
              <Badge><Clock className="size-3" aria-hidden /> Pending review</Badge>
            )}
            <RatingStars rating={mentor.rating} reviewCount={mentor.reviewCount} />
          </>
        }
        action={
          <Button asChild variant="secondary" size="sm">
            <Link to={publicPath}>
              View public profile <ExternalLink aria-hidden />
            </Link>
          </Button>
        }
        progress={progress}
      />

      {!mentor.isVerified && (
        <p className="flex items-start gap-2 rounded-xl bg-brand-soft p-3 text-sm text-ink-secondary">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          Our team reviews every mentor profile before it appears to students. You can keep editing while you wait.
        </p>
      )}

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
                  aria-describedby={describedBy('firstName', errors.firstName)}
                />
              </FormField>
              <FormField htmlFor="lastName" label="Last name" required error={errors.lastName}>
                <Input
                  id="lastName"
                  value={values.lastName}
                  onChange={(e) => set({ lastName: e.target.value })}
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName || undefined}
                  aria-describedby={describedBy('lastName', errors.lastName)}
                />
              </FormField>
            </div>
            <FormField htmlFor="email" label="Email" hint="Linked to your sign in account">
              <Input id="email" type="email" value={email} disabled aria-describedby="email-hint" />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Professional details" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField htmlFor="title" label="Job title" required error={errors.title}>
                <Input
                  id="title"
                  value={values.title}
                  onChange={(e) => set({ title: e.target.value })}
                  autoComplete="organization-title"
                  aria-invalid={!!errors.title || undefined}
                  aria-describedby={describedBy('title', errors.title)}
                />
              </FormField>
              <FormField htmlFor="organization" label="Organisation" required error={errors.organization}>
                <Input
                  id="organization"
                  value={values.organization}
                  onChange={(e) => set({ organization: e.target.value })}
                  autoComplete="organization"
                  aria-invalid={!!errors.organization || undefined}
                  aria-describedby={describedBy('organization', errors.organization)}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField htmlFor="industry" label="Job field" required error={errors.industry}>
                <Select
                  id="industry"
                  value={values.industry}
                  onValueChange={(industry) => set({ industry })}
                  placeholder="Select your field"
                  options={INDUSTRIES}
                />
              </FormField>
              <FormField htmlFor="experienceYears" label="Years of experience" required error={errors.experienceYears}>
                <Input
                  id="experienceYears"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={MAX_EXPERIENCE_YEARS}
                  value={values.experienceYears}
                  onChange={(e) => set({ experienceYears: e.target.value })}
                  aria-invalid={!!errors.experienceYears || undefined}
                  aria-describedby={describedBy('experienceYears', errors.experienceYears)}
                />
              </FormField>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="About and skills" />
          <CardBody className="space-y-4">
            <FormField
              htmlFor="bio"
              label="About you"
              required
              error={errors.bio}
              hint={`${values.bio.length} / ${MAX_BIO_LENGTH}`}
            >
              <Textarea
                id="bio"
                value={values.bio}
                onChange={(e) => set({ bio: e.target.value })}
                maxLength={MAX_BIO_LENGTH}
                className="min-h-32"
                placeholder="Your background and how you help students"
                aria-invalid={!!errors.bio || undefined}
                aria-describedby={describedBy('bio', errors.bio, true)}
              />
            </FormField>
            <FormField
              htmlFor="skills"
              label="Skills"
              required
              error={errors.skills}
              hint={`Press Enter after each skill, up to ${MAX_SKILLS}. Students can search for these.`}
            >
              <TagInput
                id="skills"
                value={values.skills}
                onChange={(skills) => set({ skills })}
                max={MAX_SKILLS}
                placeholder="e.g. React"
                invalid={!!errors.skills}
                describedBy={describedBy('skills', errors.skills, true)}
              />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sessions" />
          <CardBody>
            <FormField
              htmlFor="hourlyRate"
              label={`Price per session (${CURRENCY})`}
              required
              error={errors.hourlyRate}
              hint={priceHint}
            >
              <div className="sm:max-w-60">
                <Input
                  id="hourlyRate"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={100}
                  value={values.hourlyRate}
                  onChange={(e) => set({ hourlyRate: e.target.value })}
                  aria-invalid={!!errors.hourlyRate || undefined}
                  aria-describedby={describedBy('hourlyRate', errors.hourlyRate, true)}
                />
              </div>
            </FormField>
          </CardBody>
        </Card>
      </fieldset>

      <FormActions dirty={dirty} saving={saving} status={status} onDiscard={discard} />
    </form>
  );
}
