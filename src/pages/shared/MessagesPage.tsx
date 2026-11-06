import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, MessagesSquare, SearchX, SquarePen } from 'lucide-react';
import type { Contact, ConversationSummary } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { ContactList } from '@/components/messages/ContactList';
import { ConversationList } from '@/components/messages/ConversationList';
import { MessageComposer } from '@/components/messages/MessageComposer';
import { MessageThread } from '@/components/messages/MessageThread';
import { useSession } from '@/auth/session';
import { useContacts, useConversations, useMarkConversationRead, useMessages, useSendMessage, useStartConversation } from '@/data/messages';
import { cn } from '@/lib/cn';

interface MessagesPageProps {
  // shown in the empty inbox to say who the user can talk to
  emptyHint: string;
  // who the new message search finds e.g. "mentors"
  contactNoun: string;
}

// inbox for students and mentors, two panes on desktop and list then thread on phones
export default function MessagesPage({ emptyHint, contactNoun }: MessagesPageProps) {
  const user = useSession((s) => s.user);
  const userId = user?.id ?? '';
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('c');
  const conversations = useConversations(userId);
  const messages = useMessages(selectedId);
  const send = useSendMessage();
  const markRead = useMarkConversationRead();
  const markReadNow = markRead.mutate;
  const start = useStartConversation();
  const [filter, setFilter] = useState('');
  const [composing, setComposing] = useState(false);
  const [contactQuery, setContactQuery] = useState('');
  const contacts = useContacts(user?.role, contactQuery, composing);

  const selected = conversations.data?.find((c) => c.id === selectedId) ?? null;
  const unread = conversations.data?.reduce((sum, c) => sum + c.unreadCount, 0);

  // opening a conversation clears its unread count
  const selectedUnread = selected?.unreadCount ?? 0;
  useEffect(() => {
    if (selectedId && selectedUnread > 0) markReadNow({ conversationId: selectedId, userId });
  }, [selectedId, selectedUnread, userId, markReadNow]);

  function select(id: string | null) {
    // keeps other url flags while switching conversations
    const next = new URLSearchParams(params);
    if (id) next.set('c', id);
    else next.delete('c');
    setParams(next);
  }

  function openNew() {
    start.reset();
    setContactQuery('');
    setComposing(true);
  }

  // reuses an existing conversation so the same person never appears twice
  function startWith(contact: Contact) {
    start.mutate(
      { userId, otherId: contact.id, mentorId: contact.mentorId },
      {
        onSuccess: (id) => {
          setComposing(false);
          setFilter('');
          select(id);
        },
      },
    );
  }

  const matching = (list: ConversationSummary[]) => {
    const q = filter.trim().toLowerCase();
    return list.filter((c) => c.with.name.toLowerCase().includes(q));
  };

  const newMessageButton = (
    <Button onClick={openNew}>
      <SquarePen /> New message
    </Button>
  );

  return (
    <div>
      <PageHeader
        title="Messages"
        description={unread === undefined ? 'Your conversations' : unread > 0 ? `${unread} unread ${unread === 1 ? 'message' : 'messages'}` : 'You are all caught up'}
        actions={newMessageButton}
      />

      <AsyncContent query={conversations} loading={<ListSkeleton rows={4} rowClassName="h-16" />}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState icon={MessagesSquare} title="No conversations yet" description={emptyHint} action={newMessageButton} />
          ) : (
            <Card className="grid h-[calc(100dvh-12rem)] min-h-104 overflow-hidden lg:grid-cols-[20rem_1fr]">
              <div className={cn('flex min-h-0 flex-col lg:border-r lg:border-line', selected && 'hidden lg:flex')}>
                <div className="border-b border-line p-3">
                  <SearchInput label="Search conversations" placeholder="Search by name" value={filter} onChange={(e) => setFilter(e.target.value)} />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {matching(list).length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-ink-secondary">No conversations match “{filter.trim()}”.</p>
                  ) : (
                    <ConversationList conversations={matching(list)} currentUserId={userId} selectedId={selectedId} onSelect={select} />
                  )}
                </div>
              </div>

              <div className={cn('min-h-0', !selected && 'hidden lg:block')}>
                {selected ? (
                  <MessageThread
                    participant={selected.with}
                    messages={messages.data}
                    currentUserId={userId}
                    onBack={() => select(null)}
                    status={
                      messages.isPending ? (
                        <ListSkeleton rows={3} rowClassName="h-12" />
                      ) : messages.error ? (
                        <ErrorState message={messages.error.message} onRetry={() => messages.refetch()} />
                      ) : undefined
                    }
                    composer={
                      <MessageComposer
                        key={selected.id}
                        recipientName={selected.with.name}
                        onSend={(text) => send.mutateAsync({ conversationId: selected.id, senderId: userId, text })}
                      />
                    }
                  />
                ) : (
                  <EmptyState
                    icon={MessageSquare}
                    title="Select a conversation"
                    description="Choose someone from the list to read and reply to their messages."
                    className="h-full"
                  />
                )}
              </div>
            </Card>
          )
        }
      </AsyncContent>

      <Dialog open={composing} onClose={() => setComposing(false)} title="New message" description={`Search ${contactNoun} by name or role and start a conversation.`}>
        <SearchInput
          label={`Search ${contactNoun}`}
          placeholder={`Search ${contactNoun}`}
          value={contactQuery}
          onChange={(e) => setContactQuery(e.target.value)}
          autoFocus
        />
        {start.error && <p role="alert" className="mt-3 text-sm text-accent">{start.error.message}</p>}
        <div className="mt-3 h-80 overflow-y-auto">
          <AsyncContent query={contacts} loading={<ListSkeleton rows={4} rowClassName="h-14" />}>
            {(people) =>
              people.length === 0 ? (
                <EmptyState icon={SearchX} title={`No ${contactNoun} found`} description="Check the spelling or try a different name." className="py-10" />
              ) : (
                <ContactList contacts={people} onSelect={startWith} pendingId={start.isPending ? start.variables?.otherId : null} />
              )
            }
          </AsyncContent>
        </div>
      </Dialog>
    </div>
  );
}
