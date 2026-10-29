import type { ReactNode } from 'react';
import { BriefcaseBusiness, EyeOff, Mail, MapPin, Phone } from 'lucide-react';
import type { ProfileExtras, StudentProfile } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { EntryList, LanguageList, LinkList, SkillList } from './ProfileLists';
import {
  describeCertificate,
  describeEducation,
  describeExperience,
  describeProject,
  orderCertificates,
  orderEducation,
  orderExperience,
} from './describeEntries';

function ViewCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardBody>{children}</CardBody>
    </Card>
  );
}

export function OpenToOpportunitiesBadge() {
  return (
    <Badge tone="success">
      <BriefcaseBusiness className="size-3" aria-hidden /> Open to opportunities
    </Badge>
  );
}

// experience, education, certificates, projects and languages, empty sections are left out
export function ProfileExtrasSections({ extras }: { extras: ProfileExtras }) {
  return (
    <>
      {extras.experience.length > 0 && (
        <ViewCard title="Experience">
          <EntryList entries={orderExperience(extras.experience)} describe={describeExperience} />
        </ViewCard>
      )}
      {extras.education.length > 0 && (
        <ViewCard title="Education">
          <EntryList entries={orderEducation(extras.education)} describe={describeEducation} />
        </ViewCard>
      )}
      {extras.certificates.length > 0 && (
        <ViewCard title="Licenses and certificates">
          <EntryList entries={orderCertificates(extras.certificates)} describe={describeCertificate} />
        </ViewCard>
      )}
      {extras.projects.length > 0 && (
        <ViewCard title="Projects">
          <EntryList entries={extras.projects} describe={describeProject} />
        </ViewCard>
      )}
      {extras.languages.length > 0 && (
        <ViewCard title="Languages">
          <LanguageList languages={extras.languages} />
        </ViewCard>
      )}
    </>
  );
}

// how a student's profile looks to mentors, respecting the visibility choices
export function StudentProfileView({ profile }: { profile: StudentProfile }) {
  const name = `${profile.firstName} ${profile.lastName}`;
  const { visibility, workPreferences: prefs } = profile;
  const academic = [profile.degree, profile.university, profile.academicYear].filter(Boolean).join(' · ');
  const hasPrefs = prefs.desiredRoles.length > 0 || prefs.workTypes.length > 0 || prefs.arrangements.length > 0;

  return (
    <div className="space-y-6">
      {!visibility.isPublic && (
        <p className="flex items-start gap-2 rounded-xl bg-surface-muted p-3 text-sm text-ink-secondary">
          <EyeOff className="mt-0.5 size-4 shrink-0" aria-hidden />
          Your profile is private. Only you and mentors you book can see it.
        </p>
      )}

      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar name={name} src={profile.avatarUrl} size="xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold text-ink">{name}</h2>
              {prefs.openToOpportunities && <OpenToOpportunitiesBadge />}
            </div>
            {profile.headline && <p className="text-ink">{profile.headline}</p>}
            {academic && <p className="text-sm text-ink-secondary">{academic}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
              {profile.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" aria-hidden /> {profile.location}</span>}
              {visibility.showEmail && <span className="flex items-center gap-1"><Mail className="size-3.5" aria-hidden /> {profile.email}</span>}
              {visibility.showPhone && profile.phone && <span className="flex items-center gap-1"><Phone className="size-3.5" aria-hidden /> {profile.phone}</span>}
            </div>
            <LinkList links={profile.links} />
          </div>
        </div>
      </Card>

      {profile.bio && (
        <ViewCard title="About">
          <p className="text-sm leading-relaxed whitespace-pre-line text-ink">{profile.bio}</p>
        </ViewCard>
      )}

      {hasPrefs && (
        <ViewCard title="Looking for">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            {prefs.desiredRoles.length > 0 && (
              <div><dt className="text-ink-muted">Roles</dt><dd className="mt-1 text-ink">{prefs.desiredRoles.join(', ')}</dd></div>
            )}
            {prefs.workTypes.length > 0 && (
              <div><dt className="text-ink-muted">Type of work</dt><dd className="mt-1 text-ink">{prefs.workTypes.join(', ')}</dd></div>
            )}
            {prefs.arrangements.length > 0 && (
              <div><dt className="text-ink-muted">Where</dt><dd className="mt-1 text-ink">{prefs.arrangements.join(', ')}</dd></div>
            )}
          </dl>
        </ViewCard>
      )}

      <ProfileExtrasSections extras={profile} />

      {profile.skills.length > 0 && (
        <ViewCard title="Skills">
          <SkillList skills={profile.skills} />
        </ViewCard>
      )}

      {profile.interests.length > 0 && (
        <ViewCard title="Career interests">
          <SkillList skills={profile.interests} />
        </ViewCard>
      )}
    </div>
  );
}
