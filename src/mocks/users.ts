import type { NewAccount, Role, StudentProfile, User } from '@/types';

/** One demo account per role, used by the demo sign-in */
export const DEMO_USERS: Record<Role, User> = {
  STUDENT: { id: 'student-1', name: 'Ashan Perera', email: 'ashan@university.lk', avatarUrl: null, role: 'STUDENT' },
  MENTOR: { id: 'mentor-1', name: 'Nimal Silva', email: 'nimal@mentorconnect.app', avatarUrl: null, role: 'MENTOR' },
  ADMIN: { id: 'admin-1', name: 'Admin User', email: 'admin@mentorconnect.app', avatarUrl: null, role: 'ADMIN' },
};

/** Identity the demo sign-up pretends the identity provider returned */
export const DEMO_NEW_ACCOUNT: NewAccount = { name: 'Kasun Fernando', email: 'kasun@example.com' };

// profile of the demo student, phone and certificates are left empty so completeness has something to show
export const STUDENT_PROFILE: StudentProfile = {
  firstName: 'Ashan',
  lastName: 'Perera',
  email: 'ashan@university.lk',
  phone: '',
  bio: 'Third year computer science student interested in frontend engineering and product design.',
  university: 'University of Moratuwa',
  degree: 'BSc Computer Science & Engineering',
  academicYear: '3rd year',
  interests: ['Software Engineering', 'UX/UI Design'],
  avatarUrl: null,
  headline: 'Computer Science undergraduate · Aspiring frontend engineer',
  location: 'Moratuwa, Sri Lanka',
  links: { linkedin: 'https://www.linkedin.com/in/ashan-perera', github: 'https://github.com/ashanp', website: '' },
  experience: [
    {
      id: 'exp-s1-1', role: 'Software Engineering Intern', organization: 'IFS', startMonth: '2026-01', endMonth: '2026-06',
      description: 'Built React components for an internal dashboard and wrote unit tests.',
    },
  ],
  education: [
    { id: 'edu-s1-1', school: 'University of Moratuwa', degree: 'BSc Engineering', field: 'Computer Science & Engineering', startYear: '2024', endYear: '2028' },
  ],
  certificates: [],
  projects: [
    {
      id: 'proj-s1-1', title: 'Campus events app', description: 'A React app that lists faculty events with reminders.',
      url: 'https://github.com/ashanp/campus-events', skills: ['React', 'Firebase'],
    },
  ],
  languages: [
    { name: 'Sinhala', level: 'Native' },
    { name: 'English', level: 'Fluent' },
  ],
  skills: ['JavaScript', 'React', 'Figma'],
  workPreferences: { openToOpportunities: true, desiredRoles: ['Frontend engineer intern'], workTypes: ['Internship'], arrangements: ['Hybrid', 'Remote'] },
  visibility: { isPublic: true, showEmail: false, showPhone: false },
};
