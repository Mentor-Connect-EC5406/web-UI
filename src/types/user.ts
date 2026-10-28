import type { ProfileExtras, ProfileVisibility, WorkPreferences } from './profile';

export type Role = 'STUDENT' | 'MENTOR' | 'ADMIN';

// admin is excluded because those accounts are not self service
export type OnboardingRole = Exclude<Role, 'ADMIN'>;

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
}

// a person who signed up but has not completed the onboarding role choice yet
export interface NewAccount {
  name: string;
  email: string;
}

// what a student keeps on their profile, mentors see it when a session is booked
export interface StudentProfile extends ProfileExtras {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  university: string;
  degree: string;
  academicYear: string;
  // job fields from config options the student wants guidance in
  interests: string[];
  // data url in the mock until real uploads exist
  avatarUrl: string | null;
  skills: string[];
  workPreferences: WorkPreferences;
  visibility: ProfileVisibility;
}

// email comes from the sign in account so it is not editable here
export type StudentProfileUpdate = Omit<StudentProfile, 'email'>;
