import type { Contact } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ROLE_LABELS } from '@/config/options';
import { cn } from '@/lib/cn';

interface ContactListProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
  // the contact whose conversation is being opened
  pendingId?: string | null;
}

// search results in the new message dialog
export function ContactList({ contacts, onSelect, pendingId }: ContactListProps) {
  return (
    <ul aria-label="People" className="divide-y divide-line">
      {contacts.map((c) => {
        const busy = c.id === pendingId;
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onSelect(c)}
              disabled={!!pendingId}
              aria-busy={busy || undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-surface-subtle disabled:cursor-wait',
                busy && 'bg-brand-soft',
              )}
            >
              <Avatar name={c.name} src={c.avatarUrl} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">{c.name}</span>
                <span className="block truncate text-xs text-ink-secondary">{c.headline}</span>
              </span>
              <span className="shrink-0 text-xs text-ink-muted">{busy ? 'Opening…' : ROLE_LABELS[c.role]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
