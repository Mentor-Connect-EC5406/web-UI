import { describe, expect, it } from 'vitest';
import { academicYearNumber, readOnboardingForm } from './onboarding';

function form(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([k, v]) => data.set(k, v));
  return data;
}

describe('onboarding form', () => {
  it('turns the year label into the number the backend stores', () => {
    expect(academicYearNumber('1st year')).toBe(1);
    expect(academicYearNumber('Postgraduate')).toBe(5);
    expect(academicYearNumber('')).toBeNull();
  });

  it('uses the asgardeo name when it has one', () => {
    const details = readOnboardingForm('STUDENT', form({ firstName: 'Typed', university: 'SLIIT', faculty: ' Computing ', year: '2nd year' }), {
      firstName: 'Ashan',
      lastName: 'Perera',
    });
    expect(details).toEqual({ role: 'STUDENT', firstName: 'Ashan', lastName: 'Perera', university: 'SLIIT', faculty: 'Computing', academicYear: 2 });
  });

  it('reads mentor details and the typed name when asgardeo had none', () => {
    const details = readOnboardingForm(
      'MENTOR',
      form({ firstName: 'Nimal', lastName: 'Silva', jobTitle: 'Engineer', organization: 'WSO2', field: 'Software Engineering', experience: '8', bio: 'Hi' }),
      {},
    );
    expect(details).toMatchObject({ role: 'MENTOR', firstName: 'Nimal', lastName: 'Silva', experienceYears: 8, industry: 'Software Engineering' });
  });
});
