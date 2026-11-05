import type { OnboardingDetails, Role, User } from '@/types';
import { fileUrl } from '@/config/env';
import { api } from './http';

// the signed in person's account, used only with real sign in so it has no mock version

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  profileImageKey: string | null;
  role: Role;
  accountStatus: string;
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

export const accountApi = {
  // 404 means the person signed in with asgardeo but has not registered yet
  me: () => api<UserResponse>('/api/users/me').then(toUser),

  register: ({ role, firstName, lastName }: Pick<OnboardingDetails, 'role' | 'firstName' | 'lastName'>) =>
    api<UserResponse>('/api/users/register', { method: 'POST', body: { role, firstName: firstName.trim(), lastName: lastName.trim() } }).then(toUser),

  saveOnboardingDetails: (details: OnboardingDetails) => {
    const { path, body } = profileBody(details);
    return api<unknown>(path, { method: 'PUT', body });
  },
};
