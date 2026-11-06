import type { LanguageLevel, MentorshipFrequency, Role, SessionTaskType, WorkArrangement, WorkType } from '@/types';

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

// suggestions only, students can type a university that is not listed
export const UNIVERSITIES = [
  'University of Colombo',
  'University of Peradeniya',
  'University of Sri Jayewardenepura',
  'University of Kelaniya',
  'University of Moratuwa',
  'University of Jaffna',
  'University of Ruhuna',
  'Eastern University, Sri Lanka',
  'South Eastern University of Sri Lanka',
  'Rajarata University of Sri Lanka',
  'Sabaragamuwa University of Sri Lanka',
  'Wayamba University of Sri Lanka',
  'Uva Wellassa University',
  'University of the Visual & Performing Arts',
  'Open University of Sri Lanka',
  'Gampaha Wickramarachchi University of Indigenous Medicine',
  'University of Vavuniya',
  'General Sir John Kotelawala Defence University',
  'SLIIT',
  'NSBM Green University',
  'Informatics Institute of Technology (IIT)',
  'APIIT Sri Lanka',
  'ICBT Campus',
  'SLTC Research University',
  'CINEC Campus',
  'Horizon Campus',
  'KIU',
  'ESOFT Metro Campus',
  'NIBM',
  'University of Vocational Technology',
];

// position + 1 is the number the backend stores, so new labels go at the end
export const ACADEMIC_YEARS = ['1st year', '2nd year', '3rd year', '4th year', 'Postgraduate', 'Passed out'];

export const LANGUAGE_LEVELS: readonly LanguageLevel[] = ['Basic', 'Conversational', 'Fluent', 'Native'];
export const WORK_TYPES: readonly WorkType[] = ['Internship', 'Full time', 'Part time'];
export const WORK_ARRANGEMENTS: readonly WorkArrangement[] = ['On site', 'Hybrid', 'Remote'];

export const ROLE_LABELS: Record<Role, string> = { STUDENT: 'Student', MENTOR: 'Mentor', ADMIN: 'Admin' };

export const REPORT_CATEGORY_LABELS: Record<string, string> = {
  NO_SHOW: 'No show',
  INAPPROPRIATE_BEHAVIOR: 'Inappropriate behaviour',
  PAYMENT_ISSUE: 'Payment issue',
  OTHER: 'Other',
};

export const MENTORSHIP_FREQUENCY_LABELS: Record<MentorshipFrequency, string> = {
  WEEKLY: 'Every week',
  BIWEEKLY: 'Every two weeks',
  MONTHLY: 'Every month',
};

// Monday first, values match Date.getDay
export const WEEKDAY_OPTIONS = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' },
] as const;

export const SESSION_TASK_LABELS: Record<SessionTaskType, { label: string; plural: string; hint: string }> = {
  HOMEWORK: { label: 'Homework', plural: 'Homework', hint: 'Work to finish before the next session' },
  TARGET: { label: 'Target', plural: 'Targets', hint: 'Something measurable to reach' },
  GOAL: { label: 'Goal', plural: 'Goals', hint: 'The bigger outcome this session works towards' },
};
