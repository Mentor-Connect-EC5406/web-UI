import type { Role } from './user';

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

export type ReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface Report {
  id: string;
  type: string;
  reporter: string;
  reportedUser: string;
  status: ReportStatus;
  // what the reporter wrote
  details: string;
  // ISO-8601 date-time string
  createdAt: string;
  // the admin's note once the report is resolved or dismissed
  resolutionNote: string | null;
}

export interface ReportDecision {
  reportId: string;
  outcome: 'RESOLVED' | 'DISMISSED';
  note: string;
}

export type AccountStatus = 'ACTIVE' | 'SUSPENDED';

// a user account as the admin sees it
export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  // ISO date yyyy-mm-dd
  joinedAt: string;
}

export interface AdminStats {
  users: string;
  mentors: string;
  bookings: string;
  revenue: string;
}
