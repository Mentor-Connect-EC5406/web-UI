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
  // set for mentors from the directory, whose id is the mentor profile id and not the account id
  mentorId?: string;
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

