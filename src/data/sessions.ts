import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Mentor, Slot } from '@/types';
import { db, mutate, respond } from './mockServer';
import { keys } from './keys';

// replace each function body with a real API call of the same signature
export const sessionsApi = {
  forStudent: () => respond(() => db.studentSessions),
  forMentor: () => respond(() => db.mentorSessions),
  requests: () => respond(() => db.bookingRequests),
  goals: () => respond(() => db.goals),

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
          id: `b-${slot.id}`, mentorName: mentor.name, studentName, topic: 'Mentoring session',
          startsAt: slot.startsAt, endsAt: slot.endsAt, status: 'PENDING', meetingUrl: null, price: mentor.hourlyRate,
        },
      ];
    }),
};

export const useStudentSessions = () => useQuery({ queryKey: keys.studentSessions, queryFn: sessionsApi.forStudent });
export const useMentorSessions = () => useQuery({ queryKey: keys.mentorSessions, queryFn: sessionsApi.forMentor });
export const useBookingRequests = () => useQuery({ queryKey: keys.bookingRequests, queryFn: sessionsApi.requests });
export const useGoals = () => useQuery({ queryKey: keys.goals, queryFn: sessionsApi.goals });

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
