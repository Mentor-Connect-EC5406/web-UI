export type Role = 'STUDENT' | 'MENTOR' | 'ADMIN';

/** Roles a person can pick for themselves after signing up. Admin accounts are not self-service. */
export type OnboardingRole = Exclude<Role, 'ADMIN'>;

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
}

/** A person who has signed up with the identity provider but has not chosen a role yet */
export interface NewAccount {
  name: string;
  email: string;
}
