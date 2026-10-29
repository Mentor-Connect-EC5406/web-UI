export type SlotStatus = 'AVAILABLE' | 'HELD' | 'BOOKED' | 'BLOCKED';

export interface Slot {
  id: string;
  // ISO-8601 date-time string
  startsAt: string;
  endsAt: string;
  status: SlotStatus;
}

export type SessionStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Session {
  id: string;
  // ids link the session to the people in it, older records may only have names
  mentorId?: string;
  studentId?: string;
  mentorName: string;
  studentName: string;
  topic: string;
  startsAt: string;
  endsAt: string;
  status: SessionStatus;
  meetingUrl: string | null;
  price: number;
  // true once the student has reviewed a completed session
  reviewed?: boolean;
}

// what a student writes about a completed session
export interface SessionReviewInput {
  sessionId: string;
  rating: number;
  text: string;
}

// a student as the mentor sees them, built from the mentor's sessions
export interface MentoredStudent {
  // student id when known, otherwise the name
  key: string;
  studentId: string | null;
  name: string;
  sessionCount: number;
  lastSessionAt: string;
}

export interface Goal {
  id: string;
  title: string;
  // ISO date yyyy-mm-dd, null when the student has not set one
  targetDate: string | null;
  // 0 to 100
  progress: number;
}

export type GoalInput = Omit<Goal, 'id'>;
