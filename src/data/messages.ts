import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseISO } from 'date-fns';
import type { ConversationRecord, ConversationSummary, Participant } from '@/types';
import { MESSAGE_MAX_LENGTH } from '@/config/constants';
import { db, mutate, respond } from './mockServer';
import { keys } from './keys';

const time = (iso: string) => parseISO(iso).getTime();

function summarize(c: ConversationRecord, userId: string): ConversationSummary {
  const other = c.participants.find((p) => p.id !== userId) ?? c.participants[0];
  const lastRead = c.lastReadAt[userId];
  return {
    id: c.id,
    with: other,
    lastMessage: c.messages.at(-1) ?? null,
    unreadCount: c.messages.filter((m) => m.senderId !== userId && (!lastRead || time(m.sentAt) > time(lastRead))).length,
  };
}

const lastActivity = (c: ConversationSummary) => (c.lastMessage ? time(c.lastMessage.sentAt) : 0);

const findConversation = (conversationId: string) => {
  const c = db.conversations.find((x) => x.id === conversationId);
  if (!c) throw new Error('This conversation no longer exists.');
  return c;
};

// replace each function body with a real API call of the same signature
export const messagesApi = {
  // newest activity first
  conversations: (userId: string) =>
    respond(() =>
      db.conversations
        .filter((c) => c.participants.some((p) => p.id === userId))
        .map((c) => summarize(c, userId))
        .sort((a, b) => lastActivity(b) - lastActivity(a)),
    ),

  messages: (conversationId: string) => respond(() => findConversation(conversationId).messages),

  send: ({ conversationId, senderId, text }: { conversationId: string; senderId: string; text: string }) =>
    mutate(() => {
      const body = text.trim();
      if (!body) throw new Error('Write a message first.');
      if (body.length > MESSAGE_MAX_LENGTH) throw new Error(`Messages can be up to ${MESSAGE_MAX_LENGTH} characters.`);
      const c = findConversation(conversationId);
      const sentAt = new Date().toISOString();
      c.messages = [...c.messages, { id: `${conversationId}-${Date.now()}`, senderId, text: body, sentAt }];
      // sending a reply means the sender has seen everything before it
      c.lastReadAt = { ...c.lastReadAt, [senderId]: sentAt };
    }),

  markRead: ({ conversationId, userId }: { conversationId: string; userId: string }) =>
    mutate(() => {
      const c = findConversation(conversationId);
      const last = c.messages.at(-1);
      if (last) c.lastReadAt = { ...c.lastReadAt, [userId]: last.sentAt };
    }),

  // returns the existing conversation between the two people or creates an empty one
  start: ({ userId, otherId }: { userId: string; otherId: string }) =>
    respond(() => {
      const existing = db.conversations.find((c) => [userId, otherId].every((id) => c.participants.some((p) => p.id === id)));
      if (existing) return existing.id;
      const people = [userId, otherId].map((id) => db.contacts.find((p) => p.id === id));
      if (people.some((p) => !p)) throw new Error('This person cannot be messaged yet.');
      const id = `c-${Date.now()}`;
      db.conversations = [...db.conversations, { id, participants: people as Participant[], messages: [], lastReadAt: {} }];
      return id;
    }),
};

export const useConversations = (userId: string) =>
  useQuery({ queryKey: keys.conversations(userId), queryFn: () => messagesApi.conversations(userId) });

export const useMessages = (conversationId: string | null) =>
  useQuery({
    queryKey: keys.messages(conversationId ?? ''),
    queryFn: () => messagesApi.messages(conversationId ?? ''),
    enabled: !!conversationId,
  });

export function useSendMessage() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.send,
    onSuccess: (_, { conversationId }) =>
      Promise.all([
        client.invalidateQueries({ queryKey: keys.messages(conversationId) }),
        client.invalidateQueries({ queryKey: ['conversations'] }),
      ]),
  });
}

export function useMarkConversationRead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.markRead,
    onSuccess: () => client.invalidateQueries({ queryKey: ['conversations'] }),
  });
}

export function useStartConversation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.start,
    onSuccess: () => client.invalidateQueries({ queryKey: ['conversations'] }),
  });
}
