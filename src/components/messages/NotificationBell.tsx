import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Handshake, MessageSquare, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { AppNotification, ConversationSummary, NotificationTopic } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { cn } from '@/lib/cn';
import { formatMessageTime } from '@/lib/format';

interface NotificationBellProps {
  // newest first, undefined while loading
  notifications?: AppNotification[];
  conversations?: ConversationSummary[];
  // across the whole inbox, not only the previewed conversations
  unreadMessages: number;
  currentUserId: string;
  notificationHref: (notification: AppNotification) => string | null;
  conversationHref: (id: string) => string;
  allMessagesHref: string;
  onOpenNotification: (notification: AppNotification) => void;
  onMarkAllRead: () => void;
  markingAll?: boolean;
}

const TOPIC_ICONS: Record<NotificationTopic, LucideIcon> = {
  session: Calendar,
  mentorship: Handshake,
  verification: ShieldCheck,
  message: MessageSquare,
  other: Bell,
};

const rowClasses = (unread: boolean) =>
  cn('flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-subtle', unread && 'bg-brand-soft/40');

function Empty({ children }: { children: ReactNode }) {
  return <p className="px-4 py-6 text-center text-sm text-ink-secondary">{children}</p>;
}

// header bell with booking and mentorship updates in one tab and recent messages in the other
export function NotificationBell(props: NotificationBellProps) {
  const { notifications, conversations, unreadMessages, currentUserId, notificationHref, conversationHref, allMessagesHref, onOpenNotification, onMarkAllRead, markingAll } = props;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const unreadUpdates = notifications?.filter((n) => !n.read).length ?? 0;
  const unread = unreadUpdates + unreadMessages;

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

  function openNotification(n: AppNotification) {
    if (!n.read) onOpenNotification(n);
    if (notificationHref(n)) setOpen(false);
  }

  function updateRow(n: AppNotification) {
    const Icon = TOPIC_ICONS[n.topic];
    const href = notificationHref(n);
    const content = (
      <>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-ink-secondary">
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className={cn('truncate text-sm text-ink', n.read ? 'font-medium' : 'font-semibold')}>{n.title}</span>
            <span className="shrink-0 text-xs text-ink-muted">{formatMessageTime(n.createdAt)}</span>
          </span>
          <span className="mt-0.5 flex items-start justify-between gap-2">
            <span className="line-clamp-2 text-xs text-ink-secondary">{n.message}</span>
            {!n.read && <Badge tone="brand" className="shrink-0">New</Badge>}
          </span>
        </span>
      </>
    );
    return href ? (
      <Link to={href} onClick={() => openNotification(n)} className={rowClasses(!n.read)}>{content}</Link>
    ) : (
      <button type="button" onClick={() => openNotification(n)} className={rowClasses(!n.read)}>{content}</button>
    );
  }

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
          className="absolute right-0 z-40 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-lg"
        >
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold text-ink">Notifications</h2>
            {unreadUpdates > 0 ? (
              <Button variant="ghost" size="sm" loading={markingAll} onClick={onMarkAllRead}>Mark all as read</Button>
            ) : (
              <span className="text-xs text-ink-muted">{unread > 0 ? `${unread} unread` : 'All caught up'}</span>
            )}
          </div>

          <Tabs defaultValue={unreadUpdates === 0 && unreadMessages > 0 ? 'messages' : 'updates'}>
            <TabsList className="mx-4 mt-3 flex">
              <TabsTrigger value="updates" className="flex-1">Updates{unreadUpdates > 0 && ` (${unreadUpdates})`}</TabsTrigger>
              <TabsTrigger value="messages" className="flex-1">Messages{unreadMessages > 0 && ` (${unreadMessages})`}</TabsTrigger>
            </TabsList>

            <TabsContent value="updates" className="mt-2">
              {notifications === undefined ? (
                <Empty>Loading…</Empty>
              ) : notifications.length === 0 ? (
                <Empty>No updates yet. Booking and session changes appear here.</Empty>
              ) : (
                <ul className="max-h-96 divide-y divide-line overflow-y-auto">
                  {notifications.map((n) => <li key={n.id}>{updateRow(n)}</li>)}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="messages" className="mt-2">
              {conversations === undefined ? (
                <Empty>Loading…</Empty>
              ) : conversations.length === 0 ? (
                <Empty>No messages yet.</Empty>
              ) : (
                <ul className="max-h-96 divide-y divide-line overflow-y-auto">
                  {conversations.map((c) => {
                    const mine = c.lastMessage?.senderId === currentUserId;
                    return (
                      <li key={c.id}>
                        <Link to={conversationHref(c.id)} onClick={() => setOpen(false)} className={rowClasses(c.unreadCount > 0)}>
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
              <Link to={allMessagesHref} onClick={() => setOpen(false)} className="block border-t border-line px-4 py-3 text-center text-sm font-medium text-info hover:bg-surface-subtle">
                See all messages
              </Link>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
