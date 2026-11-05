import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import type { ConversationSummary } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { formatMessageTime } from '@/lib/format';

interface NotificationBellProps {
  // newest first, undefined while loading
  conversations?: ConversationSummary[];
  // across the whole inbox, not only the previewed conversations
  unread: number;
  currentUserId: string;
  conversationHref: (id: string) => string;
  allHref: string;
}

// header bell that previews recent messages, unread ones first get a "New" label
export function NotificationBell({ conversations, unread, currentUserId, conversationHref, allHref }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // close on outside click or Escape like a native menu
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Bell />
        {unread > 0 && (
          <span aria-hidden className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] leading-4 font-semibold text-ink">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold text-ink">Notifications</h2>
            <span className="text-xs text-ink-muted">{unread > 0 ? `${unread} unread` : 'All caught up'}</span>
          </div>

          {conversations === undefined ? (
            <p className="px-4 py-6 text-center text-sm text-ink-secondary">Loading…</p>
          ) : conversations.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink-secondary">No messages yet.</p>
          ) : (
            <ul className="max-h-96 divide-y divide-line overflow-y-auto">
              {conversations.map((c) => {
                const mine = c.lastMessage?.senderId === currentUserId;
                return (
                  <li key={c.id}>
                    <Link
                      to={conversationHref(c.id)}
                      onClick={() => setOpen(false)}
                      className={cn('flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-subtle', c.unreadCount > 0 && 'bg-brand-soft/40')}
                    >
                      <Avatar name={c.with.name} src={c.with.avatarUrl} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={cn('truncate text-sm text-ink', c.unreadCount ? 'font-semibold' : 'font-medium')}>{c.with.name}</span>
                          {c.lastMessage && <span className="shrink-0 text-xs text-ink-muted">{formatMessageTime(c.lastMessage.sentAt)}</span>}
                        </span>
                        <span className="mt-0.5 flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-ink-secondary">
                            {c.lastMessage ? `${mine ? 'You: ' : ''}${c.lastMessage.text}` : 'New conversation'}
                          </span>
                          {c.unreadCount > 0 && <Badge tone="brand" className="shrink-0">{c.unreadCount} new</Badge>}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <Link to={allHref} onClick={() => setOpen(false)} className="block border-t border-line px-4 py-3 text-center text-sm font-medium text-info hover:bg-surface-subtle">
            See all messages
          </Link>
        </div>
      )}
    </div>
  );
}
