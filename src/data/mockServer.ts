import { MENTORS, MENTOR_SLOTS, REVIEWS } from '@/mocks/mentors';
import { BOOKING_REQUESTS, GOALS, MENTOR_SESSIONS, STUDENT_SESSIONS } from '@/mocks/sessions';
import { ADMIN_STATS, MENTOR_APPLICATIONS, REPORTS } from '@/mocks/admin';

/**
 * Fake backend used until the real API is connected.
 * Holds an editable copy of the mock data so changes (cancel, accept, book…)
 * show up across pages until the browser is reloaded.
 * The API integration replaces the `api` objects in src/data/* and deletes this file.
 */

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

/** Simulated network delay so loading states are visible while designing */
const LATENCY_MS = 600;

/** Add `?mockError` to the URL to make every read fail and preview error states */
const shouldFail = () => new URLSearchParams(window.location.search).has('mockError');

/** Resolve a read after the simulated delay (returns a copy, like a real response) */
export async function respond<T>(read: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  if (shouldFail()) throw new Error('The server could not be reached.');
  return structuredClone(read());
}

/** Apply a change after the simulated delay */
export async function mutate(change: () => void): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  change();
}
