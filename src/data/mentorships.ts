import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Mentorship, MentorshipRequestInput, MentorshipSchedule, MentorshipStatus, Weekday } from '@/types';
import { isFeatureOn } from '@/config/features';
import { api, listAll } from './http';
import { keys } from './keys';

// proposed api, see docs/API_HANDOFF.md "Long term mentorship"

interface MentorshipResponse {
  id: string;
  mentorId: string;
  mentorName: string | null;
  studentId: string;
  studentName: string | null;
  title: string;
  goals: string;
  durationMonths: number;
  status: MentorshipStatus;
  frequency: MentorshipSchedule['frequency'];
  weekday: number;
  dayOfMonth: number;
  time: string;
  startDate: string;
  timezone: string;
  declineReason: string | null;
  createdAt: string;
}

const toMentorship = (m: MentorshipResponse): Mentorship => ({
  id: m.id,
  mentorId: m.mentorId,
  mentorName: m.mentorName ?? 'Mentor',
  studentId: m.studentId,
  studentName: m.studentName ?? 'Student',
  title: m.title,
  goals: m.goals,
  durationMonths: m.durationMonths,
  status: m.status,
  schedule: {
    frequency: m.frequency,
    weekday: m.weekday as Weekday,
    dayOfMonth: m.dayOfMonth,
    time: m.time,
    startDate: m.startDate,
    timezone: m.timezone,
  },
  declineReason: m.declineReason,
  createdAt: m.createdAt,
});

const scheduleBody = (s: MentorshipSchedule) => ({ ...s });

export const mentorshipsApi = {
  // the caller's own, as student or mentor
  list: () => listAll<MentorshipResponse>('/api/mentorships').then((list) => list.map(toMentorship)),

  request: ({ mentorId, title, goals, durationMonths, schedule }: MentorshipRequestInput) =>
    api<MentorshipResponse>('/api/mentorships', {
      method: 'POST',
      body: { mentorId, title: title.trim(), goals: goals.trim(), durationMonths, ...scheduleBody(schedule) },
    }).then(toMentorship),

  withdraw: (id: string) => api<MentorshipResponse>(`/api/mentorships/${id}/withdraw`, { method: 'POST' }),

  // the mentor confirms or adjusts the schedule, the api then creates the sessions and their meeting links
  approve: ({ id, schedule }: { id: string; schedule: MentorshipSchedule }) =>
    api<MentorshipResponse>(`/api/mentorships/${id}/approve`, { method: 'POST', body: scheduleBody(schedule) }),

  decline: ({ id, reason }: { id: string; reason: string }) =>
    api<MentorshipResponse>(`/api/mentorships/${id}/decline`, { method: 'POST', body: { reason: reason.trim() || undefined } }),

  // either side, future sessions move and the other side is notified
  changeSchedule: ({ id, schedule }: { id: string; schedule: MentorshipSchedule }) =>
    api<MentorshipResponse>(`/api/mentorships/${id}/schedule`, { method: 'PUT', body: scheduleBody(schedule) }),

  cancel: ({ id, reason }: { id: string; reason: string }) =>
    api<MentorshipResponse>(`/api/mentorships/${id}/cancel`, { method: 'POST', body: { reason: reason.trim() || undefined } }),
};

export const useMentorships = () =>
  useQuery({ queryKey: keys.mentorships, queryFn: mentorshipsApi.list, enabled: isFeatureOn('mentorships') });

// sessions and notifications change with every mentorship decision
function useMentorshipMutation<T, R>(mutationFn: (input: T) => Promise<R>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: keys.mentorships }),
        client.invalidateQueries({ queryKey: ['sessions'] }),
        client.invalidateQueries({ queryKey: keys.notifications }),
      ]),
  });
}

export const useRequestMentorship = () => useMentorshipMutation(mentorshipsApi.request);
export const useWithdrawMentorship = () => useMentorshipMutation(mentorshipsApi.withdraw);
export const useApproveMentorship = () => useMentorshipMutation(mentorshipsApi.approve);
export const useDeclineMentorship = () => useMentorshipMutation(mentorshipsApi.decline);
export const useChangeMentorshipSchedule = () => useMentorshipMutation(mentorshipsApi.changeSchedule);
export const useCancelMentorship = () => useMentorshipMutation(mentorshipsApi.cancel);
