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
  cancellationReason?: string | null;
  // a pending request is released when the mentor has not answered by then
  expiresAt?: string | null;
  // set when the session belongs to a long term mentorship
  mentorshipId?: string | null;
}

// what the student sends with a booking
export interface BookingInput {
  slotId: string;
  topic: string;
}

export type SessionTaskType = 'HOMEWORK' | 'TARGET' | 'GOAL';

// homework, a target or a goal agreed for one session, either side can add them
export interface SessionTask {
  id: string;
  sessionId: string;
  type: SessionTaskType;
  title: string;
  details: string;
  // ISO date yyyy-mm-dd
  dueDate: string | null;
  done: boolean;
  createdBy: 'STUDENT' | 'MENTOR';
  createdByName: string;
  updatedAt: string;
}

export type SessionTaskInput = Pick<SessionTask, 'type' | 'title' | 'details' | 'dueDate'>;

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
