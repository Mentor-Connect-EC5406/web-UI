import type { ConversationSummary } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ROLE_LABELS } from '@/config/options';
import { cn } from '@/lib/cn';
import { formatMessageTime } from '@/lib/format';

interface ConversationListProps {
  conversations: ConversationSummary[];
  currentUserId: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// inbox list with the latest message preview and unread count per conversation
export function ConversationList({ conversations, currentUserId, selectedId, onSelect }: ConversationListProps) {
  return (
    <ul aria-label="Conversations" className="divide-y divide-line">
      {conversations.map((c) => {
        const mine = c.lastMessage?.senderId === currentUserId;
        const active = c.id === selectedId;
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              aria-current={active || undefined}
              className={cn(
                'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-subtle',
                active && 'bg-brand-soft hover:bg-brand-soft',
              )}
            >
              <Avatar name={c.with.name} src={c.with.avatarUrl} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={cn('truncate text-sm text-ink', c.unreadCount ? 'font-semibold' : 'font-medium')}>{c.with.name}</span>
                  {c.lastMessage && <span className="shrink-0 text-xs text-ink-muted">{formatMessageTime(c.lastMessage.sentAt)}</span>}
                </span>
                <span className="block text-xs text-ink-muted">{ROLE_LABELS[c.with.role]}</span>
                <span className="mt-1 flex items-center justify-between gap-2">
                  <span className={cn('truncate text-xs', c.unreadCount ? 'text-ink' : 'text-ink-secondary')}>
                    {c.lastMessage ? `${mine ? 'You: ' : ''}${c.lastMessage.text}` : 'No messages yet'}
                  </span>
                  {c.unreadCount > 0 && <Badge tone="brand" className="shrink-0">{c.unreadCount} new</Badge>}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
