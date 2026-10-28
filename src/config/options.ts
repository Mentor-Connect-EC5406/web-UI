import type { LanguageLevel, Role, WorkArrangement, WorkType } from '@/types';

// static reference lists for selects and filters, may come from the API later

export const INDUSTRIES = [
  'Software Engineering',
  'Data Science & AI',
  'Cybersecurity',
  'Cloud & DevOps',
  'UX/UI Design',
  'Product Management',
  'Digital Marketing',
  'Finance & Banking',
  'Accounting & Audit',
  'Business Analysis',
  'Project Management',
  'Healthcare & Medicine',
  'Biotechnology & Pharma',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical & Electronics',
  'Telecommunications',
  'Human Resources',
  'Law & Compliance',
  'Entrepreneurship',
];

export const UNIVERSITIES = [
  'University of Moratuwa',
  'University of Colombo',
  'University of Kelaniya',
  'SLIIT',
  'NSBM',
  'IIT',
];

export const ACADEMIC_YEARS = ['1st year', '2nd year', '3rd year', '4th year', 'Postgraduate'];

export const LANGUAGE_LEVELS: readonly LanguageLevel[] = ['Basic', 'Conversational', 'Fluent', 'Native'];
export const WORK_TYPES: readonly WorkType[] = ['Internship', 'Full time', 'Part time'];
export const WORK_ARRANGEMENTS: readonly WorkArrangement[] = ['On site', 'Hybrid', 'Remote'];

export const ROLE_LABELS: Record<Role, string> = { STUDENT: 'Student', MENTOR: 'Mentor', ADMIN: 'Admin' };
