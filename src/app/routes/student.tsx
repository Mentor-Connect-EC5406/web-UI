import { lazy } from 'react';
import { Bookmark, Calendar, Handshake, LayoutDashboard, MessageSquare, Search, Target, User } from 'lucide-react';
import { paths } from '@/app/paths';
import { isFeatureOn } from '@/config/features';
import type { AreaRoute, RoleArea } from './types';

const StudentDashboardPage = lazy(() => import('@/pages/student/StudentDashboardPage'));
const StudentMentorsPage = lazy(() => import('@/pages/student/StudentMentorsPage'));
const MentorProfilePage = lazy(() => import('@/pages/public/MentorProfilePage'));
const SessionsPage = lazy(() => import('@/pages/shared/SessionsPage'));
const SessionDetailPage = lazy(() => import('@/pages/shared/SessionDetailPage'));
const MentorshipsPage = lazy(() => import('@/pages/shared/MentorshipsPage'));
const CareerGoalsPage = lazy(() => import('@/pages/student/CareerGoalsPage'));
const MessagesPage = lazy(() => import('@/pages/shared/MessagesPage'));
const SavedMentorsPage = lazy(() => import('@/pages/student/SavedMentorsPage'));
const StudentProfilePage = lazy(() => import('@/pages/student/StudentProfilePage'));
const StudentProfilePreviewPage = lazy(() => import('@/pages/student/StudentProfilePreviewPage'));

// waits for the mentorship api, see config/features.ts
const mentorships: AreaRoute[] = isFeatureOn('mentorships')
  ? [{ path: paths.student.mentorships, element: <MentorshipsPage role="STUDENT" />, nav: { label: 'Mentorships', icon: Handshake } }]
  : [];

// order here determines sidebar position
export const studentArea: RoleArea = {
  role: 'STUDENT',
  basePath: paths.student.home,
  routes: [
    { element: <StudentDashboardPage />, nav: { label: 'Overview', icon: LayoutDashboard } },
    { path: paths.student.mentors, element: <StudentMentorsPage />, nav: { label: 'Find mentors', icon: Search } },
    { path: paths.student.mentor(':id'), element: <MentorProfilePage backPath={paths.student.mentors} /> },
    { path: paths.student.sessions, element: <SessionsPage role="STUDENT" />, nav: { label: 'My sessions', icon: Calendar } },
    { path: paths.student.session(':id'), element: <SessionDetailPage role="STUDENT" /> },
    ...mentorships,
    { path: paths.student.goals, element: <CareerGoalsPage />, nav: { label: 'Career goals', icon: Target } },
    {
      path: paths.student.messages,
      element: <MessagesPage emptyHint="Find a mentor and send them a message to get started." contactNoun="mentors" />,
      nav: { label: 'Messages', icon: MessageSquare },
    },
    { path: paths.student.saved, element: <SavedMentorsPage />, nav: { label: 'Saved mentors', icon: Bookmark } },
    { path: paths.student.profile, element: <StudentProfilePage />, nav: { label: 'Profile', icon: User } },
    { path: paths.student.profilePreview, element: <StudentProfilePreviewPage /> },
  ],
};
