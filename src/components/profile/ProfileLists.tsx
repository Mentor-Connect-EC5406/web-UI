import type { ReactNode } from 'react';
import { Globe, Link2 } from 'lucide-react';
import type { Language, ProfileLinks } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { externalLinkClass } from './describeEntries';
import { EntryRow, type EntryRowProps } from './EntryRow';

interface EntryListProps<T extends { id: string }> {
  entries: readonly T[];
  describe: (entry: T) => EntryRowProps;
  actions?: (entry: T) => ReactNode;
}

export function EntryList<T extends { id: string }>({ entries, describe, actions }: EntryListProps<T>) {
  return (
    <ul className="divide-y divide-line">
      {entries.map((entry) => (
        <li key={entry.id} className="py-4 first:pt-0 last:pb-0">
          <EntryRow {...describe(entry)} actions={actions?.(entry)} />
        </li>
      ))}
    </ul>
  );
}

const LINK_LABELS: Record<keyof ProfileLinks, string> = { linkedin: 'LinkedIn', github: 'GitHub', website: 'Website' };

// brand icons are not used, the label says which site it is
export function LinkList({ links }: { links: ProfileLinks }) {
  const set = (Object.keys(LINK_LABELS) as (keyof ProfileLinks)[]).filter((k) => links[k].trim());
  if (set.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {set.map((key) => (
        <li key={key}>
          <a href={links[key]} target="_blank" rel="noreferrer" className={externalLinkClass}>
            {key === 'website' ? <Globe className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
            {LINK_LABELS[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function LanguageList({ languages }: { languages: readonly Language[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {languages.map((l) => (
        <li key={l.name}>
          <Badge className="py-1 text-sm">{l.name} · {l.level}</Badge>
        </li>
      ))}
    </ul>
  );
}

export function SkillList({ skills }: { skills: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {skills.map((s) => <li key={s}><Badge className="py-1 text-sm">{s}</Badge></li>)}
    </ul>
  );
}
