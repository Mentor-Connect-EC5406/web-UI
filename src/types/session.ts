export type SlotStatus = 'AVAILABLE' | 'HELD' | 'BOOKED' | 'BLOCKED';

export interface Slot {
  id: string;
  /** ISO-8601 date-time */
  startsAt: string;
  endsAt: string;
  status: SlotStatus;
}

export type SessionStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Session {
  id: string;
  mentorName: string;
  studentName: string;
  topic: string;
  startsAt: string;
  endsAt: string;
  status: SessionStatus;
  meetingUrl: string | null;
  price: number;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
}
