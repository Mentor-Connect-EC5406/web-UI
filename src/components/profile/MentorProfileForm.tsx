import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Info } from 'lucide-react';
import type { Mentor, MentorProfileUpdate } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { FormField } from '@/components/common/FormField';
import { RatingStars } from '@/components/common/RatingStars';
import { TagInput } from '@/components/common/TagInput';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { INDUSTRIES } from '@/config/options';
import { CURRENCY, MAX_BIO_LENGTH, MAX_EXPERIENCE_YEARS, MAX_HEADLINE_LENGTH, MAX_SKILLS } from '@/config/constants';
import { fieldAria } from '@/lib/fieldAria';
import { formatPrice, sessionLengthLabel } from '@/lib/format';
import { profileProgress, validateMentorProfile, type MentorProfileDraft } from '@/lib/profile';
import { CertificatesSection, EducationSection, ExperienceSection, ProjectsSection } from './EntrySections';
import { FormActions } from './FormActions';
import { PhotoPicker } from './PhotoPicker';
import { ProfileSection } from './ProfileSection';
import { LanguagesSection, LinksFields } from './ProfileSections';
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
    avatarUrl: m.avatarUrl,
    headline: m.headline,
    location: m.location,
    links: m.links,
    experience: m.experience,
    education: m.education,
    certificates: m.certificates,
    projects: m.projects,
    languages: m.languages,
  };
}

const toUpdate = (d: MentorProfileDraft): MentorProfileUpdate => ({
  ...d,
  firstName: d.firstName.trim(),
  lastName: d.lastName.trim(),
  title: d.title.trim(),
  organization: d.organization.trim(),
  bio: d.bio.trim(),
  headline: d.headline.trim(),
  location: d.location.trim(),
  experienceYears: Number(d.experienceYears),
  hourlyRate: Number(d.hourlyRate),
});

