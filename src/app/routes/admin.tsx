import { lazy } from 'react';
import { Flag, LayoutDashboard, ShieldCheck, Users } from 'lucide-react';
import { paths } from '@/app/paths';
import { comingSoon } from './comingSoon';
import type { RoleArea } from './types';

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const MentorVerificationPage = lazy(() => import('@/pages/admin/MentorVerificationPage'));

// order here determines sidebar position
export const adminArea: RoleArea = {
  role: 'ADMIN',
  basePath: paths.admin.home,
  routes: [
    { element: <AdminDashboardPage />, nav: { label: 'Overview', icon: LayoutDashboard } },
    { path: paths.admin.verification, element: <MentorVerificationPage />, nav: { label: 'Mentor verification', icon: ShieldCheck } },
    comingSoon(paths.admin.users, 'Users', Users),
    comingSoon(paths.admin.reports, 'Reports', Flag),
  ],
};
