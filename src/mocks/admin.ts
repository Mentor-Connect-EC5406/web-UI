import type { ManagedUser, MentorApplication, Report } from '@/types';

export const MENTOR_APPLICATIONS: MentorApplication[] = [
  {
    id: 'mv1', name: 'Kasun Perera', email: 'kasun@example.com', title: 'Senior Analyst',
    organization: 'WNS Lanka', industry: 'Data Science & AI', experienceYears: 6, submittedAt: '18 Oct 2026',
    documents: [{ name: 'NIC.pdf', type: 'Identity' }, { name: 'WorkID.pdf', type: 'Employment' }],
  },
  {
    id: 'mv2', name: 'Thisara Jayaweera', email: 'thisara@example.com', title: 'Tech Lead',
    organization: 'HCL Technologies', industry: 'Software Engineering', experienceYears: 9, submittedAt: '17 Oct 2026',
    documents: [{ name: 'Passport.pdf', type: 'Identity' }, { name: 'OfferLetter.pdf', type: 'Employment' }],
  },
];

export const REPORTS: Report[] = [
  {
    id: 'rp1', type: 'Inappropriate behaviour', reporter: 'Kavya Gunawardena', reportedUser: 'Amal Perera', status: 'OPEN',
    createdAt: '2026-10-26T14:20:00+05:30', resolutionNote: null,
    details: 'The mentor made dismissive comments about my university during the session and ended it 20 minutes early.',
  },
  {
    id: 'rp2', type: 'Payment dispute', reporter: 'Dilan Rathnayake', reportedUser: 'Kavindi Bandara', status: 'UNDER_REVIEW',
    createdAt: '2026-10-24T09:05:00+05:30', resolutionNote: null,
    details: 'I was charged for a session that the mentor did not join. I waited 30 minutes in the meeting link.',
  },
  {
    id: 'rp3', type: 'Spam messages', reporter: 'Priya Jayawardena', reportedUser: 'Ruwan Jayasuriya', status: 'OPEN',
    createdAt: '2026-10-27T18:40:00+05:30', resolutionNote: null,
    details: 'This student keeps sending the same promotional link to several mentors.',
  },
  {
    id: 'rp4', type: 'No show', reporter: 'Nimal Silva', reportedUser: 'Sahan Wijesinghe', status: 'RESOLVED',
    createdAt: '2026-10-10T11:00:00+05:30', resolutionNote: 'Student warned. Second no show will lead to suspension.',
    details: 'The student did not attend a confirmed session and did not reply to messages.',
  },
  {
    id: 'rp5', type: 'Profile information', reporter: 'Tharushi Senanayake', reportedUser: 'Chamari Wickramasinghe', status: 'DISMISSED',
    createdAt: '2026-10-08T16:30:00+05:30', resolutionNote: 'Employment verified with the documents on file.',
    details: 'I am not sure the company listed on this profile is correct.',
  },
];

export const MANAGED_USERS: ManagedUser[] = [
  { id: 'student-1', name: 'Ashan Perera', email: 'ashan@university.lk', role: 'STUDENT', status: 'ACTIVE', joinedAt: '2026-08-14' },
  { id: 'student-2', name: 'Kavya Gunawardena', email: 'kavya@university.lk', role: 'STUDENT', status: 'ACTIVE', joinedAt: '2026-08-02' },
  { id: 'student-3', name: 'Dilan Rathnayake', email: 'dilan@university.lk', role: 'STUDENT', status: 'ACTIVE', joinedAt: '2026-09-11' },
  { id: 'student-4', name: 'Tharushi Senanayake', email: 'tharushi@university.lk', role: 'STUDENT', status: 'ACTIVE', joinedAt: '2026-09-20' },
  { id: 'student-5', name: 'Ruwan Jayasuriya', email: 'ruwan@example.com', role: 'STUDENT', status: 'SUSPENDED', joinedAt: '2026-10-01' },
  { id: 'student-6', name: 'Sahan Wijesinghe', email: 'sahan@university.lk', role: 'STUDENT', status: 'ACTIVE', joinedAt: '2026-07-28' },
  { id: 'mentor-1', name: 'Nimal Silva', email: 'nimal@mentorconnect.app', role: 'MENTOR', status: 'ACTIVE', joinedAt: '2026-05-03' },
  { id: 'mentor-2', name: 'Priya Jayawardena', email: 'priya@example.com', role: 'MENTOR', status: 'ACTIVE', joinedAt: '2026-05-19' },
  { id: 'mentor-3', name: 'Roshan Fernando', email: 'roshan@example.com', role: 'MENTOR', status: 'ACTIVE', joinedAt: '2026-06-07' },
  { id: 'mentor-4', name: 'Chamari Wickramasinghe', email: 'chamari@example.com', role: 'MENTOR', status: 'ACTIVE', joinedAt: '2026-06-22' },
  { id: 'mentor-5', name: 'Amal Perera', email: 'amal@example.com', role: 'MENTOR', status: 'ACTIVE', joinedAt: '2026-07-09' },
  { id: 'mentor-6', name: 'Kavindi Bandara', email: 'kavindi@example.com', role: 'MENTOR', status: 'SUSPENDED', joinedAt: '2026-08-30' },
];

export const ADMIN_STATS = { users: '2,847', mentors: '512', bookings: '14,320', revenue: 'LKR 2.4M' };
