import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, MessagesSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { ConversationList } from '@/components/messages/ConversationList';
import { MessageComposer } from '@/components/messages/MessageComposer';
import { MessageThread } from '@/components/messages/MessageThread';
import { useSession } from '@/auth/session';
import { useConversations, useMarkConversationRead, useMessages, useSendMessage } from '@/data/messages';
import { cn } from '@/lib/cn';

interface MessagesPageProps {
  // shown in the empty inbox to say who the user can talk to
  emptyHint: string;
}

// inbox for students and mentors, two panes on desktop and list then thread on phones
export default function MessagesPage({ emptyHint }: MessagesPageProps) {
  const user = useSession((s) => s.user);
  const userId = user?.id ?? '';
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('c');
  const conversations = useConversations(userId);
  const messages = useMessages(selectedId);
  const send = useSendMessage();
  const markRead = useMarkConversationRead();
  const markReadNow = markRead.mutate;

  const selected = conversations.data?.find((c) => c.id === selectedId) ?? null;
  const unread = conversations.data?.reduce((sum, c) => sum + c.unreadCount, 0);

  // opening a conversation clears its unread count
  const selectedUnread = selected?.unreadCount ?? 0;
  useEffect(() => {
    if (selectedId && selectedUnread > 0) markReadNow({ conversationId: selectedId, userId });
  }, [selectedId, selectedUnread, userId, markReadNow]);

  function select(id: string | null) {
    // keeps mockError and other flags while switching conversations
    const next = new URLSearchParams(params);
    if (id) next.set('c', id);
    else next.delete('c');
    setParams(next);
  }

  return (
    <div>
      <PageHeader
        title="Messages"
        description={unread === undefined ? 'Your conversations' : unread > 0 ? `${unread} unread ${unread === 1 ? 'message' : 'messages'}` : 'You are all caught up'}
      />

      <AsyncContent query={conversations} loading={<ListSkeleton rows={4} rowClassName="h-16" />}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState icon={MessagesSquare} title="No conversations yet" description={emptyHint} />
          ) : (
            <Card className="grid h-[calc(100dvh-12rem)] min-h-104 overflow-hidden lg:grid-cols-[20rem_1fr]">
              <div className={cn('min-h-0 overflow-y-auto lg:border-r lg:border-line', selected && 'hidden lg:block')}>
                <ConversationList conversations={list} currentUserId={userId} selectedId={selectedId} onSelect={select} />
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
    </div>
  );
}
