import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import type { Language, LanguageLevel, ProfileLinks, ProfileVisibility, WorkPreferences } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { ChipToggleGroup } from '@/components/common/ChipToggleGroup';
import { FormField } from '@/components/common/FormField';
import { TagInput } from '@/components/common/TagInput';
import { LANGUAGE_LEVELS, WORK_ARRANGEMENTS, WORK_TYPES } from '@/config/options';
import { MAX_DESIRED_ROLES, MAX_LANGUAGES } from '@/config/constants';
import type { FieldErrors } from '@/lib/profile';
import { fieldAria } from '@/lib/fieldAria';
import { ProfileSection } from './ProfileSection';

interface LinksFieldsProps {
  links: ProfileLinks;
  onChange: (links: ProfileLinks) => void;
  errors: FieldErrors<keyof ProfileLinks>;
}

const LINK_FIELDS: { key: keyof ProfileLinks; label: string; placeholder: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/your-name' },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/your-name' },
  { key: 'website', label: 'Website or portfolio', placeholder: 'https://' },
];

export function LinksFields({ links, onChange, errors }: LinksFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {LINK_FIELDS.map(({ key, label, placeholder }) => (
        <FormField key={key} htmlFor={`link-${key}`} label={label} error={errors[key]}>
          <Input
            id={`link-${key}`}
            type="url"
            value={links[key]}
            placeholder={placeholder}
            onChange={(e) => onChange({ ...links, [key]: e.target.value })}
            {...fieldAria(`link-${key}`, errors[key])}
          />
        </FormField>
      ))}
    </div>
  );
}

interface LanguagesSectionProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

export function LanguagesSection({ languages, onChange }: LanguagesSectionProps) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<LanguageLevel | ''>('');
  const [error, setError] = useState<string | null>(null);
  const full = languages.length >= MAX_LANGUAGES;

  function add() {
    const trimmed = name.trim();
    if (!trimmed || !level) return setError('Enter a language and choose your level');
    if (languages.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) return setError(`${trimmed} is already listed`);
    onChange([...languages, { name: trimmed, level }]);
    setName('');
    setLevel('');
    setError(null);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // enter would otherwise submit the whole profile form
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  }

  return (
    <ProfileSection id="languages" title="Languages">
      {languages.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-2">
          {languages.map((l) => (
            <li key={l.name}>
              <Badge className="py-1 pr-1 text-sm">
                {l.name} · {l.level}
                <button
                  type="button"
                  aria-label={`Remove ${l.name}`}
                  onClick={() => onChange(languages.filter((x) => x.name !== l.name))}
                  className="rounded-full p-0.5 text-ink-muted hover:bg-surface-subtle hover:text-ink"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
        <FormField htmlFor="lang-name" label="Language">
          <Input id="lang-name" value={name} disabled={full} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. Tamil" />
        </FormField>
        <FormField htmlFor="lang-level" label="Level">
          <Select id="lang-level" placeholder="Choose level" options={LANGUAGE_LEVELS} value={level} onValueChange={(v) => setLevel(v as LanguageLevel)} />
        </FormField>
        <Button type="button" variant="secondary" disabled={full} onClick={add}>Add</Button>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-accent">{error}</p>}
      {full && <p className="mt-2 text-xs text-ink-muted">You can add up to {MAX_LANGUAGES} languages.</p>}
    </ProfileSection>
  );
}

interface WorkPreferencesSectionProps {
  value: WorkPreferences;
  onChange: (value: WorkPreferences) => void;
}

export function WorkPreferencesSection({ value, onChange }: WorkPreferencesSectionProps) {
  const set = (patch: Partial<WorkPreferences>) => onChange({ ...value, ...patch });
  return (
    <ProfileSection id="work-preferences" title="Work preferences" description="Tell mentors what kind of opportunities you are looking for.">
      <div className="space-y-5">
        <Switch
          id="open-to-work"
          label="Open to opportunities"
          description="Shows an Open to opportunities badge on your profile"
          checked={value.openToOpportunities}
          onCheckedChange={(openToOpportunities) => set({ openToOpportunities })}
        />
        <FormField htmlFor="desired-roles" label="Roles you are interested in" hint={`Press Enter after each role, up to ${MAX_DESIRED_ROLES}`}>
          <TagInput
            id="desired-roles"
            value={value.desiredRoles}
            onChange={(desiredRoles) => set({ desiredRoles })}
            max={MAX_DESIRED_ROLES}
            placeholder="e.g. Frontend engineer intern"
            describedBy="desired-roles-hint"
          />
        </FormField>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Type of work</legend>
          <ChipToggleGroup label="Type of work" options={WORK_TYPES} value={value.workTypes} onChange={(workTypes) => set({ workTypes })} />
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Where you can work</legend>
          <ChipToggleGroup
            label="Where you can work"
            options={WORK_ARRANGEMENTS}
            value={value.arrangements}
            onChange={(arrangements) => set({ arrangements })}
          />
        </fieldset>
      </div>
    </ProfileSection>
  );
}

interface VisibilitySectionProps {
  value: ProfileVisibility;
  onChange: (value: ProfileVisibility) => void;
}

export function VisibilitySection({ value, onChange }: VisibilitySectionProps) {
  const set = (patch: Partial<ProfileVisibility>) => onChange({ ...value, ...patch });
  return (
    <ProfileSection id="visibility" title="Privacy and visibility">
      <div className="space-y-5">
        <Switch
          id="profile-public"
          label="Public profile"
          description="When off, only you and mentors you book can see your profile"
          checked={value.isPublic}
          onCheckedChange={(isPublic) => set({ isPublic })}
        />
        <Switch
          id="show-email"
          label="Show email on profile"
          checked={value.showEmail}
          onCheckedChange={(showEmail) => set({ showEmail })}
        />
        <Switch
          id="show-phone"
          label="Show phone on profile"
          checked={value.showPhone}
          onCheckedChange={(showPhone) => set({ showPhone })}
        />
      </div>
    </ProfileSection>
  );
}
