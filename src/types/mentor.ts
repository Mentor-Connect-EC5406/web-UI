import type { ProfileExtras } from './profile';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Mentor extends ProfileExtras {
  id: string;
  // the account behind the mentor profile, needed to message them; search results leave it out
  userId?: string;
  name: string;
  title: string;
  organization: string;
  industry: string;
  avatarUrl: string | null;
  bio: string;
  skills: string[];
  experienceYears: number;
  // price per session in the app currency
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  // only on full profiles, search results are always approved
  verificationStatus?: VerificationStatus;
}

// a document the mentor sent for admin review
export interface Verification {
  id: string;
  status: VerificationStatus;
  // the admin's reason when rejected
  reviewNote: string | null;
  submittedAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export type MentorSort = 'rating' | 'price' | 'experience';

// search criteria for the mentor list, empty strings mean any
export interface MentorFilterValues {
  query: string;
  industries: string[];
  minRating: string;
  maxRate: string;
  sort: MentorSort;
}

// fields a mentor edits on their own profile, rating and verification are not editable
export interface MentorProfileUpdate extends ProfileExtras {
  firstName: string;
  lastName: string;
  title: string;
  organization: string;
  industry: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  hourlyRate: number;
  avatarUrl: string | null;
}
