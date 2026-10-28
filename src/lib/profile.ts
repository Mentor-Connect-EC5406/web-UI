import { MAX_BIO_LENGTH, MAX_EXPERIENCE_YEARS } from '@/config/constants';
import type { StudentProfileUpdate } from '@/types';

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export interface ProfileField {
  label: string;
  value: string | readonly string[];
}

const isFilled = (value: ProfileField['value']) =>
  typeof value === 'string' ? value.trim() !== '' : value.length > 0;

// percent of fields filled in plus the labels still missing, used for the completeness meter
export function profileProgress(fields: readonly ProfileField[]) {
  const missing = fields.filter((f) => !isFilled(f.value)).map((f) => f.label);
  const percent = fields.length === 0 ? 100 : Math.round(((fields.length - missing.length) / fields.length) * 100);
  return { percent, missing };
}

// allows spaces, dashes, brackets and a leading plus around 7 to 15 digits
export function isValidPhone(phone: string) {
  const digits = phone.replace(/[\s\-()]/g, '');
  return /^\+?\d{7,15}$/.test(digits);
}

export function validateStudentProfile(v: StudentProfileUpdate) {
  const errors: FieldErrors<'firstName' | 'lastName' | 'phone' | 'bio'> = {};
  if (!v.firstName.trim()) errors.firstName = 'Enter your first name';
  if (!v.lastName.trim()) errors.lastName = 'Enter your last name';
  if (v.phone.trim() && !isValidPhone(v.phone)) errors.phone = 'Enter a valid phone number, e.g. +94 77 123 4567';
  if (v.bio.length > MAX_BIO_LENGTH) errors.bio = `Keep this under ${MAX_BIO_LENGTH} characters`;
  return errors;
}

// numbers are kept as text while editing so an empty field can be told apart from zero
export interface MentorProfileDraft {
  firstName: string;
  lastName: string;
  title: string;
  organization: string;
  industry: string;
  bio: string;
  skills: string[];
  experienceYears: string;
  hourlyRate: string;
}

export type MentorDraftField = 'firstName' | 'lastName' | 'title' | 'organization' | 'industry' | 'bio' | 'skills' | 'experienceYears' | 'hourlyRate';

const isWholeNumber = (text: string) => /^\d+$/.test(text.trim());

export function validateMentorProfile(v: MentorProfileDraft) {
  const errors: FieldErrors<MentorDraftField> = {};
  if (!v.firstName.trim()) errors.firstName = 'Enter your first name';
  if (!v.lastName.trim()) errors.lastName = 'Enter your last name';
  if (!v.title.trim()) errors.title = 'Enter your job title';
  if (!v.organization.trim()) errors.organization = 'Enter your organisation';
  if (!v.industry) errors.industry = 'Choose your job field';
  if (!v.bio.trim()) errors.bio = 'Tell students about your background';
  else if (v.bio.length > MAX_BIO_LENGTH) errors.bio = `Keep this under ${MAX_BIO_LENGTH} characters`;
  if (v.skills.length === 0) errors.skills = 'Add at least one skill';
  if (!isWholeNumber(v.experienceYears) || Number(v.experienceYears) > MAX_EXPERIENCE_YEARS) {
    errors.experienceYears = `Enter whole years from 0 to ${MAX_EXPERIENCE_YEARS}`;
  }
  if (!isWholeNumber(v.hourlyRate)) errors.hourlyRate = 'Enter a price in whole numbers, 0 for free sessions';
  return errors;
}

export const hasErrors = (errors: object) => Object.keys(errors).length > 0;
