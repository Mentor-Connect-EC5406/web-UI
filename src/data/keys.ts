import type { MentorFilterValues } from '@/types';

// centralised cache keys so mutations can invalidate by shared prefix
export const keys = {
  mentors: (filters?: MentorFilterValues) => ['mentors', filters] as const,
  mentor: (id: string) => ['mentor', id] as const,
  reviews: (mentorId: string) => ['reviews', mentorId] as const,
  slots: (mentorId: string) => ['slots', mentorId] as const,
  studentSessions: ['sessions', 'student'] as const,
  mentorSessions: ['sessions', 'mentor'] as const,
  bookingRequests: ['sessions', 'requests'] as const,
  goals: ['goals'] as const,
  adminStats: ['admin', 'stats'] as const,
  applications: ['admin', 'applications'] as const,
  reports: ['admin', 'reports'] as const,
};
