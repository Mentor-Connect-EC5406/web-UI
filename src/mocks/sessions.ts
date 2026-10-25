import type { Goal, Session } from '@/types';

export const STUDENT_SESSIONS: Session[] = [
  {
    id: 'b1', mentorName: 'Nimal Silva', studentName: 'Ashan Perera', topic: 'React architecture review',
    startsAt: '2026-11-03T10:00:00+05:30', endsAt: '2026-11-03T11:00:00+05:30',
    status: 'CONFIRMED', meetingUrl: 'https://meet.google.com/abc-defg-hij', price: 2500,
  },
  {
    id: 'b2', mentorName: 'Roshan Fernando', studentName: 'Ashan Perera', topic: 'ML project guidance',
    startsAt: '2026-11-06T13:00:00+05:30', endsAt: '2026-11-06T14:00:00+05:30',
    status: 'PENDING', meetingUrl: null, price: 3500,
  },
  {
    id: 'b3', mentorName: 'Priya Jayawardena', studentName: 'Ashan Perera', topic: 'Product manager career path',
    startsAt: '2026-10-15T11:30:00+05:30', endsAt: '2026-10-15T12:30:00+05:30',
    status: 'COMPLETED', meetingUrl: null, price: 3000,
  },
];

export const MENTOR_SESSIONS: Session[] = [
  {
    id: 'm1', mentorName: 'Nimal Silva', studentName: 'Kavya Gunawardena', topic: 'React architecture',
    startsAt: '2026-11-03T10:00:00+05:30', endsAt: '2026-11-03T11:00:00+05:30',
    status: 'CONFIRMED', meetingUrl: 'https://meet.google.com/abc-defg-hij', price: 2500,
  },
  {
    id: 'm2', mentorName: 'Nimal Silva', studentName: 'Dilan Rathnayake', topic: 'Career guidance',
    startsAt: '2026-11-03T14:00:00+05:30', endsAt: '2026-11-03T15:00:00+05:30',
    status: 'CONFIRMED', meetingUrl: null, price: 2500,
  },
];

export const BOOKING_REQUESTS: Session[] = [
  {
    id: 'q1', mentorName: 'Nimal Silva', studentName: 'Tharushi Senanayake', topic: 'UX portfolio review',
    startsAt: '2026-11-04T11:00:00+05:30', endsAt: '2026-11-04T12:00:00+05:30',
    status: 'PENDING', meetingUrl: null, price: 2500,
  },
];

export const GOALS: Goal[] = [
  { id: 'g1', title: 'Land a software engineering internship', progress: 65 },
  { id: 'g2', title: 'Build a full-stack portfolio project', progress: 40 },
  { id: 'g3', title: 'Improve data structures and algorithms', progress: 80 },
];
