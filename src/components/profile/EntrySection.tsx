import { useState, type ReactNode } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MAX_PROFILE_ENTRIES } from '@/config/constants';
import type { EntryRowProps } from './EntryRow';
import { EntryList } from './ProfileLists';
import { ProfileSection } from './ProfileSection';

interface EntrySectionProps<T extends { id: string; }> {
  id: string;
  title: string;
  description?: string;
  // singular noun for buttons e.g. "experience"
  noun: string;
  emptyText: string;
  entries: T[];
  onChange: (entries: T[]) => void;
  order: (entries: readonly T[]) => T[];
  create: () => T;
  describe: (entry: T) => EntryRowProps;
  // the add or edit dialog for one entry
  renderDialog: (props: { entry: T; isNew: boolean; onSave: (entry: T) => void; onClose: () => void }) => ReactNode;
}

// list section with add, edit and remove, used for experience, education, certificates and projects
export function EntrySection<T extends { id: string }>(props: EntrySectionProps<T>) {
  const { id, title, description, noun, emptyText, entries, onChange, order, create, describe, renderDialog } = props;
  const [editing, setEditing] = useState<{ entry: T; isNew: boolean } | null>(null);
  const full = entries.length >= MAX_PROFILE_ENTRIES;

  function save(entry: T) {
    onChange(editing?.isNew ? [...entries, entry] : entries.map((e) => (e.id === entry.id ? entry : e)));
    setEditing(null);
  }

  return (
    <ProfileSection
      id={id}
      title={title}
      description={description}
      action={
        <Button type="button" variant="ghost" size="sm" disabled={full} onClick={() => setEditing({ entry: create(), isNew: true })}>
          <Plus aria-hidden /> Add {noun}
        </Button>
      }
    >
      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm text-ink-secondary">{emptyText}</p>
      ) : (
        <EntryList
          entries={order(entries)}
          describe={describe}
          actions={(entry) => (
            <>
              <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Edit ${noun}`} onClick={() => setEditing({ entry, isNew: false })}>
                <Pencil aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={`Remove ${noun}`}
                onClick={() => onChange(entries.filter((e) => e.id !== entry.id))}
              >
                <Trash2 aria-hidden />
              </Button>
            </>
          )}
        />
      )}
      {full && <p className="mt-3 text-xs text-ink-muted">You can add up to {MAX_PROFILE_ENTRIES}.</p>}
      {editing && renderDialog({ entry: editing.entry, isNew: editing.isNew, onSave: save, onClose: () => setEditing(null) })}
    </ProfileSection>
  );
}
