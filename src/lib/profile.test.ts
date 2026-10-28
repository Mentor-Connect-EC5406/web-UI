import { describe, expect, it } from 'vitest';
import { isValidPhone, profileProgress, validateMentorProfile, validateStudentProfile, type MentorProfileDraft } from './profile';

const student = {
  firstName: 'Ashan', lastName: 'Perera', phone: '', bio: '', university: '', degree: '', academicYear: '', interests: [],
};

const mentor: MentorProfileDraft = {
  firstName: 'Nimal', lastName: 'Silva', title: 'Engineer', organization: 'WSO2', industry: 'Software Engineering',
  bio: 'I help students.', skills: ['React'], experienceYears: '8', hourlyRate: '2500',
};

describe('profileProgress', () => {
  it('counts filled text and lists and names what is missing', () => {
    const result = profileProgress([
      { label: 'phone', value: '  ' },
      { label: 'bio', value: 'Hi' },
      { label: 'skills', value: [] },
      { label: 'interests', value: ['Design'] },
    ]);
    expect(result).toEqual({ percent: 50, missing: ['phone', 'skills'] });
  });
});

describe('isValidPhone', () => {
  it('accepts local and international formats', () => {
    expect(isValidPhone('+94 77 123 4567')).toBe(true);
    expect(isValidPhone('(011) 234-5678')).toBe(true);
  });

  it('rejects letters and too few digits', () => {
    expect(isValidPhone('call me')).toBe(false);
    expect(isValidPhone('12345')).toBe(false);
  });
});

describe('validateStudentProfile', () => {
  it('passes with only the names filled in', () => {
    expect(validateStudentProfile(student)).toEqual({});
  });

  it('requires names and checks the phone when given', () => {
    const errors = validateStudentProfile({ ...student, firstName: ' ', phone: 'abc' });
    expect(Object.keys(errors).sort()).toEqual(['firstName', 'phone']);
  });
});

describe('validateMentorProfile', () => {
  it('passes a complete profile and allows free sessions', () => {
    expect(validateMentorProfile({ ...mentor, hourlyRate: '0', experienceYears: '0' })).toEqual({});
  });

  it('flags missing details, empty skills and bad numbers', () => {
    const errors = validateMentorProfile({ ...mentor, title: '', skills: [], experienceYears: '80', hourlyRate: '' });
    expect(Object.keys(errors).sort()).toEqual(['experienceYears', 'hourlyRate', 'skills', 'title']);
  });
});
