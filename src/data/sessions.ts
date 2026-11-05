import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Mentor, Session, SessionReviewInput, SessionStatus, Slot } from '@/types';
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
});

// a rescheduled booking is replaced by a new one, so only the new one is shown
const toSessions = (list: BookingResponse[]) => list.filter((b) => b.status !== 'RESCHEDULED').map(toSession);

// the api returns the caller's own bookings, as student or mentor from the token
const myBookings = (status?: BookingStatus) => listAll<BookingResponse>('/api/bookings', { status }).then(toSessions);

export const sessionsApi = {
  forStudent: () => myBookings(),
  forMentor: () => myBookings(),
  requests: () => myBookings('PENDING'),

  cancel: (sessionId: string) => api<BookingResponse>(`/api/bookings/${sessionId}/cancel`, { method: 'POST' }),

  respondToRequest: ({ requestId, accept }: { requestId: string; accept: boolean }) =>
    api<BookingResponse>(`/api/bookings/${requestId}/${accept ? 'accept' : 'decline'}`, { method: 'POST' }),

  // the slot is held until the mentor accepts so it cannot be double booked
  book: ({ slot }: { mentor: Mentor; slot: Slot; studentName: string }) =>
    api<BookingResponse>('/api/bookings', { method: 'POST', body: { slotId: slot.id } }),

  reschedule: ({ sessionId, slotId }: { sessionId: string; slotId: string }) =>
    api<BookingResponse>(`/api/bookings/${sessionId}/reschedule`, { method: 'POST', body: { slotId } }),

  // only the student can complete, and reviews need a completed session
  complete: (sessionId: string) => api<unknown>(`/api/bookings/${sessionId}/session/complete`, { method: 'POST' }),

  review: ({ sessionId, rating, text }: SessionReviewInput) =>
    api<unknown>(`/api/bookings/${sessionId}/review`, { method: 'POST', body: { rating, comment: text.trim() } }),
};

export const useStudentSessions = () => useQuery({ queryKey: keys.studentSessions, queryFn: sessionsApi.forStudent });
export const useMentorSessions = () => useQuery({ queryKey: keys.mentorSessions, queryFn: sessionsApi.forMentor });
export const useBookingRequests = () => useQuery({ queryKey: keys.bookingRequests, queryFn: sessionsApi.requests });

// every booking change can move a slot, so slots refresh with the sessions
function useBookingMutation<T, R>(mutationFn: (input: T) => Promise<R>, extraKeys: readonly (readonly unknown[])[] = []) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: ['sessions'] }),
        client.invalidateQueries({ queryKey: ['slots'] }),
        ...extraKeys.map((queryKey) => client.invalidateQueries({ queryKey })),
      ]),
  });
}

export const useCancelSession = () => useBookingMutation(sessionsApi.cancel);
export const useRespondToRequest = () => useBookingMutation(sessionsApi.respondToRequest);
export const useBookSession = () => useBookingMutation(sessionsApi.book);
export const useRescheduleSession = () => useBookingMutation(sessionsApi.reschedule);
export const useCompleteSession = () => useBookingMutation(sessionsApi.complete);
export const useReviewSession = () => useBookingMutation(sessionsApi.review, [['reviews'], ['mentor'], ['mentors']]);
