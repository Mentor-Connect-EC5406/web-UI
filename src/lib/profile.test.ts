import { describe, expect, it } from 'vitest';
import { STUDENT_PROFILE } from '@/mocks/users';
import { emptyExtras } from '@/mocks/profiles';
import type { ExperienceEntry } from '@/types';
import {
  formatMonth,
  isValidPhone,
  monthSpan,
  photoError,
  profileProgress,
  sortExperience,
  validateCertificate,
  validateEducation,
  validateExperience,
  validateLinks,
  validateMentorProfile,
  validateStudentProfile,
  yearOptions,
  type MentorProfileDraft,
} from './profile';

// the extra email field is ignored by the validator
const student = STUDENT_PROFILE;

const mentor: MentorProfileDraft = {
  ...emptyExtras(),
  firstName: 'Nimal', lastName: 'Silva', title: 'Engineer', organization: 'WSO2', industry: 'Software Engineering',
  bio: 'I help students.', skills: ['React'], experienceYears: '8', hourlyRate: '2500', avatarUrl: null,
};

const job = (patch: Partial<ExperienceEntry> = {}): ExperienceEntry => ({
  id: 'x', role: 'Intern', organization: 'IFS', startMonth: '2025-01', endMonth: '2025-06', description: '', ...patch,
});

describe('profileProgress', () => {
  it('counts text, lists and flags and returns the missing fields with their section', () => {
    const result = profileProgress([
      { label: 'phone', value: '  ', section: 'intro' },
      { label: 'bio', value: 'Hi' },
      { label: 'skills', value: [] },
      { label: 'photo', value: null },
    ]);
    expect(result.percent).toBe(25);
    expect(result.missing.map((f) => f.label)).toEqual(['phone', 'skills', 'photo']);
    expect(result.missing[0].section).toBe('intro');
  });
});

describe('dates', () => {
  it('formats a stored month', () => {
    expect(formatMonth('2024-06')).toBe('Jun 2024');
  });

  it('counts both the first and last month of a role', () => {
    expect(monthSpan('2024-01', '2024-12')).toBe('1 yr');
    expect(monthSpan('2024-01', '2025-04')).toBe('1 yr 4 mos');
    expect(monthSpan('2025-03', null, new Date(2025, 3, 15))).toBe('2 mos');
  });

  it('puts current roles first then newest start', () => {
    const list = [job({ id: 'old', startMonth: '2020-01' }), job({ id: 'now', startMonth: '2019-01', endMonth: null }), job({ id: 'new', startMonth: '2024-01' })];
    expect(sortExperience(list).map((e) => e.id)).toEqual(['now', 'new', 'old']);
  });

  it('offers future years for expected graduation', () => {
    const years = yearOptions(new Date(2026, 0, 1));
    expect(years[0]).toBe('2032');
    expect(years).toContain('1966');
  });
});

describe('links, phone and photo', () => {
  it('accepts local and international phone formats', () => {
    expect(isValidPhone('+94 77 123 4567')).toBe(true);
    expect(isValidPhone('call me')).toBe(false);
  });

  it('checks links are full urls on the right site', () => {
    expect(validateLinks({ linkedin: 'https://www.linkedin.com/in/me', github: '', website: 'https://me.dev' })).toEqual({});
    const errors = validateLinks({ linkedin: 'https://github.com/me', github: 'github.com/me', website: '' });
    expect(Object.keys(errors).sort()).toEqual(['github', 'linkedin']);
  });

  it('rejects large or non image files', () => {
    expect(photoError({ type: 'image/png', size: 1000 })).toBeNull();
    expect(photoError({ type: 'image/png', size: 5 * 1024 * 1024 })).toMatch(/under 2 MB/);
    expect(photoError({ type: 'application/pdf', size: 1000 })).toMatch(/JPG/);
  });
});

describe('entry validation', () => {
  it('needs an end date unless it is a current role and the end cannot be before the start', () => {
    expect(validateExperience(job({ endMonth: null }))).toEqual({});
    expect(validateExperience(job({ endMonth: '' })).endMonth).toBeDefined();
    expect(validateExperience(job({ endMonth: '2024-12' })).endMonth).toMatch(/after the start/);
    expect(validateExperience(job({ startMonth: '2025-' })).startMonth).toBeDefined();
  });

  it('checks education years and certificate links', () => {
    const edu = { id: 'e', school: 'UoM', degree: 'BSc', field: '', startYear: '2024', endYear: '2023' };
    expect(validateEducation(edu).endYear).toBeDefined();
    expect(validateEducation({ ...edu, endYear: null })).toEqual({});
    const cert = { id: 'c', name: 'AWS', issuer: 'Amazon', issuedMonth: '2024-02', credentialUrl: 'not a link' };
    expect(Object.keys(validateCertificate(cert))).toEqual(['credentialUrl']);
  });
});

describe('profile validation', () => {
  it('passes the demo student and requires names', () => {
    expect(validateStudentProfile(student)).toEqual({});
    const errors = validateStudentProfile({ ...student, firstName: ' ', phone: 'abc', headline: 'x'.repeat(200) });
    expect(Object.keys(errors).sort()).toEqual(['firstName', 'headline', 'phone']);
  });

  it('passes a complete mentor and allows free sessions', () => {
    expect(validateMentorProfile({ ...mentor, hourlyRate: '0', experienceYears: '0' })).toEqual({});
  });

  it('flags missing mentor details, empty skills and bad numbers', () => {
    const errors = validateMentorProfile({ ...mentor, title: '', skills: [], experienceYears: '80', hourlyRate: '' });
    expect(Object.keys(errors).sort()).toEqual(['experienceYears', 'hourlyRate', 'skills', 'title']);
  });
});
