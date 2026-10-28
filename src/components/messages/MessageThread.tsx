import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Message, Participant } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ROLE_LABELS } from '@/config/options';
import { cn } from '@/lib/cn';
import { formatDateTime } from '@/lib/format';

interface MessageThreadProps {
  participant: Participant;
  // undefined while the messages load
  messages?: Message[];
  currentUserId: string;
  // back to the list on phones where only one pane fits
  onBack: () => void;
  // replaces the message list e.g. a skeleton or error
  status?: ReactNode;
  composer: ReactNode;
}

// one conversation with the newest message at the bottom
export function MessageThread({ participant, messages, currentUserId, onBack, status, composer }: MessageThreadProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // keep the latest message in view when the thread opens or grows
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages?.length, participant.id]);

  return (
    <section aria-label={`Conversation with ${participant.name}`} className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Button variant="ghost" size="icon" className="-ml-2 size-9 lg:hidden" aria-label="Back to conversations" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <Avatar name={participant.name} src={participant.avatarUrl} size="sm" />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-ink">{participant.name}</h2>
          <p className="text-xs text-ink-muted">{ROLE_LABELS[participant.role]}</p>
        </div>
      </header>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto bg-page/50 p-4">
        {status ?? (
          messages && messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-secondary">No messages yet. Say hello to {participant.name}.</p>
          ) : (
            <ol className="space-y-3" aria-live="polite">
              {messages?.map((m) => {
                const mine = m.senderId === currentUserId;
                return (
                  <li key={m.id} className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
                    <span className="sr-only">{mine ? 'You' : participant.name}:</span>
                    <p
                      className={cn(
                        'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm break-words whitespace-pre-wrap sm:max-w-[70%]',
                        mine ? 'rounded-br-md bg-brand-soft text-ink' : 'rounded-bl-md border border-line bg-surface text-ink',
                      )}
                    >
                      {m.text}
                    </p>
                    <span className="mt-1 text-[11px] text-ink-muted">{formatDateTime(m.sentAt)}</span>
                  </li>
                );
              })}
            </ol>
          )
        )}
      </div>

      {composer}
    </section>
  );
}
