import { lazy } from 'react';
import { Calendar, CalendarClock, Handshake, LayoutDashboard, MessageSquare, User, Users } from 'lucide-react';
import { paths } from '@/app/paths';
import { isFeatureOn } from '@/config/features';
import type { AreaRoute, RoleArea } from './types';

const MentorDashboardPage = lazy(() => import('@/pages/mentor/MentorDashboardPage'));
const SessionsPage = lazy(() => import('@/pages/shared/SessionsPage'));
const SessionDetailPage = lazy(() => import('@/pages/shared/SessionDetailPage'));
const MentorshipsPage = lazy(() => import('@/pages/shared/MentorshipsPage'));
const MentorStudentsPage = lazy(() => import('@/pages/mentor/MentorStudentsPage'));
const MessagesPage = lazy(() => import('@/pages/shared/MessagesPage'));
const AvailabilityPage = lazy(() => import('@/pages/mentor/AvailabilityPage'));
const EditMentorProfilePage = lazy(() => import('@/pages/mentor/EditMentorProfilePage'));

// waits for the mentorship api, see config/features.ts
const mentorships: AreaRoute[] = isFeatureOn('mentorships')
  ? [{ path: paths.mentorArea.mentorships, element: <MentorshipsPage role="MENTOR" />, nav: { label: 'Mentorships', icon: Handshake } }]
  : [];

// order here determines sidebar position
export const mentorArea: RoleArea = {
  role: 'MENTOR',
  basePath: paths.mentorArea.home,
  routes: [
    { element: <MentorDashboardPage />, nav: { label: 'Overview', icon: LayoutDashboard } },
    { path: paths.mentorArea.sessions, element: <SessionsPage role="MENTOR" />, nav: { label: 'Sessions', icon: Calendar } },
    { path: paths.mentorArea.session(':id'), element: <SessionDetailPage role="MENTOR" /> },
    ...mentorships,
    { path: paths.mentorArea.availability, element: <AvailabilityPage />, nav: { label: 'Availability', icon: CalendarClock } },
    { path: paths.mentorArea.students, element: <MentorStudentsPage />, nav: { label: 'Students', icon: Users } },
    {
      path: paths.mentorArea.messages,
      element: <MessagesPage emptyHint="Conversations with your students appear here." contactNoun="students" />,
      nav: { label: 'Messages', icon: MessageSquare },
    },
    { path: paths.mentorArea.profile, element: <EditMentorProfilePage />, nav: { label: 'Profile', icon: User } },
  ],
};
