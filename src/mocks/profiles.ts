import type { ProfileExtras } from '@/types';

export const emptyExtras = (): ProfileExtras => ({
  headline: '',
  location: '',
  links: { linkedin: '', github: '', website: '' },
  experience: [],
  education: [],
  certificates: [],
  projects: [],
  languages: [],
});

// richer profiles for a few mentors, the rest start empty like a new account
export const MENTOR_EXTRAS: Record<string, Partial<ProfileExtras>> = {
  'mentor-1': {
    headline: 'Senior Software Engineer at WSO2 · Helping students land their first engineering role',
    location: 'Colombo, Sri Lanka',
    links: { linkedin: 'https://www.linkedin.com/in/nimal-silva', github: 'https://github.com/nimalsilva', website: '' },
    experience: [
      {
        id: 'exp-m1-1', role: 'Senior Software Engineer', organization: 'WSO2', startMonth: '2021-03', endMonth: null,
        description: 'Lead frontend work on the API management console and mentor new graduates.',
      },
      {
        id: 'exp-m1-2', role: 'Software Engineer', organization: 'Sysco LABS', startMonth: '2017-06', endMonth: '2021-02',
        description: 'Built internal React tools for supply chain teams.',
      },
    ],
    education: [
      { id: 'edu-m1-1', school: 'University of Moratuwa', degree: 'BSc Engineering', field: 'Computer Science & Engineering', startYear: '2013', endYear: '2017' },
    ],
    certificates: [
      { id: 'cert-m1-1', name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', issuedMonth: '2023-08', credentialUrl: '' },
    ],
    projects: [
      {
        id: 'proj-m1-1', title: 'Open source form library', description: 'Small accessible form helpers for React used by several local startups.',
        url: 'https://github.com/nimalsilva/forms', skills: ['React', 'TypeScript'],
      },
    ],
    languages: [
      { name: 'Sinhala', level: 'Native' },
      { name: 'English', level: 'Fluent' },
    ],
  },
  'mentor-3': {
    headline: 'Data Scientist at Dialog Axiata · ML in production',
    location: 'Colombo, Sri Lanka',
    education: [
      { id: 'edu-m3-1', school: 'University of Colombo', degree: 'MSc', field: 'Data Science', startYear: '2014', endYear: '2016' },
    ],
    languages: [{ name: 'English', level: 'Fluent' }],
  },
};
