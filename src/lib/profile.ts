import {
  MAX_BIO_LENGTH,
  MAX_ENTRY_DESCRIPTION_LENGTH,
  MAX_EXPERIENCE_YEARS,
  MAX_HEADLINE_LENGTH,
  MAX_PHOTO_BYTES,
  PHOTO_TYPES,
  PROFILE_YEARS_AHEAD,
  PROFILE_YEARS_BACK,
} from '@/config/constants';
import type {
  Certificate,
  EducationEntry,
  ExperienceEntry,
  ProfileExtras,
  ProfileLinks,
  Project,
  StudentProfileUpdate,
} from '@/types';

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export const hasErrors = (errors: object) => Object.keys(errors).length > 0;

// completeness

export interface ProfileField {
  label: string;
  value: string | boolean | null | readonly unknown[];
  // id of the section to jump to when it is missing
  section?: string;
}

const isFilled = (value: ProfileField['value']) =>
  typeof value === 'string' ? value.trim() !== '' : Array.isArray(value) ? value.length > 0 : Boolean(value);

// percent of fields filled in plus the fields still missing, used for the completeness checklist
export function profileProgress(fields: readonly ProfileField[]) {
  const missing = fields.filter((f) => !isFilled(f.value));
  const percent = fields.length === 0 ? 100 : Math.round(((fields.length - missing.length) / fields.length) * 100);
  return { percent, missing };
}

// dates

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const MONTH_OPTIONS = MONTH_NAMES.map((label, i) => ({ value: String(i + 1).padStart(2, '0'), label }));

export const isMonth = (value: string | null): value is string => !!value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
export const isYear = (value: string | null): value is string => !!value && /^\d{4}$/.test(value);

// newest first so the picker opens near today
export function yearOptions(now = new Date()) {
  const last = now.getFullYear() + PROFILE_YEARS_AHEAD;
  return Array.from({ length: PROFILE_YEARS_BACK + PROFILE_YEARS_AHEAD + 1 }, (_, i) => String(last - i));
}

