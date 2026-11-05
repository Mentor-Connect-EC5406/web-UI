import type { Role } from './user';

export interface Participant {
  id: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
}

// someone the user can start a new conversation with
export interface Contact extends Participant {
  // job title for mentors, shown under the name in search results
  headline: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  // ISO-8601 date-time string
  sentAt: string;
}

// a conversation as the signed in user sees it in their inbox
export interface ConversationSummary {
  id: string;
  with: Participant;
  lastMessage: Message | null;
  unreadCount: number;
}

// stored shape of a conversation, each user's inbox view is built from it
export interface ConversationRecord {
  id: string;
  participants: Participant[];
  messages: Message[];
  // when each participant last opened the conversation
  lastReadAt: Record<string, string>;
}
