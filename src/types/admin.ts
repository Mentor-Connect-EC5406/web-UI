export interface MentorApplication {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  industry: string;
  experienceYears: number;
  submittedAt: string;
  documents: { name: string; type: string }[];
}

export interface Report {
  id: string;
  type: string;
  reporter: string;
  reportedUser: string;
  status: 'OPEN' | 'UNDER_REVIEW';
}

export interface AdminStats {
  users: string;
  mentors: string;
  bookings: string;
  revenue: string;
}
