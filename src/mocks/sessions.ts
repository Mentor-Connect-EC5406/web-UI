import type { Goal, Session } from '@/types';

export const STUDENT_SESSIONS: Session[] = [
  {
    id: 'b1', mentorId: 'mentor-1', studentId: 'student-1', mentorName: 'Nimal Silva', studentName: 'Ashan Perera',
    topic: 'React architecture review', startsAt: '2026-11-03T10:00:00+05:30', endsAt: '2026-11-03T11:00:00+05:30',
    status: 'CONFIRMED', meetingUrl: 'https://meet.google.com/abc-defg-hij', price: 2500,
  },
  {
    id: 'b2', mentorId: 'mentor-3', studentId: 'student-1', mentorName: 'Roshan Fernando', studentName: 'Ashan Perera',
    topic: 'ML project guidance', startsAt: '2026-11-06T13:00:00+05:30', endsAt: '2026-11-06T14:00:00+05:30',
    status: 'PENDING', meetingUrl: null, price: 3500,
  },
  {
    id: 'b3', mentorId: 'mentor-2', studentId: 'student-1', mentorName: 'Priya Jayawardena', studentName: 'Ashan Perera',
    topic: 'Product manager career path', startsAt: '2026-10-15T11:30:00+05:30', endsAt: '2026-10-15T12:30:00+05:30',
    status: 'COMPLETED', meetingUrl: null, price: 3000,
  },
  {
    id: 'b4', mentorId: 'mentor-4', studentId: 'student-1', mentorName: 'Chamari Wickramasinghe', studentName: 'Ashan Perera',
    topic: 'Design portfolio feedback', startsAt: '2026-09-24T16:00:00+05:30', endsAt: '2026-09-24T17:00:00+05:30',
    status: 'COMPLETED', meetingUrl: null, price: 2000, reviewed: true,
  },
];

export const MENTOR_SESSIONS: Session[] = [
  {
    id: 'm1', mentorId: 'mentor-1', studentId: 'student-2', mentorName: 'Nimal Silva', studentName: 'Kavya Gunawardena',
    topic: 'React architecture', startsAt: '2026-11-03T10:00:00+05:30', endsAt: '2026-11-03T11:00:00+05:30',
    status: 'CONFIRMED', meetingUrl: 'https://meet.google.com/abc-defg-hij', price: 2500,
  },
  {
    id: 'm2', mentorId: 'mentor-1', studentId: 'student-3', mentorName: 'Nimal Silva', studentName: 'Dilan Rathnayake',
    topic: 'Career guidance', startsAt: '2026-11-03T14:00:00+05:30', endsAt: '2026-11-03T15:00:00+05:30',
    status: 'CONFIRMED', meetingUrl: null, price: 2500,
  },
  {
    id: 'm3', mentorId: 'mentor-1', studentId: 'student-2', mentorName: 'Nimal Silva', studentName: 'Kavya Gunawardena',
    topic: 'Internship interview preparation', startsAt: '2026-10-20T09:00:00+05:30', endsAt: '2026-10-20T10:00:00+05:30',
    status: 'COMPLETED', meetingUrl: null, price: 2500,
  },
  {
    id: 'm4', mentorId: 'mentor-1', studentId: 'student-4', mentorName: 'Nimal Silva', studentName: 'Tharushi Senanayake',
    topic: 'Frontend learning plan', startsAt: '2026-10-12T15:00:00+05:30', endsAt: '2026-10-12T16:00:00+05:30',
    status: 'COMPLETED', meetingUrl: null, price: 2500,
  },
  {
    id: 'm5', mentorId: 'mentor-1', studentId: 'student-3', mentorName: 'Nimal Silva', studentName: 'Dilan Rathnayake',
    topic: 'CV review', startsAt: '2026-10-22T11:00:00+05:30', endsAt: '2026-10-22T12:00:00+05:30',
    status: 'CANCELLED', meetingUrl: null, price: 2500,
  },
  {
    id: 'm6', mentorId: 'mentor-1', studentId: 'student-1', mentorName: 'Nimal Silva', studentName: 'Ashan Perera',
    topic: 'Choosing a first engineering role', startsAt: '2026-10-05T10:00:00+05:30', endsAt: '2026-10-05T11:00:00+05:30',
    status: 'COMPLETED', meetingUrl: null, price: 2500,
  },
];

export const BOOKING_REQUESTS: Session[] = [
  {
    id: 'q1', mentorId: 'mentor-1', studentId: 'student-4', mentorName: 'Nimal Silva', studentName: 'Tharushi Senanayake',
    topic: 'UX portfolio review', startsAt: '2026-11-04T11:00:00+05:30', endsAt: '2026-11-04T12:00:00+05:30',
    status: 'PENDING', meetingUrl: null, price: 2500,
  },
];

export const GOALS: Goal[] = [
  { id: 'g1', title: 'Land a software engineering internship', targetDate: '2027-03-31', progress: 65 },
  { id: 'g2', title: 'Build a full-stack portfolio project', targetDate: '2026-12-20', progress: 40 },
  { id: 'g3', title: 'Improve data structures and algorithms', targetDate: null, progress: 80 },
];
