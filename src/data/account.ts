import type { OnboardingDetails, Role, User } from '@/types';
import { fileUrl } from '@/config/env';
import { api, uploadFile } from './http';

// the signed in person's account

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  profileImageKey: string | null;
  role: Role;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  createdAt: string;
}

export const toUser = (u: UserResponse): User => ({
  id: u.id,
  name: `${u.firstName} ${u.lastName}`.trim(),
  email: u.email,
  avatarUrl: fileUrl(u.profileImageKey),
  role: u.role,
});

function profileBody(d: OnboardingDetails) {
  if (d.role === 'STUDENT') {
    return {
      path: '/api/students/me/profile',
      body: { university: d.university, faculty: d.faculty, ...(d.academicYear ? { academicYear: d.academicYear } : {}) },
    };
  }
  return {
    path: '/api/mentors/me',
    body: { title: d.title, organization: d.organization, industry: d.industry, experienceYears: d.experienceYears, bio: d.bio },
  };
}

export interface AccountUpdate {
  firstName: string;
  lastName: string;
  // undefined keeps the saved phone, the api clears fields that are left out
  phone?: string;
  // a data url is a new photo to upload, null removes it, anything else keeps the saved one
  avatarUrl: string | null;
}

async function avatarKey(avatarUrl: string | null, currentKey: string | null) {
  if (avatarUrl === null) return null;
  if (!avatarUrl.startsWith('data:')) return currentKey;
  const file = await (await fetch(avatarUrl)).blob();
  return uploadFile('/api/users/me/avatar-upload-url', file);
}

export const accountApi = {
  // 404 means the person signed in with asgardeo but has not registered yet
  me: () => api<UserResponse>('/api/users/me').then(toUser),

  meDetails: () => api<UserResponse>('/api/users/me'),

  // name, phone and photo live on the account, not on the student or mentor profile
  update: async ({ firstName, lastName, phone, avatarUrl }: AccountUpdate) => {
    const current = await accountApi.meDetails();
    const profileImageKey = await avatarKey(avatarUrl, current.profileImageKey);
    const body = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      // the api accepts digits with an optional leading plus only
      phone: phone === undefined ? current.phone : phone.replace(/[\s\-()]/g, '') || null,
      profileImageKey,
    };
    return api<UserResponse>('/api/users/me', { method: 'PUT', body }).then(toUser);
  },

  register: ({ role, firstName, lastName }: Pick<OnboardingDetails, 'role' | 'firstName' | 'lastName'>) =>
    api<UserResponse>('/api/users/register', { method: 'POST', body: { role, firstName: firstName.trim(), lastName: lastName.trim() } }).then(toUser),

  saveOnboardingDetails: (details: OnboardingDetails) => {
    const { path, body } = profileBody(details);
    return api<unknown>(path, { method: 'PUT', body });
  },
};
