import type { Certificate, EducationEntry, ExperienceEntry, Project } from '@/types';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import { MonthYearField } from '@/components/common/MonthYearField';
import { TagInput } from '@/components/common/TagInput';
import { MAX_ENTRY_DESCRIPTION_LENGTH, MAX_SKILLS } from '@/config/constants';
import { fieldAria } from '@/lib/fieldAria';
import { validateCertificate, validateEducation, validateExperience, validateProject, yearOptions } from '@/lib/profile';
import { EntryDialog } from './EntryDialog';
import { EntrySection } from './EntrySection';
import {
  describeCertificate,
  describeEducation,
  describeExperience,
  describeProject,
  orderCertificates,
  orderEducation,
  orderExperience,
} from './describeEntries';

interface ListProps<T> {
  entries: T[];
  onChange: (entries: T[]) => void;
}

function CurrentCheckbox({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input id={id} type="checkbox" className="size-4 rounded accent-brand" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function ExperienceSection({ entries, onChange }: ListProps<ExperienceEntry>) {
  return (
    <EntrySection
      id="experience"
      title="Experience"
      noun="experience"
      emptyText="Add internships, jobs or volunteering so others can see what you have worked on."
      entries={entries}
      onChange={onChange}
      order={orderExperience}
      describe={describeExperience}
      create={() => ({ id: crypto.randomUUID(), role: '', organization: '', startMonth: '', endMonth: '', description: '' })}
      renderDialog={({ entry, isNew, onSave, onClose }) => (
        <EntryDialog title={isNew ? 'Add experience' : 'Edit experience'} entry={entry} validate={validateExperience} onSave={onSave} onClose={onClose}>
          {(d, set, errors) => (
            <>
              <FormField htmlFor="exp-role" label="Role" required error={errors.role}>
                <Input id="exp-role" value={d.role} onChange={(e) => set({ role: e.target.value })} placeholder="e.g. Software Engineering Intern" {...fieldAria('exp-role', errors.role)} />
              </FormField>
              <FormField htmlFor="exp-org" label="Organisation" required error={errors.organization}>
                <Input id="exp-org" value={d.organization} onChange={(e) => set({ organization: e.target.value })} {...fieldAria('exp-org', errors.organization)} />
              </FormField>
              <CurrentCheckbox
                id="exp-current"
                label="I currently work here"
                checked={d.endMonth === null}
                onChange={(current) => set({ endMonth: current ? null : '' })}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField htmlFor="exp-start" label="Start date" required error={errors.startMonth}>
                  <MonthYearField id="exp-start" label="Start date" value={d.startMonth} onChange={(startMonth) => set({ startMonth })} />
                </FormField>
                {d.endMonth !== null && (
                  <FormField htmlFor="exp-end" label="End date" required error={errors.endMonth}>
                    <MonthYearField id="exp-end" label="End date" value={d.endMonth} onChange={(endMonth) => set({ endMonth })} />
                  </FormField>
                )}
              </div>
              <FormField htmlFor="exp-desc" label="Description" error={errors.description} hint={`${d.description.length} / ${MAX_ENTRY_DESCRIPTION_LENGTH}`}>
                <Textarea
                  id="exp-desc"
                  {...fieldAria('exp-desc', errors.description, true)}
                  value={d.description}
                  maxLength={MAX_ENTRY_DESCRIPTION_LENGTH}
                  onChange={(e) => set({ description: e.target.value })}
                  placeholder="What you did and what you learned"
                />
              </FormField>
            </>
          )}
        </EntryDialog>
      )}
    />
  );
}

export function EducationSection({ entries, onChange }: ListProps<EducationEntry>) {
  const years = yearOptions();
  return (
    <EntrySection
      id="education"
      title="Education"
      noun="education"
      emptyText="Add your university, school or other qualifications."
      entries={entries}
      onChange={onChange}
      order={orderEducation}
      describe={describeEducation}
      create={() => ({ id: crypto.randomUUID(), school: '', degree: '', field: '', startYear: '', endYear: '' })}
      renderDialog={({ entry, isNew, onSave, onClose }) => (
        <EntryDialog title={isNew ? 'Add education' : 'Edit education'} entry={entry} validate={validateEducation} onSave={onSave} onClose={onClose}>
          {(d, set, errors) => (
            <>
              <FormField htmlFor="edu-school" label="School or university" required error={errors.school}>
                <Input id="edu-school" value={d.school} onChange={(e) => set({ school: e.target.value })} {...fieldAria('edu-school', errors.school)} />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField htmlFor="edu-degree" label="Degree" required error={errors.degree}>
                  <Input id="edu-degree" value={d.degree} onChange={(e) => set({ degree: e.target.value })} placeholder="e.g. BSc" {...fieldAria('edu-degree', errors.degree)} />
                </FormField>
                <FormField htmlFor="edu-field" label="Field of study">
                  <Input id="edu-field" value={d.field} onChange={(e) => set({ field: e.target.value })} placeholder="e.g. Computer Science" />
                </FormField>
              </div>
              <CurrentCheckbox
                id="edu-current"
                label="I am currently studying here"
                checked={d.endYear === null}
                onChange={(current) => set({ endYear: current ? null : '' })}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField htmlFor="edu-start" label="Start year" required error={errors.startYear}>
                  <Select id="edu-start" placeholder="Year" options={years} value={d.startYear} onValueChange={(startYear) => set({ startYear })} />
                </FormField>
                {d.endYear !== null && (
                  <FormField htmlFor="edu-end" label="End year (or expected)" required error={errors.endYear}>
                    <Select id="edu-end" placeholder="Year" options={years} value={d.endYear} onValueChange={(endYear) => set({ endYear })} />
                  </FormField>
                )}
              </div>
            </>
          )}
        </EntryDialog>
      )}
    />
  );
}

export function CertificatesSection({ entries, onChange }: ListProps<Certificate>) {
  return (
    <EntrySection
      id="certificates"
      title="Licenses and certificates"
      noun="certificate"
      emptyText="Add course certificates, licenses or awards."
      entries={entries}
      onChange={onChange}
      order={orderCertificates}
      describe={describeCertificate}
      create={() => ({ id: crypto.randomUUID(), name: '', issuer: '', issuedMonth: '', credentialUrl: '' })}
      renderDialog={({ entry, isNew, onSave, onClose }) => (
        <EntryDialog title={isNew ? 'Add certificate' : 'Edit certificate'} entry={entry} validate={validateCertificate} onSave={onSave} onClose={onClose}>
          {(d, set, errors) => (
            <>
              <FormField htmlFor="cert-name" label="Name" required error={errors.name}>
                <Input id="cert-name" value={d.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Google Data Analytics" {...fieldAria('cert-name', errors.name)} />
              </FormField>
              <FormField htmlFor="cert-issuer" label="Issued by" required error={errors.issuer}>
                <Input id="cert-issuer" value={d.issuer} onChange={(e) => set({ issuer: e.target.value })} {...fieldAria('cert-issuer', errors.issuer)} />
              </FormField>
              <FormField htmlFor="cert-date" label="Issue date" required error={errors.issuedMonth}>
                <MonthYearField id="cert-date" label="Issue date" value={d.issuedMonth} onChange={(issuedMonth) => set({ issuedMonth })} />
              </FormField>
              <FormField htmlFor="cert-url" label="Credential link" error={errors.credentialUrl} hint="Optional, where others can check the certificate">
                <Input id="cert-url" type="url" value={d.credentialUrl} onChange={(e) => set({ credentialUrl: e.target.value })} placeholder="https://" {...fieldAria('cert-url', errors.credentialUrl, true)} />
              </FormField>
            </>
          )}
        </EntryDialog>
      )}
    />
  );
}

export function ProjectsSection({ entries, onChange }: ListProps<Project>) {
  return (
    <EntrySection
      id="projects"
      title="Projects"
      noun="project"
      emptyText="Show coursework, side projects or hackathon work."
      entries={entries}
      onChange={onChange}
      order={(list) => [...list]}
      describe={describeProject}
      create={() => ({ id: crypto.randomUUID(), title: '', description: '', url: '', skills: [] })}
      renderDialog={({ entry, isNew, onSave, onClose }) => (
        <EntryDialog title={isNew ? 'Add project' : 'Edit project'} entry={entry} validate={validateProject} onSave={onSave} onClose={onClose}>
          {(d, set, errors) => (
            <>
              <FormField htmlFor="proj-title" label="Title" required error={errors.title}>
                <Input id="proj-title" value={d.title} onChange={(e) => set({ title: e.target.value })} {...fieldAria('proj-title', errors.title)} />
              </FormField>
              <FormField htmlFor="proj-desc" label="Description" error={errors.description} hint={`${d.description.length} / ${MAX_ENTRY_DESCRIPTION_LENGTH}`}>
                <Textarea id="proj-desc" {...fieldAria('proj-desc', errors.description, true)} value={d.description} maxLength={MAX_ENTRY_DESCRIPTION_LENGTH} onChange={(e) => set({ description: e.target.value })} />
              </FormField>
              <FormField htmlFor="proj-url" label="Project link" error={errors.url} hint="Optional, e.g. a GitHub repo or live demo">
                <Input id="proj-url" type="url" value={d.url} onChange={(e) => set({ url: e.target.value })} placeholder="https://" {...fieldAria('proj-url', errors.url, true)} />
              </FormField>
              <FormField htmlFor="proj-skills" label="Skills used" hint="Press Enter after each skill">
                <TagInput id="proj-skills" value={d.skills} onChange={(skills) => set({ skills })} max={MAX_SKILLS} placeholder="e.g. Python" />
              </FormField>
            </>
          )}
        </EntryDialog>
      )}
    />
  );
}
