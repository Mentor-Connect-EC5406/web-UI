import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseISO } from 'date-fns';
import type { Contact, ConversationRecord, ConversationSummary, Mentor } from '@/types';
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

const mentorContact = (m: Mentor): Contact => ({
  id: m.id,
  name: m.name,
  role: 'MENTOR',
  avatarUrl: m.avatarUrl,
  headline: `${m.title} at ${m.organization}`,
});

// students reach every mentor in the directory, mentors reach students
function contactsFor(userId: string): Contact[] {
  const mentors = db.mentors.map(mentorContact);
  const students = db.contacts.filter((p) => p.role === 'STUDENT').map((p) => ({ ...p, headline: 'Student' }));
  const isMentor = mentors.some((m) => m.id === userId);
  return (isMentor ? students : mentors).filter((p) => p.id !== userId);
}

const findPerson = (id: string) => db.contacts.find((p) => p.id === id) ?? db.mentors.map(mentorContact).find((m) => m.id === id);

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

  // people the user can message, filtered by name or headline
  contacts: (userId: string, query: string) =>
    respond(() => {
      const q = query.trim().toLowerCase();
      return contactsFor(userId).filter((p) => !q || `${p.name} ${p.headline}`.toLowerCase().includes(q));
    }),

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
      const [me, other] = [userId, otherId].map(findPerson);
      if (!me || !other) throw new Error('This person cannot be messaged yet.');
      // stored participants never carry the search headline
      const participants = [me, other].map(({ id, name, role, avatarUrl }) => ({ id, name, role, avatarUrl }));
      const id = `c-${Date.now()}`;
      db.conversations = [...db.conversations, { id, participants, messages: [], lastReadAt: {} }];
      return id;
    }),
};

export const useConversations = (userId: string) =>
  useQuery({ queryKey: keys.conversations(userId), queryFn: () => messagesApi.conversations(userId), enabled: !!userId });

// keeps the last results on screen while the next search loads
export const useContacts = (userId: string, query: string, enabled = true) =>
  useQuery({
    queryKey: keys.contacts(userId, query),
    queryFn: () => messagesApi.contacts(userId, query),
    enabled: enabled && !!userId,
    placeholderData: keepPreviousData,
  });

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
