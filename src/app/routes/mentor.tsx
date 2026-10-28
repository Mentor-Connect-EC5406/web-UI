import { lazy } from 'react';
import { Calendar, CalendarClock, LayoutDashboard, MessageSquare, User, Users } from 'lucide-react';
import { paths } from '@/app/paths';
import { comingSoon } from './comingSoon';
import type { RoleArea } from './types';

const MentorDashboardPage = lazy(() => import('@/pages/mentor/MentorDashboardPage'));
const AvailabilityPage = lazy(() => import('@/pages/mentor/AvailabilityPage'));
const EditMentorProfilePage = lazy(() => import('@/pages/mentor/EditMentorProfilePage'));

// order here determines sidebar position
export const mentorArea: RoleArea = {
  role: 'MENTOR',
  basePath: paths.mentorArea.home,
  routes: [
    { element: <MentorDashboardPage />, nav: { label: 'Overview', icon: LayoutDashboard } },
    comingSoon(paths.mentorArea.sessions, 'Sessions', Calendar),
    { path: paths.mentorArea.availability, element: <AvailabilityPage />, nav: { label: 'Availability', icon: CalendarClock } },
    comingSoon(paths.mentorArea.students, 'Students', Users),
    comingSoon(paths.mentorArea.messages, 'Messages', MessageSquare),
    { path: paths.mentorArea.profile, element: <EditMentorProfilePage />, nav: { label: 'Profile', icon: User } },
  ],
};
