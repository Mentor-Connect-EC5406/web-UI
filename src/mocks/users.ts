import type { NewAccount, Role, StudentProfile, User } from '@/types';

/** One demo account per role, used by the demo sign-in */
export const DEMO_USERS: Record<Role, User> = {
  STUDENT: { id: 'student-1', name: 'Ashan Perera', email: 'ashan@university.lk', avatarUrl: null, role: 'STUDENT' },
  MENTOR: { id: 'mentor-1', name: 'Nimal Silva', email: 'nimal@mentorconnect.app', avatarUrl: null, role: 'MENTOR' },
  ADMIN: { id: 'admin-1', name: 'Admin User', email: 'admin@mentorconnect.app', avatarUrl: null, role: 'ADMIN' },
};

/** Identity the demo sign-up pretends the identity provider returned */
export const DEMO_NEW_ACCOUNT: NewAccount = { name: 'Kasun Fernando', email: 'kasun@example.com' };

// profile of the demo student, phone is left empty so the completeness hint has something to show
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
};
