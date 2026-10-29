import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Mentor, MentorFilterValues, MentorProfileUpdate, MentorSort } from '@/types';
import { parseISO } from 'date-fns';
import { findOverlap } from '@/lib/slots';
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
  reviews: (mentorId: string) => respond(() => [...(db.newReviews[mentorId] ?? []), ...db.reviews]),
  slots: (_mentorId: string) => respond(() => db.slots),
  removeSlot: (slotId: string) => mutate(() => { db.slots = db.slots.filter((s) => s.id !== slotId); }),
  // the server checks overlaps too because another tab may have added a slot meanwhile
  addSlot: ({ startsAt, endsAt }: { startsAt: string; endsAt: string }) =>
    mutate(() => {
      if (findOverlap(parseISO(startsAt), parseISO(endsAt), db.slots)) throw new Error('This time overlaps an existing slot.');
      db.slots = [...db.slots, { id: `s-${Date.now()}`, startsAt, endsAt, status: 'AVAILABLE' as const }]
        .sort((a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime());
    }),

  getSavedMentors: () => respond(() => db.mentors.filter((m) => db.savedMentorIds.includes(m.id))),
  saveMentor: (mentorId: string) =>
    mutate(() => { if (!db.savedMentorIds.includes(mentorId)) db.savedMentorIds = [...db.savedMentorIds, mentorId]; }),
  unsaveMentor: (mentorId: string) =>
    mutate(() => { db.savedMentorIds = db.savedMentorIds.filter((id) => id !== mentorId); }),

  // the signed in mentor's own record, null if it has not been created yet
  mine: () => respond(() => db.mentors.find((m) => m.id === db.myMentorId) ?? null),
  updateMine: ({ firstName, lastName, ...details }: MentorProfileUpdate) =>
    mutate(() => {
      db.mentors = db.mentors.map((m) =>
        m.id === db.myMentorId ? { ...m, ...structuredClone(details), name: `${firstName} ${lastName}`.trim() } : m,
      );
    }),
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

export function useAddSlot() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: mentorsApi.addSlot,
    onSuccess: () => client.invalidateQueries({ queryKey: ['slots'] }),
  });
}

export const useSavedMentors = () => useQuery({ queryKey: keys.savedMentors, queryFn: mentorsApi.getSavedMentors });

export function useSaveMentor() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: mentorsApi.saveMentor,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.savedMentors }),
  });
}

export function useUnsaveMentor() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: mentorsApi.unsaveMentor,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.savedMentors }),
  });
}

export const useMyMentorProfile =() => useQuery({ queryKey: keys.myMentorProfile, queryFn: mentorsApi.mine });

export function useUpdateMyMentorProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: mentorsApi.updateMine,
    // the public list and profile pages show the same record so they refresh too
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: keys.myMentorProfile }),
        client.invalidateQueries({ queryKey: ['mentors'] }),
        client.invalidateQueries({ queryKey: ['mentor'] }),
      ]),
  });
}
