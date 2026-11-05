import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProfileExtras, ProfileVisibility, StudentProfile, StudentProfileUpdate, WorkPreferences } from '@/types';
import { fileUrl } from '@/config/env';
import { ACADEMIC_YEARS } from '@/config/options';
import { useSession } from '@/auth/session';
import { academicYearNumber } from '@/lib/onboarding';
import { emptyExtras } from '@/lib/profile';
import { accountApi } from './account';
import { api } from './http';
import { keys } from './keys';

interface StudentProfileResponse extends ProfileExtras {
  university: string | null;
  faculty: string | null;
  degree: string | null;
  academicYear: number | null;
  bio: string | null;
  interests: string[];
  skills: string[];
  workPreferences: WorkPreferences;
  visibility: ProfileVisibility;
}

const DEFAULT_WORK_PREFERENCES: WorkPreferences = { openToOpportunities: false, desiredRoles: [], workTypes: [], arrangements: [] };
const DEFAULT_VISIBILITY: ProfileVisibility = { isPublic: true, showEmail: false, showPhone: false };

// name, email, phone and photo come from the account, the rest from the student profile
async function loadProfile(): Promise<StudentProfile> {
  const [account, p] = await Promise.all([accountApi.meDetails(), api<StudentProfileResponse>('/api/students/me/profile')]);
  return {
    ...emptyExtras(),
    headline: p.headline ?? '',
    location: p.location ?? '',
    links: p.links ?? emptyExtras().links,
    experience: p.experience ?? [],
    education: p.education ?? [],
    certificates: p.certificates ?? [],
    projects: p.projects ?? [],
    languages: p.languages ?? [],
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    phone: account.phone ?? '',
    avatarUrl: fileUrl(account.profileImageKey),
    bio: p.bio ?? '',
    university: p.university ?? '',
    // onboarding saves the faculty, the profile edits the degree
    degree: p.degree || p.faculty || '',
    academicYear: p.academicYear ? (ACADEMIC_YEARS[p.academicYear - 1] ?? '') : '',
    interests: p.interests ?? [],
    skills: p.skills ?? [],
    workPreferences: p.workPreferences ?? DEFAULT_WORK_PREFERENCES,
    visibility: p.visibility ?? DEFAULT_VISIBILITY,
  };
}

export const usersApi = {
  studentProfile: loadProfile,

  updateStudentProfile: async ({ firstName, lastName, phone, avatarUrl, academicYear, ...profile }: StudentProfileUpdate) => {
    const user = await accountApi.update({ firstName, lastName, phone, avatarUrl });
    const year = academicYearNumber(academicYear);
    await api<StudentProfileResponse>('/api/students/me/profile', {
      method: 'PUT',
      body: { ...profile, ...(year ? { academicYear: year } : {}) },
    });
    return user;
  },
};

export const useStudentProfile = () => useQuery({ queryKey: keys.studentProfile, queryFn: usersApi.studentProfile });

export function useUpdateStudentProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateStudentProfile,
    // the header shows the account name and photo
    onSuccess: (user) => {
      useSession.setState({ user });
      return client.invalidateQueries({ queryKey: keys.studentProfile });
    },
  });
}
