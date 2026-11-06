import type { StudentProfile } from '@/types';

// a complete student profile for form and validation tests
export const STUDENT_PROFILE: StudentProfile = {
  firstName: 'Kasun',
  lastName: 'Fernando',
  email: 'kasun@example.com',
  phone: '+94 77 000 0000',
  bio: 'Final year computing student interested in web development.',
  university: 'University of Moratuwa',
  degree: 'BSc Computer Science',
  academicYear: '3rd year',
  interests: ['Software Engineering'],
  avatarUrl: null,
  skills: ['React', 'TypeScript'],
  workPreferences: { openToOpportunities: true, desiredRoles: ['Frontend Developer'], workTypes: ['Internship'], arrangements: ['Hybrid'] },
  visibility: { isPublic: true, showEmail: false, showPhone: false },
  headline: 'Computer Science undergraduate',
  location: 'Colombo, Sri Lanka',
  links: { linkedin: 'https://www.linkedin.com/in/kasun', github: '', website: '' },
  experience: [
    {
      id: 'exp-1',
      role: 'Software Engineering Intern',
      organization: 'WSO2',
      startMonth: '2025-06',
      endMonth: '2025-12',
      description: 'Built React components for an internal dashboard.',
    },
  ],
  education: [
    { id: 'edu-1', school: 'University of Moratuwa', degree: 'BSc', field: 'Computer Science', startYear: '2023', endYear: null },
  ],
  certificates: [],
  projects: [],
  languages: [{ name: 'Sinhala', level: 'Native' }],
};
