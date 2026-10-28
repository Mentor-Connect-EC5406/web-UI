import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import type { Mentor, SessionReviewInput, Slot } from '@/types';
import { CANCELLATION_WINDOW_HOURS } from '@/config/constants';
import { isInsideChangeWindow, validateReview } from '@/lib/sessions';
import { db, mutate, respond } from './mockServer';
import { keys } from './keys';

const sameTime = (a: string, b: string) => parseISO(a).getTime() === parseISO(b).getTime();

// replace each function body with a real API call of the same signature
export const sessionsApi = {
  forStudent: () => respond(() => db.studentSessions),
  forMentor: () => respond(() => db.mentorSessions),
  requests: () => respond(() => db.bookingRequests),

  cancel: (sessionId: string) =>
    mutate(() => {
      db.studentSessions = db.studentSessions.map((s) => (s.id === sessionId ? { ...s, status: 'CANCELLED' } : s));
    }),

  // both accept and decline remove the request from the queue
  respondToRequest: ({ requestId }: { requestId: string; accept: boolean }) =>
    mutate(() => { db.bookingRequests = db.bookingRequests.filter((r) => r.id !== requestId); }),

  // slot is held until the mentor accepts so it cannot be double booked
  book: ({ mentor, slot, studentName }: { mentor: Mentor; slot: Slot; studentName: string }) =>
    mutate(() => {
      db.slots = db.slots.map((s) => (s.id === slot.id ? { ...s, status: 'HELD' } : s));
      db.studentSessions = [
        ...db.studentSessions,
        {
          id: `b-${slot.id}`, mentorId: mentor.id, mentorName: mentor.name, studentName, topic: 'Mentoring session',
          startsAt: slot.startsAt, endsAt: slot.endsAt, status: 'PENDING', meetingUrl: null, price: mentor.hourlyRate,
        },
      ];
    }),

  // frees the old slot and takes the new one with the same hold or booking the session had
  reschedule: ({ sessionId, slotId }: { sessionId: string; slotId: string }) =>
    mutate(() => {
      const session = db.studentSessions.find((s) => s.id === sessionId);
      const slot = db.slots.find((s) => s.id === slotId);
      if (!session) throw new Error('This session no longer exists.');
      if (isInsideChangeWindow(session.startsAt)) {
        throw new Error(`Sessions cannot be moved less than ${CANCELLATION_WINDOW_HOURS} hours before they start.`);
      }
      if (!slot || slot.status !== 'AVAILABLE') throw new Error('That time was just taken. Choose another one.');
      const taken = session.status === 'CONFIRMED' ? 'BOOKED' : 'HELD';
      db.slots = db.slots.map((s) => {
        if (s.id === slot.id) return { ...s, status: taken };
        if (sameTime(s.startsAt, session.startsAt) && s.status !== 'BLOCKED') return { ...s, status: 'AVAILABLE' };
        return s;
      });
      db.studentSessions = db.studentSessions.map((s) =>
        s.id === sessionId ? { ...s, startsAt: slot.startsAt, endsAt: slot.endsAt } : s,
      );
    }),

  // the review is added to the mentor's profile and their average rating is recalculated
  review: ({ sessionId, rating, text }: SessionReviewInput) =>
    mutate(() => {
      const session = db.studentSessions.find((s) => s.id === sessionId);
      if (!session || session.status !== 'COMPLETED') throw new Error('Only completed sessions can be reviewed.');
      if (session.reviewed) throw new Error('You have already reviewed this session.');
      const errors = validateReview(rating, text);
      if (errors.rating || errors.text) throw new Error(errors.rating ?? errors.text);

      const mentor = db.mentors.find((m) => m.id === session.mentorId || m.name === session.mentorName);
      const [first, last = ''] = session.studentName.split(' ');
      if (mentor) {
        db.newReviews[mentor.id] = [
          { id: `r-${sessionId}`, author: `${first} ${last.charAt(0)}${last ? '.' : ''}`.trim(), rating, date: format(new Date(), 'd MMM yyyy'), text: text.trim() },
          ...(db.newReviews[mentor.id] ?? []),
        ];
        db.mentors = db.mentors.map((m) => {
          if (m.id !== mentor.id) return m;
          const reviewCount = m.reviewCount + 1;
          return { ...m, reviewCount, rating: Math.round(((m.rating * m.reviewCount + rating) / reviewCount) * 10) / 10 };
        });
      }
      db.studentSessions = db.studentSessions.map((s) => (s.id === sessionId ? { ...s, reviewed: true } : s));
    }),
};

export const useStudentSessions = () => useQuery({ queryKey: keys.studentSessions, queryFn: sessionsApi.forStudent });
export const useMentorSessions = () => useQuery({ queryKey: keys.mentorSessions, queryFn: sessionsApi.forMentor });
export const useBookingRequests = () => useQuery({ queryKey: keys.bookingRequests, queryFn: sessionsApi.requests });

export function useCancelSession() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.cancel,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.studentSessions }),
  });
}

export function useRespondToRequest() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.respondToRequest,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.bookingRequests }),
  });
}

export function useBookSession() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.book,
    onSuccess: () => Promise.all([
      client.invalidateQueries({ queryKey: ['slots'] }),
      client.invalidateQueries({ queryKey: keys.studentSessions }),
    ]),
  });
}

export function useRescheduleSession() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.reschedule,
    onSuccess: () => Promise.all([
      client.invalidateQueries({ queryKey: ['slots'] }),
      client.invalidateQueries({ queryKey: keys.studentSessions }),
    ]),
  });
}

export function useReviewSession() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.review,
    onSuccess: () => Promise.all([
      client.invalidateQueries({ queryKey: keys.studentSessions }),
      client.invalidateQueries({ queryKey: ['reviews'] }),
      client.invalidateQueries({ queryKey: ['mentor'] }),
      client.invalidateQueries({ queryKey: ['mentors'] }),
    ]),
  });
}
