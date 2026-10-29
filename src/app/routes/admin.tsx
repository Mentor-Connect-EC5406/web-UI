import { lazy } from 'react';
import { Flag, LayoutDashboard, ShieldCheck, Users } from 'lucide-react';
import { paths } from '@/app/paths';
import type { RoleArea } from './types';

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const MentorVerificationPage = lazy(() => import('@/pages/admin/MentorVerificationPage'));
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'));
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'));

// order here determines sidebar position
export const adminArea: RoleArea = {
  role: 'ADMIN',
  basePath: paths.admin.home,
  routes: [
    { element: <AdminDashboardPage />, nav: { label: 'Overview', icon: LayoutDashboard } },
    { path: paths.admin.verification, element: <MentorVerificationPage />, nav: { label: 'Mentor verification', icon: ShieldCheck } },
    { path: paths.admin.users, element: <UsersPage />, nav: { label: 'Users', icon: Users } },
    { path: paths.admin.reports, element: <ReportsPage />, nav: { label: 'Reports', icon: Flag } },
  ],
};