export function MentorProfileForm({ mentor, email, publicPath, saving, onSave }: MentorProfileFormProps) {
  const { values, set, errors, dirty, status, discard, handleSubmit } = useProfileForm(
    toDraft(mentor),
    validateMentorProfile,
    (draft) => onSave(toUpdate(draft)),
  );

  const progress = profileProgress([
    { label: 'a photo', value: values.avatarUrl, section: 'photo' },
    { label: 'a headline', value: values.headline, section: 'intro' },
    { label: 'your location', value: values.location, section: 'intro' },
    { label: 'a link', value: Object.values(values.links).filter((l) => l.trim()), section: 'intro' },
    { label: 'experience', value: values.experience, section: 'experience' },
    { label: 'education', value: values.education, section: 'education' },
    { label: 'a certificate', value: values.certificates, section: 'certificates' },
    { label: 'a project', value: values.projects, section: 'projects' },
    { label: 'languages', value: values.languages, section: 'languages' },
  ]);

  const priceHint = /^\d+$/.test(values.hourlyRate)
    ? `Students see ${formatPrice(Number(values.hourlyRate))} for a ${sessionLengthLabel()} session`
    : `Price for one ${sessionLengthLabel()} session`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <fieldset disabled={saving} className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <ProfileSummaryCard
            photo={
              <div id="photo" className="scroll-mt-6">
                <PhotoPicker name={mentor.name} value={values.avatarUrl} onChange={(avatarUrl) => set({ avatarUrl })} />
              </div>
            }
            name={mentor.name}
            headline={mentor.headline || `${mentor.title} · ${mentor.organization}`}
            location={mentor.location}
            email={email}
            badges={
              <>
                {mentor.isVerified ? <VerifiedBadge /> : <Badge><Clock className="size-3" aria-hidden /> Pending review</Badge>}
                <RatingStars rating={mentor.rating} reviewCount={mentor.reviewCount} />
              </>
            }
            actions={
              <>
                <Button asChild variant="secondary" size="sm" className="w-full">
                  <Link to={publicPath}>View public profile <ExternalLink aria-hidden /></Link>
                </Button>
                <CopyLinkButton url={`${window.location.origin}${publicPath}`} />
              </>
            }
            progress={progress}
          />
          {!mentor.isVerified && (
            <p className="flex items-start gap-2 rounded-xl bg-brand-soft p-3 text-sm text-ink-secondary">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              Our team reviews every mentor profile before it appears to students. You can keep editing while you wait.
            </p>
          )}
        </aside>

        <div className="min-w-0 space-y-6">
          <ProfileSection id="intro" title="Intro">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField htmlFor="firstName" label="First name" required error={errors.firstName}>
                  <Input id="firstName" value={values.firstName} onChange={(e) => set({ firstName: e.target.value })} autoComplete="given-name" {...fieldAria('firstName', errors.firstName)} />
                </FormField>
                <FormField htmlFor="lastName" label="Last name" required error={errors.lastName}>
                  <Input id="lastName" value={values.lastName} onChange={(e) => set({ lastName: e.target.value })} autoComplete="family-name" {...fieldAria('lastName', errors.lastName)} />
                </FormField>
              </div>
              <FormField htmlFor="headline" label="Headline" error={errors.headline} hint={`${values.headline.length} / ${MAX_HEADLINE_LENGTH} · shown under your name in search results`}>
                <Input id="headline" value={values.headline} maxLength={MAX_HEADLINE_LENGTH} onChange={(e) => set({ headline: e.target.value })} placeholder="e.g. Senior Engineer at WSO2 · Helping students into tech" {...fieldAria('headline', errors.headline, true)} />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField htmlFor="location" label="Location">
                  <Input id="location" value={values.location} onChange={(e) => set({ location: e.target.value })} autoComplete="address-level2" placeholder="e.g. Colombo, Sri Lanka" />
                </FormField>
                <FormField htmlFor="email" label="Email" hint="Linked to your sign in account">
                  <Input id="email" type="email" value={email} disabled aria-describedby="email-hint" />
                </FormField>
              </div>
              <LinksFields links={values.links} onChange={(links) => set({ links })} errors={errors} />
            </div>
          </ProfileSection>

          <ProfileSection id="professional" title="Professional details">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField htmlFor="title" label="Job title" required error={errors.title}>
                  <Input id="title" value={values.title} onChange={(e) => set({ title: e.target.value })} autoComplete="organization-title" {...fieldAria('title', errors.title)} />
                </FormField>
                <FormField htmlFor="organization" label="Organisation" required error={errors.organization}>
                  <Input id="organization" value={values.organization} onChange={(e) => set({ organization: e.target.value })} autoComplete="organization" {...fieldAria('organization', errors.organization)} />
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField htmlFor="industry" label="Job field" required error={errors.industry}>
                  <Select id="industry" value={values.industry} onValueChange={(industry) => set({ industry })} placeholder="Select your field" options={INDUSTRIES} />
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
                    {...fieldAria('experienceYears', errors.experienceYears)}
                  />
                </FormField>
              </div>
            </div>
          </ProfileSection>

          <ProfileSection id="about" title="About">
            <div className="space-y-4">
              <FormField htmlFor="bio" label="About you" required error={errors.bio} hint={`${values.bio.length} / ${MAX_BIO_LENGTH}`}>
                <Textarea
                  id="bio"
                  value={values.bio}
                  onChange={(e) => set({ bio: e.target.value })}
                  maxLength={MAX_BIO_LENGTH}
                  className="min-h-32"
                  placeholder="Your background and how you help students"
                  {...fieldAria('bio', errors.bio, true)}
                />
              </FormField>
              <FormField htmlFor="skills" label="Skills" required error={errors.skills} hint={`Press Enter after each skill, up to ${MAX_SKILLS}. Students can search for these.`}>
                <TagInput
                  id="skills"
                  value={values.skills}
                  onChange={(skills) => set({ skills })}
                  max={MAX_SKILLS}
                  placeholder="e.g. React"
                  invalid={!!errors.skills}
                  describedBy={fieldAria('skills', errors.skills, true)['aria-describedby']}
                />
              </FormField>
            </div>
          </ProfileSection>

          <ExperienceSection entries={values.experience} onChange={(experience) => set({ experience })} />
          <EducationSection entries={values.education} onChange={(education) => set({ education })} />
          <CertificatesSection entries={values.certificates} onChange={(certificates) => set({ certificates })} />
          <ProjectsSection entries={values.projects} onChange={(projects) => set({ projects })} />
          <LanguagesSection languages={values.languages} onChange={(languages) => set({ languages })} />

          <ProfileSection id="sessions" title="Sessions">
            <FormField htmlFor="hourlyRate" label={`Price per session (${CURRENCY})`} required error={errors.hourlyRate} hint={priceHint}>
              <div className="sm:max-w-60">
                <Input
                  id="hourlyRate"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={100}
                  value={values.hourlyRate}
                  onChange={(e) => set({ hourlyRate: e.target.value })}
                  {...fieldAria('hourlyRate', errors.hourlyRate, true)}
                />
              </div>
            </FormField>
          </ProfileSection>
        </div>
      </fieldset>

      <FormActions dirty={dirty} saving={saving} status={status} onDiscard={discard} />
    </form>
  );
}
