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
}
