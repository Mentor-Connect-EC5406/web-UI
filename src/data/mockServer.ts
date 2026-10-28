import type { Review } from '@/types';
import { MENTORS, MENTOR_SLOTS, REVIEWS, SAVED_MENTOR_IDS } from '@/mocks/mentors';
import { CONVERSATIONS, MESSAGE_CONTACTS } from '@/mocks/messages';
import { BOOKING_REQUESTS, GOALS, MENTOR_SESSIONS, STUDENT_SESSIONS } from '@/mocks/sessions';
import { ADMIN_STATS, MANAGED_USERS, MENTOR_APPLICATIONS, REPORTS } from '@/mocks/admin';
import { DEMO_USERS, STUDENT_PROFILE } from '@/mocks/users';

// fake backend with mutable in-memory state until the real API replaces the api objects in src/data

export const db = {
  mentors: structuredClone(MENTORS),
  reviews: structuredClone(REVIEWS),
  slots: structuredClone(MENTOR_SLOTS),
  studentSessions: structuredClone(STUDENT_SESSIONS),
  mentorSessions: structuredClone(MENTOR_SESSIONS),
  bookingRequests: structuredClone(BOOKING_REQUESTS),
  goals: structuredClone(GOALS),
  applications: structuredClone(MENTOR_APPLICATIONS),
  reports: structuredClone(REPORTS),
  users: structuredClone(MANAGED_USERS),
  savedMentorIds: [...SAVED_MENTOR_IDS],
  // reviews written in this session per mentor, shown before the sample reviews
  newReviews: {} as Record<string, Review[]>,
  conversations: structuredClone(CONVERSATIONS),
  contacts: structuredClone(MESSAGE_CONTACTS),
  adminStats: { ...ADMIN_STATS },
  studentProfile: structuredClone(STUDENT_PROFILE),
  // the demo mentor account owns this record in the mentor list
  myMentorId: DEMO_USERS.MENTOR.id,
};

// long enough to see loading states while designing
const LATENCY_MS = 600;

// add ?mockError to the URL to force reads to fail and preview error states
const shouldFail = () => new URLSearchParams(window.location.search).has('mockError');

// returns a deep copy so mutations on the result do not corrupt the in-memory store
export async function respond<T>(read: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  if (shouldFail()) throw new Error('The server could not be reached.');
  return structuredClone(read());
}

export async function mutate(change: () => void): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  change();
}
