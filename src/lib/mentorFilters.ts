import type { MentorFilterValues, MentorSort } from '@/types';

export const SORT_OPTIONS: { value: MentorSort; label: string }[] = [
  { value: 'rating', label: 'Top rated' },
  { value: 'price', label: 'Lowest price' },
  { value: 'experience', label: 'Most experienced' },
];

export const EMPTY_FILTERS: MentorFilterValues = { query: '', industries: [], minRating: '', maxRate: '', sort: 'rating' };
