export interface Mentor {
  id: string;
  name: string;
  title: string;
  organization: string;
  industry: string;
  avatarUrl: string | null;
  bio: string;
  skills: string[];
  experienceYears: number;
  /** Price per session, in config CURRENCY */
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export type MentorSort = 'rating' | 'price' | 'experience';

/** Search criteria for the mentor list. Empty strings mean "any". */
export interface MentorFilterValues {
  query: string;
  industries: string[];
  minRating: string;
  maxRate: string;
  sort: MentorSort;
}
