import type { MentorApplication, Report } from '@/types';

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
  { id: 'rp1', type: 'Inappropriate behaviour', reporter: 'Student A', reportedUser: 'Mentor X', status: 'OPEN' },
  { id: 'rp2', type: 'Payment dispute', reporter: 'Student B', reportedUser: 'Mentor Y', status: 'UNDER_REVIEW' },
];

export const ADMIN_STATS = { users: '2,847', mentors: '512', bookings: '14,320', revenue: 'LKR 2.4M' };
