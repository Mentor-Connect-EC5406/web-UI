import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Contact, ConversationSummary, Message, Role } from '@/types';
import { fileUrl } from '@/config/env';
import { mentorsApi, toMentor, type MentorSummaryResponse } from './mentors';
import { sessionsApi } from './sessions';
import { api, listAll } from './http';
import { keys } from './keys';

interface ConversationResponse {
  id: string;
  with: { id: string; name: string; role: Role; profileImageKey: string | null } | null;
  lastMessage: { content: string; sentAt: string } | null;
  unreadCount: number;
}

interface MessageResponse {
  id: string;
  senderId: string;
  content: string;
  sentAt: string;
}

// the api does not say who sent the last message, so the inbox does not prefix it with "You"
const toSummary = (c: ConversationResponse & { with: NonNullable<ConversationResponse['with']> }): ConversationSummary => ({
  id: c.id,
  with: { id: c.with.id, name: c.with.name, role: c.with.role, avatarUrl: fileUrl(c.with.profileImageKey) },
  lastMessage: c.lastMessage && { id: `${c.id}-last`, senderId: '', text: c.lastMessage.content, sentAt: c.lastMessage.sentAt },
  unreadCount: c.unreadCount,
});

const toMessage = (m: MessageResponse): Message => ({ id: m.id, senderId: m.senderId, text: m.content, sentAt: m.sentAt });

const CONTACT_SEARCH_SIZE = 20;

async function mentorContacts(query: string): Promise<Contact[]> {
  const list = await listAll<MentorSummaryResponse>('/api/mentors', { query: query.trim(), size: CONTACT_SEARCH_SIZE });
  return list.map(toMentor).map((m) => ({
    id: m.id,
    mentorId: m.id,
    name: m.name,
    role: 'MENTOR',
    avatarUrl: m.avatarUrl,
    headline: [m.title, m.organization].filter(Boolean).join(' at '),
  }));
}

// mentors can message the students who booked them
async function studentContacts(query: string): Promise<Contact[]> {
  const sessions = await sessionsApi.forMentor();
  const q = query.trim().toLowerCase();
  const byId = new Map<string, Contact>();
  for (const s of sessions) {
    if (s.studentId && !byId.has(s.studentId)) {
      byId.set(s.studentId, { id: s.studentId, name: s.studentName, role: 'STUDENT', avatarUrl: null, headline: 'Student' });
    }
  }
  return [...byId.values()].filter((p) => !q || p.name.toLowerCase().includes(q));
}

export const messagesApi = {
  // newest activity first
  conversations: () =>
    api<ConversationResponse[]>('/api/conversations').then((list) =>
      list
        .filter((c): c is ConversationResponse & { with: NonNullable<ConversationResponse['with']> } => c.with !== null)
        .map(toSummary)
        .sort((a, b) => (b.lastMessage?.sentAt ?? '').localeCompare(a.lastMessage?.sentAt ?? '')),
    ),

  // students reach mentors, mentors reach their students
  contacts: (role: Role | undefined, query: string) => {
    if (role === 'STUDENT') return mentorContacts(query);
    if (role === 'MENTOR') return studentContacts(query);
    return Promise.resolve<Contact[]>([]);
  },

  // the api returns the newest page first, the thread reads oldest to newest
  messages: (conversationId: string) =>
    listAll<MessageResponse>(`/api/conversations/${conversationId}/messages`).then((list) => list.map(toMessage).reverse()),

  send: ({ conversationId, text }: { conversationId: string; senderId: string; text: string }) =>
    api<MessageResponse>(`/api/conversations/${conversationId}/messages`, { method: 'POST', body: { content: text.trim() } }),

  markRead: ({ conversationId }: { conversationId: string; userId: string }) =>
    api<void>(`/api/conversations/${conversationId}/read`, { method: 'PUT' }),

  // returns the existing conversation with the person or creates one, mentors are looked up by their account id
  start: async ({ otherId, mentorId }: { userId: string; otherId: string; mentorId?: string }) => {
    const participantId = mentorId ? (await mentorsApi.get(mentorId))?.userId : otherId;
    if (!participantId) throw new Error('This person cannot be messaged right now.');
    const conversation = await api<ConversationResponse>('/api/conversations', { method: 'POST', body: { participantId } });
    return conversation.id;
  },
};

export const useConversations = (userId: string) =>
  useQuery({ queryKey: keys.conversations(userId), queryFn: messagesApi.conversations, enabled: !!userId });

// keeps the last results on screen while the next search loads
export const useContacts = (role: Role | undefined, query: string, enabled = true) =>
  useQuery({
    queryKey: keys.contacts(role, query),
    queryFn: () => messagesApi.contacts(role, query),
    enabled: enabled && !!role,
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

// opens or reuses the conversation and posts the invitation, returns the conversation id
async function sendToPerson({ userId, otherId, text }: { userId: string; otherId: string; text: string }) {
  const conversationId = await messagesApi.start({ userId, otherId });
  await messagesApi.send({ conversationId, senderId: userId, text });
  return conversationId;
}

export function useSendToPerson() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: sendToPerson,
    onSuccess: (conversationId) =>
      Promise.all([
        client.invalidateQueries({ queryKey: keys.messages(conversationId) }),
        client.invalidateQueries({ queryKey: ['conversations'] }),
      ]),
  });
}

export function useStartConversation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.start,
    onSuccess: () => client.invalidateQueries({ queryKey: ['conversations'] }),
  });
}
