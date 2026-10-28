import { lazy } from 'react';
import { Bookmark, Calendar, LayoutDashboard, MessageSquare, Search, Target, User } from 'lucide-react';
import { paths } from '@/app/paths';
import type { RoleArea } from './types';

const StudentDashboardPage = lazy(() => import('@/pages/student/StudentDashboardPage'));
const StudentMentorsPage = lazy(() => import('@/pages/student/StudentMentorsPage'));
const MentorProfilePage = lazy(() => import('@/pages/public/MentorProfilePage'));
const MySessionsPage = lazy(() => import('@/pages/student/MySessionsPage'));
const CareerGoalsPage = lazy(() => import('@/pages/student/CareerGoalsPage'));
const MessagesPage = lazy(() => import('@/pages/shared/MessagesPage'));
const SavedMentorsPage = lazy(() => import('@/pages/student/SavedMentorsPage'));
const StudentProfilePage = lazy(() => import('@/pages/student/StudentProfilePage'));
const StudentProfilePreviewPage = lazy(() => import('@/pages/student/StudentProfilePreviewPage'));

// order here determines sidebar position
export const studentArea: RoleArea = {
  role: 'STUDENT',
  basePath: paths.student.home,
  routes: [
    { element: <StudentDashboardPage />, nav: { label: 'Overview', icon: LayoutDashboard } },
    { path: paths.student.mentors, element: <StudentMentorsPage />, nav: { label: 'Find mentors', icon: Search } },
    { path: paths.student.mentor(':id'), element: <MentorProfilePage backPath={paths.student.mentors} /> },
    { path: paths.student.sessions, element: <MySessionsPage />, nav: { label: 'My sessions', icon: Calendar } },
    { path: paths.student.goals, element: <CareerGoalsPage />, nav: { label: 'Career goals', icon: Target } },
    {
      path: paths.student.messages,
      element: <MessagesPage emptyHint="Book a session with a mentor to start a conversation." />,
      nav: { label: 'Messages', icon: MessageSquare },
    },
    { path: paths.student.saved, element: <SavedMentorsPage />, nav: { label: 'Saved mentors', icon: Bookmark } },
    { path: paths.student.profile, element: <StudentProfilePage />, nav: { label: 'Profile', icon: User } },
    { path: paths.student.profilePreview, element: <StudentProfilePreviewPage /> },
  ],
};
