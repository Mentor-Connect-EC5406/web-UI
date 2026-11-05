import { ACADEMIC_YEARS } from '@/config/options';
import type { NewAccount, OnboardingDetails, OnboardingRole } from '@/types';

const text = (form: FormData, key: string) => String(form.get(key) ?? '').trim();

// "1st year" is 1 and so on, the backend stores the year as a number
export function academicYearNumber(label: string) {
  const index = ACADEMIC_YEARS.indexOf(label);
  return index === -1 ? null : index + 1;
}

// the name comes from asgardeo when it has one, otherwise from the name fields on the form
export function readOnboardingForm(role: OnboardingRole, form: FormData, account: Pick<NewAccount, 'firstName' | 'lastName'>): OnboardingDetails {
  const firstName = account.firstName || text(form, 'firstName');
  const lastName = account.lastName || text(form, 'lastName');

  if (role === 'STUDENT') {
    return {
      role,
      firstName,
      lastName,
      university: text(form, 'university'),
      faculty: text(form, 'faculty'),
      academicYear: academicYearNumber(text(form, 'year')),
    };
  }
  return {
    role,
    firstName,
    lastName,
    title: text(form, 'jobTitle'),
    organization: text(form, 'organization'),
    industry: text(form, 'field'),
    experienceYears: Number(text(form, 'experience')) || 0,
    bio: text(form, 'bio'),
  };
}
