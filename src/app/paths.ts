import type { Role } from '@/types';

// every URL in the app, use these instead of string literals
export const paths = {
  home: '/',
  howItWorks: '/#how-it-works',
  mentors: '/mentors',
  mentor: (id: string) => `/mentors/${id}`,
  login: '/login',
  signup: '/signup',
  onboarding: '/onboarding',
  forbidden: '/403',

  student: {
    home: '/student',
    mentors: '/student/mentors',
    mentor: (id: string) => `/student/mentors/${id}`,
    sessions: '/student/sessions',
    goals: '/student/goals',
    messages: '/student/messages',
    conversation: (id: string) => `/student/messages?c=${encodeURIComponent(id)}`,
    saved: '/student/saved',
    profile: '/student/profile',
    profilePreview: '/student/profile/preview',
  },

  mentorArea: {
    home: '/mentor',
    sessions: '/mentor/sessions',
    availability: '/mentor/availability',
    students: '/mentor/students',
    messages: '/mentor/messages',
    conversation: (id: string) => `/mentor/messages?c=${encodeURIComponent(id)}`,
    profile: '/mentor/profile',
  },

  admin: {
    home: '/admin',
    verification: '/admin/verification',
    users: '/admin/users',
    reports: '/admin/reports',
  },
} as const;

// where each role lands after signing in
export const homePathFor = (role: Role) =>
  ({ STUDENT: paths.student.home, MENTOR: paths.mentorArea.home, ADMIN: paths.admin.home })[role];
