import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { StudentProfile, StudentProfileUpdate } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ChipToggleGroup } from '@/components/common/ChipToggleGroup';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { FormField } from '@/components/common/FormField';
import { TagInput } from '@/components/common/TagInput';
import { ACADEMIC_YEARS, INDUSTRIES, UNIVERSITIES } from '@/config/options';
import { MAX_BIO_LENGTH, MAX_HEADLINE_LENGTH, MAX_INTERESTS, MAX_SKILLS } from '@/config/constants';
import { fieldAria } from '@/lib/fieldAria';
import { profileProgress, validateStudentProfile } from '@/lib/profile';
import { CertificatesSection, EducationSection, ExperienceSection, ProjectsSection } from './EntrySections';
import { FormActions } from './FormActions';
import { PhotoPicker } from './PhotoPicker';
import { ProfileSection } from './ProfileSection';
import { LanguagesSection, LinksFields, VisibilitySection, WorkPreferencesSection } from './ProfileSections';
import { ProfileSummaryCard } from './ProfileSummaryCard';
import { OpenToOpportunitiesBadge } from './ProfileView';
import { useProfileForm } from './useProfileForm';

interface StudentProfileFormProps {
  profile: StudentProfile;
  // read only preview of the saved profile and the link that is shared
  previewPath: string;
  saving: boolean;
  onSave: (update: StudentProfileUpdate) => Promise<unknown>;
}

export function StudentProfileForm({ profile, previewPath, saving, onSave }: StudentProfileFormProps) {
  const { email, ...initial } = profile;
  const { values, saved, set, errors, dirty, status, discard, handleSubmit } = useProfileForm(initial, validateStudentProfile, onSave);

  const progress = profileProgress([
    { label: 'a photo', value: values.avatarUrl, section: 'photo' },
    { label: 'a headline', value: values.headline, section: 'intro' },
    { label: 'your location', value: values.location, section: 'intro' },
    { label: 'an about section', value: values.bio, section: 'about' },
    { label: 'your university', value: values.university, section: 'academic' },
    { label: 'education', value: values.education, section: 'education' },
    { label: 'experience', value: values.experience, section: 'experience' },
    { label: 'a project', value: values.projects, section: 'projects' },
    { label: 'skills', value: values.skills, section: 'skills' },
    { label: 'languages', value: values.languages, section: 'languages' },
    { label: 'career interests', value: values.interests, section: 'interests' },
  ]);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <fieldset disabled={saving} className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <ProfileSummaryCard
            photo={
              <div id="photo" className="scroll-mt-6">
                <PhotoPicker name={`${saved.firstName} ${saved.lastName}`} value={values.avatarUrl} onChange={(avatarUrl) => set({ avatarUrl })} />
              </div>
            }
            name={`${saved.firstName} ${saved.lastName}`}
            headline={saved.headline}
            location={saved.location}
            email={email}
            badges={saved.workPreferences.openToOpportunities ? <OpenToOpportunitiesBadge /> : undefined}
            actions={
              <>
                <Button asChild variant="secondary" size="sm" className="w-full">
                  <Link to={previewPath}><Eye aria-hidden /> View as others see it</Link>
                </Button>
                <CopyLinkButton url={`${window.location.origin}${previewPath}`} />
              </>
            }
            progress={progress}
          />
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
              <FormField htmlFor="headline" label="Headline" error={errors.headline} hint={`${values.headline.length} / ${MAX_HEADLINE_LENGTH} · e.g. Computer Science undergraduate · Aspiring data analyst`}>
                <Input id="headline" value={values.headline} maxLength={MAX_HEADLINE_LENGTH} onChange={(e) => set({ headline: e.target.value })} {...fieldAria('headline', errors.headline, true)} />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField htmlFor="location" label="Location">
                  <Input id="location" value={values.location} onChange={(e) => set({ location: e.target.value })} autoComplete="address-level2" placeholder="e.g. Colombo, Sri Lanka" />
                </FormField>
                <FormField htmlFor="phone" label="Phone" error={errors.phone}>
                  <Input id="phone" type="tel" value={values.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" placeholder="+94 77 000 0000" {...fieldAria('phone', errors.phone)} />
                </FormField>
              </div>
              <FormField htmlFor="email" label="Email" hint="Linked to your sign in account">
                <Input id="email" type="email" value={email} disabled aria-describedby="email-hint" />
              </FormField>
              <LinksFields links={values.links} onChange={(links) => set({ links })} errors={errors} />
            </div>
          </ProfileSection>

          <ProfileSection id="about" title="About">
            <FormField htmlFor="bio" label="About you" error={errors.bio} hint={`${values.bio.length} / ${MAX_BIO_LENGTH}`}>
              <Textarea
                id="bio"
                value={values.bio}
                onChange={(e) => set({ bio: e.target.value })}
                maxLength={MAX_BIO_LENGTH}
                className="min-h-32"
                placeholder="Your interests, goals and what you'd like help with"
                {...fieldAria('bio', errors.bio, true)}
              />
            </FormField>
          </ProfileSection>

          <ProfileSection id="academic" title="Academic details">
            <div className="space-y-4">
              <FormField htmlFor="university" label="University">
                <Select id="university" value={values.university} onValueChange={(university) => set({ university })} placeholder="Select your university" options={UNIVERSITIES} />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField htmlFor="degree" label="Degree">
                  <Input id="degree" value={values.degree} onChange={(e) => set({ degree: e.target.value })} placeholder="e.g. BSc Computer Science" />
                </FormField>
                <FormField htmlFor="year" label="Academic year">
                  <Select id="year" value={values.academicYear} onValueChange={(academicYear) => set({ academicYear })} placeholder="Select year" options={ACADEMIC_YEARS} />
                </FormField>
              </div>
            </div>
          </ProfileSection>

          <ExperienceSection entries={values.experience} onChange={(experience) => set({ experience })} />
          <EducationSection entries={values.education} onChange={(education) => set({ education })} />
          <CertificatesSection entries={values.certificates} onChange={(certificates) => set({ certificates })} />
          <ProjectsSection entries={values.projects} onChange={(projects) => set({ projects })} />

          <ProfileSection id="skills" title="Skills">
            <FormField htmlFor="skills-input" label="Your skills" hint={`Press Enter after each skill, up to ${MAX_SKILLS}`}>
              <TagInput id="skills-input" value={values.skills} onChange={(skills) => set({ skills })} max={MAX_SKILLS} placeholder="e.g. Python" describedBy="skills-input-hint" />
            </FormField>
          </ProfileSection>

          <LanguagesSection languages={values.languages} onChange={(languages) => set({ languages })} />

          <ProfileSection
            id="interests"
            title="Career interests"
            description={`Pick up to ${MAX_INTERESTS} fields so mentors know where you want to grow.`}
            action={<span className="text-sm text-ink-secondary">{values.interests.length} of {MAX_INTERESTS}</span>}
          >
            <ChipToggleGroup label="Career interests" options={INDUSTRIES} value={values.interests} onChange={(interests) => set({ interests })} max={MAX_INTERESTS} />
          </ProfileSection>

          <WorkPreferencesSection value={values.workPreferences} onChange={(workPreferences) => set({ workPreferences })} />
          <VisibilitySection value={values.visibility} onChange={(visibility) => set({ visibility })} />
        </div>
      </fieldset>

      <FormActions dirty={dirty} saving={saving} status={status} onDiscard={discard} />
    </form>
  );
}
