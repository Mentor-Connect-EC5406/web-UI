import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Mentor, MentorFilterValues, MentorSort } from '@/types';
import { db, mutate, respond } from './mockServer';
import { keys } from './keys';

const sorters: Record<MentorSort, (a: Mentor, b: Mentor) => number> = {
  rating: (a, b) => b.rating - a.rating,
  price: (a, b) => a.hourlyRate - b.hourlyRate,
  experience: (a, b) => b.experienceYears - a.experienceYears,
};

// replace each function body with a real API call of the same signature
export const mentorsApi = {
  search: (f: MentorFilterValues) =>
    respond(() => {
      const q = f.query.trim().toLowerCase();
      return db.mentors
        .filter((m) => !q || [m.name, m.title, m.organization, ...m.skills].some((v) => v.toLowerCase().includes(q)))
        .filter((m) => f.industries.length === 0 || f.industries.includes(m.industry))
        .filter((m) => !f.minRating || m.rating >= Number(f.minRating))
        .filter((m) => !f.maxRate || m.hourlyRate <= Number(f.maxRate))
        .sort(sorters[f.sort]);
    }),
  get: (id: string) => respond(() => db.mentors.find((m) => m.id === id) ?? null),
  reviews: (_mentorId: string) => respond(() => db.reviews),
  slots: (_mentorId: string) => respond(() => db.slots),
  removeSlot: (slotId: string) => mutate(() => { db.slots = db.slots.filter((s) => s.id !== slotId); }),
};

export const useMentors = (filters: MentorFilterValues) =>
  useQuery({ queryKey: keys.mentors(filters), queryFn: () => mentorsApi.search(filters), placeholderData: (prev) => prev });

export const useMentor = (id: string) =>
  useQuery({ queryKey: keys.mentor(id), queryFn: () => mentorsApi.get(id) });

export const useMentorReviews = (mentorId: string) =>
  useQuery({ queryKey: keys.reviews(mentorId), queryFn: () => mentorsApi.reviews(mentorId) });

export const useMentorSlots = (mentorId: string) =>
  useQuery({ queryKey: keys.slots(mentorId), queryFn: () => mentorsApi.slots(mentorId) });

export function useRemoveSlot() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: mentorsApi.removeSlot,
    onSuccess: () => client.invalidateQueries({ queryKey: ['slots'] }),
  });
}
