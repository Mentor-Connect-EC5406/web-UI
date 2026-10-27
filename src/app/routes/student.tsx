import { lazy } from 'react';
import { Bookmark, Calendar, LayoutDashboard, MessageSquare, Search, Target, User } from 'lucide-react';
import { paths } from '@/app/paths';
import { comingSoon } from './comingSoon';
import type { RoleArea } from './types';

const StudentDashboardPage = lazy(() => import('@/pages/student/StudentDashboardPage'));
const MentorsPage = lazy(() => import('@/pages/public/MentorsPage'));
const MentorProfilePage = lazy(() => import('@/pages/public/MentorProfilePage'));
const MySessionsPage = lazy(() => import('@/pages/student/MySessionsPage'));
const StudentProfilePage = lazy(() => import('@/pages/student/StudentProfilePage'));

// order here determines sidebar position
export const studentArea: RoleArea = {
  role: 'STUDENT',
  basePath: paths.student.home,
  routes: [
    { element: <StudentDashboardPage />, nav: { label: 'Overview', icon: LayoutDashboard } },
    { path: paths.student.mentors, element: <MentorsPage profilePath={paths.student.mentor} />, nav: { label: 'Find mentors', icon: Search } },
    { path: paths.student.mentor(':id'), element: <MentorProfilePage backPath={paths.student.mentors} /> },
    { path: paths.student.sessions, element: <MySessionsPage />, nav: { label: 'My sessions', icon: Calendar } },
    comingSoon(paths.student.goals, 'Career goals', Target),
    comingSoon(paths.student.messages, 'Messages', MessageSquare),
    comingSoon(paths.student.saved, 'Saved mentors', Bookmark),
    { path: paths.student.profile, element: <StudentProfilePage />, nav: { label: 'Profile', icon: User } },
  ],
};