// "2024-06" becomes "Jun 2024"
export function formatMonth(value: string) {
  if (!isMonth(value)) return value;
  const [year, month] = value.split('-');
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

const thisMonth = (now: Date) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

// length of a role counting both the first and last month, e.g. "1 yr 4 mos"
export function monthSpan(start: string, end: string | null, now = new Date()) {
  if (!isMonth(start)) return '';
  const finish = end ?? thisMonth(now);
  if (!isMonth(finish)) return '';
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = finish.split('-').map(Number);
  const total = (ey - sy) * 12 + (em - sm) + 1;
  if (total <= 0) return '';
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  return parts.join(' ');
}

export function dateRange(start: string, end: string | null, format: (v: string) => string = formatMonth) {
  return `${format(start)} – ${end ? format(end) : 'Present'}`;
}

// current entries first, then by start date newest first
export function sortExperience<T extends { startMonth: string; endMonth: string | null }>(list: readonly T[]) {
  return [...list].sort((a, b) => Number(b.endMonth === null) - Number(a.endMonth === null) || b.startMonth.localeCompare(a.startMonth));
}

export function sortEducation<T extends { startYear: string; endYear: string | null }>(list: readonly T[]) {
  return [...list].sort((a, b) => b.startYear.localeCompare(a.startYear));
}

// links and files

export function isValidUrl(text: string) {
  try {
    const url = new URL(text.trim());
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

// allows spaces, dashes, brackets and a leading plus around 7 to 15 digits
export function isValidPhone(phone: string) {
  const digits = phone.replace(/[\s\-()]/g, '');
  return /^\+?\d{7,15}$/.test(digits);
}

const LINK_HOSTS: Partial<Record<keyof ProfileLinks, string>> = { linkedin: 'linkedin.com', github: 'github.com' };

export function validateLinks(links: ProfileLinks) {
  const errors: FieldErrors<keyof ProfileLinks> = {};
  for (const key of Object.keys(links) as (keyof ProfileLinks)[]) {
    const value = links[key].trim();
    if (!value) continue;
    const host = LINK_HOSTS[key];
    if (!isValidUrl(value)) errors[key] = 'Enter a full link starting with https://';
    else if (host && !new URL(value).hostname.endsWith(host)) errors[key] = `Enter a ${host} link`;
  }
  return errors;
}

export function photoError(file: { type: string; size: number }) {
  if (!PHOTO_TYPES.includes(file.type)) return 'Choose a JPG, PNG or WebP image';
  if (file.size > MAX_PHOTO_BYTES) return `Choose an image under ${MAX_PHOTO_BYTES / 1024 / 1024} MB`;
  return null;
}

// section entries

const endBeforeStart = (start: string, end: string | null) => !!end && end < start;

export function validateExperience(e: ExperienceEntry) {
  const errors: FieldErrors<'role' | 'organization' | 'startMonth' | 'endMonth' | 'description'> = {};
  if (!e.role.trim()) errors.role = 'Enter your role';
  if (!e.organization.trim()) errors.organization = 'Enter the organisation';
  if (!isMonth(e.startMonth)) errors.startMonth = 'Choose the month and year you started';
  if (e.endMonth !== null && !isMonth(e.endMonth)) errors.endMonth = 'Choose when it ended or tick current role';
  else if (isMonth(e.startMonth) && endBeforeStart(e.startMonth, e.endMonth)) errors.endMonth = 'End date must be after the start date';
  if (e.description.length > MAX_ENTRY_DESCRIPTION_LENGTH) errors.description = `Keep this under ${MAX_ENTRY_DESCRIPTION_LENGTH} characters`;
  return errors;
}

export function validateEducation(e: EducationEntry) {
  const errors: FieldErrors<'school' | 'degree' | 'startYear' | 'endYear'> = {};
  if (!e.school.trim()) errors.school = 'Enter the school or university';
  if (!e.degree.trim()) errors.degree = 'Enter the degree or qualification';
  if (!isYear(e.startYear)) errors.startYear = 'Choose the start year';
  if (e.endYear !== null && !isYear(e.endYear)) errors.endYear = 'Choose the end year or tick currently studying';
  else if (isYear(e.startYear) && endBeforeStart(e.startYear, e.endYear)) errors.endYear = 'End year must be after the start year';
  return errors;
}

export function validateCertificate(c: Certificate) {
  const errors: FieldErrors<'name' | 'issuer' | 'issuedMonth' | 'credentialUrl'> = {};
  if (!c.name.trim()) errors.name = 'Enter the certificate name';
  if (!c.issuer.trim()) errors.issuer = 'Enter who issued it';
  if (!isMonth(c.issuedMonth)) errors.issuedMonth = 'Choose the month and year it was issued';
  if (c.credentialUrl.trim() && !isValidUrl(c.credentialUrl)) errors.credentialUrl = 'Enter a full link starting with https://';
  return errors;
}

export function validateProject(p: Project) {
  const errors: FieldErrors<'title' | 'description' | 'url'> = {};
  if (!p.title.trim()) errors.title = 'Enter the project title';
  if (p.description.length > MAX_ENTRY_DESCRIPTION_LENGTH) errors.description = `Keep this under ${MAX_ENTRY_DESCRIPTION_LENGTH} characters`;
  if (p.url.trim() && !isValidUrl(p.url)) errors.url = 'Enter a full link starting with https://';
  return errors;
}

// whole profiles

type IntroField = 'headline' | keyof ProfileLinks;

function validateIntro(v: Pick<ProfileExtras, 'headline' | 'links'>) {
  const errors: FieldErrors<IntroField> = { ...validateLinks(v.links) };
  if (v.headline.length > MAX_HEADLINE_LENGTH) errors.headline = `Keep this under ${MAX_HEADLINE_LENGTH} characters`;
  return errors;
}

export function validateStudentProfile(v: StudentProfileUpdate) {
  const errors: FieldErrors<'firstName' | 'lastName' | 'phone' | 'bio' | IntroField> = { ...validateIntro(v) };
  if (!v.firstName.trim()) errors.firstName = 'Enter your first name';
  if (!v.lastName.trim()) errors.lastName = 'Enter your last name';
  if (v.phone.trim() && !isValidPhone(v.phone)) errors.phone = 'Enter a valid phone number, e.g. +94 77 123 4567';
  if (v.bio.length > MAX_BIO_LENGTH) errors.bio = `Keep this under ${MAX_BIO_LENGTH} characters`;
  return errors;
}

// numbers are kept as text while editing so an empty field can be told apart from zero
export interface MentorProfileDraft extends ProfileExtras {
  firstName: string;
  lastName: string;
  title: string;
  organization: string;
  industry: string;
  bio: string;
  skills: string[];
  experienceYears: string;
  hourlyRate: string;
  avatarUrl: string | null;
}

export type MentorDraftField =
  | 'firstName' | 'lastName' | 'title' | 'organization' | 'industry' | 'bio' | 'skills' | 'experienceYears' | 'hourlyRate' | IntroField;

const isWholeNumber = (text: string) => /^\d+$/.test(text.trim());

export function validateMentorProfile(v: MentorProfileDraft) {
  const errors: FieldErrors<MentorDraftField> = { ...validateIntro(v) };
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
