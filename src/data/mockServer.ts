import { MENTORS, MENTOR_SLOTS, REVIEWS } from '@/mocks/mentors';
import { BOOKING_REQUESTS, GOALS, MENTOR_SESSIONS, STUDENT_SESSIONS } from '@/mocks/sessions';
import { ADMIN_STATS, MENTOR_APPLICATIONS, REPORTS } from '@/mocks/admin';

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
  adminStats: { ...ADMIN_STATS },
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
