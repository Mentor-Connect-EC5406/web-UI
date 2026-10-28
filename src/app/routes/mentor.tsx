import { lazy } from 'react';
import { Calendar, CalendarClock, LayoutDashboard, MessageSquare, User, Users } from 'lucide-react';
import { paths } from '@/app/paths';
import type { RoleArea } from './types';

const MentorDashboardPage = lazy(() => import('@/pages/mentor/MentorDashboardPage'));
const MentorSessionsPage = lazy(() => import('@/pages/mentor/MentorSessionsPage'));
const MentorStudentsPage = lazy(() => import('@/pages/mentor/MentorStudentsPage'));
const MessagesPage = lazy(() => import('@/pages/shared/MessagesPage'));
const AvailabilityPage = lazy(() => import('@/pages/mentor/AvailabilityPage'));
const EditMentorProfilePage = lazy(() => import('@/pages/mentor/EditMentorProfilePage'));

// order here determines sidebar position
export const mentorArea: RoleArea = {
  role: 'MENTOR',
  basePath: paths.mentorArea.home,
  routes: [
    { element: <MentorDashboardPage />, nav: { label: 'Overview', icon: LayoutDashboard } },
    { path: paths.mentorArea.sessions, element: <MentorSessionsPage />, nav: { label: 'Sessions', icon: Calendar } },
    { path: paths.mentorArea.availability, element: <AvailabilityPage />, nav: { label: 'Availability', icon: CalendarClock } },
    { path: paths.mentorArea.students, element: <MentorStudentsPage />, nav: { label: 'Students', icon: Users } },
    {
      path: paths.mentorArea.messages,
      element: <MessagesPage emptyHint="Conversations with your students appear here." />,
      nav: { label: 'Messages', icon: MessageSquare },
    },
    { path: paths.mentorArea.profile, element: <EditMentorProfilePage />, nav: { label: 'Profile', icon: User } },
  ],
};
