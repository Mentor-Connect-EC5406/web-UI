import { Award, Briefcase, ExternalLink, FolderGit2, GraduationCap } from 'lucide-react';
import type { Certificate, EducationEntry, ExperienceEntry, Project } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { dateRange, formatMonth, monthSpan, sortEducation, sortExperience } from '@/lib/profile';
import type { EntryRowProps } from './EntryRow';

// turns each entry type into the rows shared by the editor and the read only views
export const externalLinkClass = 'inline-flex items-center gap-1 text-sm font-medium text-info hover:underline';

export function describeExperience(e: ExperienceEntry): EntryRowProps {
  const span = monthSpan(e.startMonth, e.endMonth);
  return {
    icon: Briefcase,
    title: e.role,
    subtitle: e.organization,
    meta: span ? `${dateRange(e.startMonth, e.endMonth)} · ${span}` : dateRange(e.startMonth, e.endMonth),
    body: e.description || undefined,
  };
}

export function describeEducation(e: EducationEntry): EntryRowProps {
  return {
    icon: GraduationCap,
    title: e.school,
    subtitle: [e.degree, e.field].filter(Boolean).join(', '),
    meta: dateRange(e.startYear, e.endYear, (y) => y),
  };
}

export function describeCertificate(c: Certificate): EntryRowProps {
  return {
    icon: Award,
    title: c.name,
    subtitle: c.issuer,
    meta: `Issued ${formatMonth(c.issuedMonth)}`,
    footer: c.credentialUrl ? (
      <a href={c.credentialUrl} target="_blank" rel="noreferrer" className={externalLinkClass}>
        Show credential <ExternalLink className="size-3.5" aria-hidden />
      </a>
    ) : undefined,
  };
}

export function describeProject(p: Project): EntryRowProps {
  return {
    icon: FolderGit2,
    title: p.url ? (
      <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
        {p.title} <ExternalLink className="size-3.5 text-ink-muted" aria-hidden />
      </a>
    ) : (
      p.title
    ),
    body: p.description || undefined,
    footer: p.skills.length > 0 ? (
      <ul className="flex flex-wrap gap-1.5" aria-label="Skills used">
        {p.skills.map((s) => <li key={s}><Badge>{s}</Badge></li>)}
      </ul>
    ) : undefined,
  };
}

// sorting lives here so the editor and the read only views show the same order
export const orderExperience = sortExperience<ExperienceEntry>;
export const orderEducation = sortEducation<EducationEntry>;
export const orderCertificates = (list: readonly Certificate[]) => [...list].sort((a, b) => b.issuedMonth.localeCompare(a.issuedMonth));

