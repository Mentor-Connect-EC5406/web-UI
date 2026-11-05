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
  // from the identity provider when the person gave them at sign up
  firstName?: string;
  lastName?: string;
}

// what onboarding collects before the account is created
export type OnboardingDetails =
  | {
      role: 'STUDENT';
      firstName: string;
      lastName: string;
      university: string;
      faculty: string;
      // 1 for first year, the backend accepts 1 to 10
      academicYear: number | null;
    }
  | {
      role: 'MENTOR';
      firstName: string;
      lastName: string;
      title: string;
      organization: string;
      industry: string;
      experienceYears: number;
      bio: string;
    };

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
