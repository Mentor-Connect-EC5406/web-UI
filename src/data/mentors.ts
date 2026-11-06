import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import type { Mentor, MentorFilterValues, MentorProfileUpdate, ProfileExtras, Review, Slot, SlotStatus, Verification, VerificationStatus } from '@/types';
import { CURRENCY } from '@/config/constants';
import { fileUrl } from '@/config/env';
import { useSession } from '@/auth/session';
import { fromCents, roundRating, toCents } from '@/lib/format';
import { emptyExtras } from '@/lib/profile';
import { accountApi } from './account';
import { api, isApiError, listAll, uploadFile } from './http';
import { keys } from './keys';

export interface MentorSummaryResponse {
  id: string;
  firstName: string;
  lastName: string;
  profileImageKey: string | null;
  title: string | null;
  organization: string | null;
  industry: string | null;
  bio: string | null;
  headline: string;
  location: string;
  skills: string[];
  experienceYears: number;
  hourlyRateCents: number;
  currency: string;
  ratingAvg: number;
  ratingCount: number;
}

export interface MentorResponse extends MentorSummaryResponse, ProfileExtras {
  userId: string;
  verificationStatus: VerificationStatus;
}

interface SlotResponse {
  id: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
}

interface ReviewResponse {
  id: string;
  author: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface VerificationResponse {
  id: string;
  status: VerificationStatus;
  reviewNote: string | null;
  submittedAt: string;
}

// search and saved lists only return approved mentors, so a summary is always verified
export function toMentor(m: MentorSummaryResponse | MentorResponse): Mentor {
  const detail = 'userId' in m ? m : null;
  return {
    ...emptyExtras(),
    ...(detail && {
      links: detail.links,
      experience: detail.experience,
      education: detail.education,
      certificates: detail.certificates,
      projects: detail.projects,
      languages: detail.languages,
    }),
    id: m.id,
    userId: detail?.userId,
    name: `${m.firstName} ${m.lastName}`.trim(),
    title: m.title ?? '',
    organization: m.organization ?? '',
    industry: m.industry ?? '',
    avatarUrl: fileUrl(m.profileImageKey),
    bio: m.bio ?? '',
    headline: m.headline,
    location: m.location,
    skills: m.skills,
    experienceYears: m.experienceYears,
    hourlyRate: fromCents(m.hourlyRateCents),
    rating: roundRating(m.ratingAvg),
    reviewCount: m.ratingCount,
    isVerified: detail ? detail.verificationStatus === 'APPROVED' : true,
    verificationStatus: detail?.verificationStatus,
  };
}

const toSlot = (s: SlotResponse): Slot => ({ id: s.id, startsAt: s.startTime, endsAt: s.endTime, status: s.status });

const toReview = (r: ReviewResponse): Review => ({
  id: r.id,
  author: r.author ?? 'Student',
  rating: r.rating,
  date: format(parseISO(r.createdAt), 'd MMM yyyy'),
  text: r.comment ?? '',
});

// 404 is an expected answer here, the screens show their not found state
async function orNull<T>(request: Promise<T>) {
  try {
    return await request;
  } catch (error) {
    if (isApiError(error, 404)) return null;
    throw error;
  }
}

export const mentorsApi = {
  search: (f: MentorFilterValues) =>
    listAll<MentorSummaryResponse>('/api/mentors', {
      query: f.query.trim(),
      industries: f.industries,
      minRating: f.minRating,
      maxRateCents: f.maxRate ? toCents(Number(f.maxRate)) : undefined,
      sort: f.sort,
    }).then((list) => list.map(toMentor)),

  get: (id: string) => orNull(api<MentorResponse>(`/api/mentors/${id}`).then(toMentor)),

  reviews: (mentorId: string) => listAll<ReviewResponse>(`/api/mentors/${mentorId}/reviews`).then((list) => list.map(toReview)),

  // open slots students can book
  slots: (mentorId: string) => api<SlotResponse[]>(`/api/mentors/${mentorId}/slots`).then((list) => list.map(toSlot)),

  // the signed in mentor's upcoming slots in every status
  mySlots: () =>
    api<SlotResponse[]>('/api/mentors/me/slots', { query: { from: new Date().toISOString() } }).then((list) => list.map(toSlot)),

  removeSlot: (slotId: string) => api<void>(`/api/mentors/me/slots/${slotId}`, { method: 'DELETE' }),

  addSlot: ({ startsAt, endsAt }: { startsAt: string; endsAt: string }) =>
    api<SlotResponse>('/api/mentors/me/slots', {
      method: 'POST',
      body: { startTime: startsAt, endTime: endsAt, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    }),

  getSavedMentors: () => listAll<MentorSummaryResponse>('/api/students/me/saved-mentors').then((list) => list.map(toMentor)),
  saveMentor: (mentorId: string) => api<void>(`/api/students/me/saved-mentors/${mentorId}`, { method: 'PUT' }),
  unsaveMentor: (mentorId: string) => api<void>(`/api/students/me/saved-mentors/${mentorId}`, { method: 'DELETE' }),

  // null until the mentor finishes onboarding
  mine: () => orNull(api<MentorResponse>('/api/mentors/me').then(toMentor)),

  // newest first
  myVerifications: () =>
    api<VerificationResponse[]>('/api/mentors/me/verifications').then((list) =>
      list
        .map((v): Verification => ({ id: v.id, status: v.status, reviewNote: v.reviewNote, submittedAt: v.submittedAt }))
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    ),

  submitVerification: async (file: File) => {
    const documentKey = await uploadFile('/api/mentors/me/verification-upload-url', file);
    await api<VerificationResponse>('/api/mentors/me/verifications', { method: 'POST', body: { documentKey } });
  },

  // name and photo are saved on the account, the rest on the mentor profile
  updateMine: async ({ firstName, lastName, avatarUrl, hourlyRate, ...details }: MentorProfileUpdate) => {
    const user = await accountApi.update({ firstName, lastName, avatarUrl });
    await api<MentorResponse>('/api/mentors/me', {
      method: 'PUT',
      body: { ...details, hourlyRateCents: toCents(hourlyRate), currency: CURRENCY },
    });
    return user;
  },
};

export const useMentors = (filters: MentorFilterValues) =>
  useQuery({ queryKey: keys.mentors(filters), queryFn: () => mentorsApi.search(filters), placeholderData: (prev) => prev });

export const useMentor = (id: string) =>
  useQuery({ queryKey: keys.mentor(id), queryFn: () => mentorsApi.get(id) });

export const useMentorReviews = (mentorId: string) =>
  useQuery({ queryKey: keys.reviews(mentorId), queryFn: () => mentorsApi.reviews(mentorId) });

export const useMentorSlots = (mentorId: string) =>
  useQuery({ queryKey: keys.slots(mentorId), queryFn: () => mentorsApi.slots(mentorId), enabled: !!mentorId });

export const useMySlots = () => useQuery({ queryKey: keys.mySlots, queryFn: mentorsApi.mySlots });

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

export const useMyMentorProfile = () => useQuery({ queryKey: keys.myMentorProfile, queryFn: mentorsApi.mine });

export const useMyVerifications = () => useQuery({ queryKey: keys.myVerifications, queryFn: mentorsApi.myVerifications });

export function useSubmitVerification() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: mentorsApi.submitVerification,
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: keys.myMentorProfile }),
        client.invalidateQueries({ queryKey: keys.myVerifications }),
      ]),
  });
}

export function useUpdateMyMentorProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: mentorsApi.updateMine,
    // the header shows the account name and photo, the public pages show the profile
    onSuccess: (user) => {
      useSession.setState({ user });
      return Promise.all([
        client.invalidateQueries({ queryKey: keys.myMentorProfile }),
        client.invalidateQueries({ queryKey: ['mentors'] }),
        client.invalidateQueries({ queryKey: ['mentor'] }),
      ]);
    },
  });
}
