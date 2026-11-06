import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BookingInput, Session, SessionReviewInput, SessionStatus } from '@/types';
import { fromCents } from '@/lib/format';
import { api, listAll } from './http';
import { keys } from './keys';

type BookingStatus = SessionStatus | 'RESCHEDULED' | 'NO_SHOW';

export interface BookingResponse {
  id: string;
  studentId: string;
  studentName: string | null;
  mentorId: string;
  mentorName: string | null;
  meetingUrl: string | null;
  reviewed: boolean;
  scheduledStart: string;
  scheduledEnd: string;
  topic: string | null;
  priceCents: number;
  status: BookingStatus;
  cancellationReason?: string | null;
  expiresAt?: string | null;
  // not sent by the api yet, see docs/API_HANDOFF.md
  mentorshipId?: string | null;
}

// a no show ends the session the same way a cancellation does
export const toSession = (b: BookingResponse): Session => ({
  id: b.id,
  mentorId: b.mentorId,
  studentId: b.studentId,
  mentorName: b.mentorName ?? 'Mentor',
  studentName: b.studentName ?? 'Student',
  topic: b.topic || 'Mentoring session',
  startsAt: b.scheduledStart,
  endsAt: b.scheduledEnd,
  status: b.status === 'NO_SHOW' ? 'CANCELLED' : (b.status as SessionStatus),
  meetingUrl: b.meetingUrl,
  price: fromCents(b.priceCents),
  reviewed: b.reviewed,
  cancellationReason: b.cancellationReason ?? null,
  expiresAt: b.expiresAt ?? null,
  mentorshipId: b.mentorshipId ?? null,
});

// a rescheduled booking is replaced by a new one, so only the new one is shown
const toSessions = (list: BookingResponse[]) => list.filter((b) => b.status !== 'RESCHEDULED').map(toSession);

// the api returns the caller's own bookings, as student or mentor from the token
const myBookings = (status?: BookingStatus) => listAll<BookingResponse>('/api/bookings', { status }).then(toSessions);

const withReason = (reason?: string) => (reason?.trim() ? { reason: reason.trim() } : undefined);

export const sessionsApi = {
  forStudent: () => myBookings(),
  forMentor: () => myBookings(),
  requests: () => myBookings('PENDING'),

  get: (sessionId: string) => api<BookingResponse>(`/api/bookings/${sessionId}`).then(toSession),

  // a pending request is withdrawn the same way a confirmed session is cancelled
  cancel: ({ sessionId, reason }: { sessionId: string; reason?: string }) =>
    api<BookingResponse>(`/api/bookings/${sessionId}/cancel`, { method: 'POST', body: withReason(reason) }),

  respondToRequest: ({ requestId, accept, reason }: { requestId: string; accept: boolean; reason?: string }) =>
    api<BookingResponse>(`/api/bookings/${requestId}/${accept ? 'accept' : 'decline'}`, {
      method: 'POST',
      body: accept ? undefined : withReason(reason),
    }),

  // the slot is held until the mentor accepts so it cannot be double booked
  book: ({ slotId, topic }: BookingInput) =>
    api<BookingResponse>('/api/bookings', { method: 'POST', body: { slotId, topic: topic.trim() || undefined } }).then(toSession),

  // students today, mentors once the api allows it (feature mentorReschedule)
  reschedule: ({ sessionId, slotId }: { sessionId: string; slotId: string }) =>
    api<BookingResponse>(`/api/bookings/${sessionId}/reschedule`, { method: 'POST', body: { slotId } }).then(toSession),

  // proposed endpoint, feature meetingLinkEdit
  updateMeetingLink: ({ sessionId, meetingUrl }: { sessionId: string; meetingUrl: string }) =>
    api<unknown>(`/api/bookings/${sessionId}/session`, { method: 'PUT', body: { meetingUrl: meetingUrl.trim() } }),

  // only the student can complete, and reviews need a completed session
  complete: (sessionId: string) => api<unknown>(`/api/bookings/${sessionId}/session/complete`, { method: 'POST' }),

  review: ({ sessionId, rating, text }: SessionReviewInput) =>
    api<unknown>(`/api/bookings/${sessionId}/review`, { method: 'POST', body: { rating, comment: text.trim() } }),
};

export const useStudentSessions = () => useQuery({ queryKey: keys.studentSessions, queryFn: sessionsApi.forStudent });
export const useMentorSessions = () => useQuery({ queryKey: keys.mentorSessions, queryFn: sessionsApi.forMentor });
export const useMySessions = (role: 'STUDENT' | 'MENTOR') =>
  useQuery<Session[]>({
    queryKey: role === 'STUDENT' ? keys.studentSessions : keys.mentorSessions,
    queryFn: role === 'STUDENT' ? sessionsApi.forStudent : sessionsApi.forMentor,
  });
export const useBookingRequests = () => useQuery({ queryKey: keys.bookingRequests, queryFn: sessionsApi.requests });
export const useSessionDetails = (sessionId: string) =>
  useQuery({ queryKey: keys.session(sessionId), queryFn: () => sessionsApi.get(sessionId), enabled: !!sessionId });

// every booking change can move a slot and creates a notification, so those refresh too
function useBookingMutation<T, R>(mutationFn: (input: T) => Promise<R>, extraKeys: readonly (readonly unknown[])[] = []) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: ['sessions'] }),
        client.invalidateQueries({ queryKey: ['session'] }),
        client.invalidateQueries({ queryKey: ['slots'] }),
        client.invalidateQueries({ queryKey: keys.notifications }),
        ...extraKeys.map((queryKey) => client.invalidateQueries({ queryKey })),
      ]),
  });
}

export const useCancelSession = () => useBookingMutation(sessionsApi.cancel);
export const useRespondToRequest = () => useBookingMutation(sessionsApi.respondToRequest);
export const useBookSession = () => useBookingMutation(sessionsApi.book);
export const useRescheduleSession = () => useBookingMutation(sessionsApi.reschedule);
export const useUpdateMeetingLink = () => useBookingMutation(sessionsApi.updateMeetingLink);
export const useCompleteSession = () => useBookingMutation(sessionsApi.complete);
export const useReviewSession = () => useBookingMutation(sessionsApi.review, [['reviews'], ['mentor'], ['mentors']]);
