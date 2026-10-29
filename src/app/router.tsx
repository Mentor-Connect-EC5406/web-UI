import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ForbiddenPage, NotFoundPage, PageErrorPage, RouteErrorPage } from '@/pages/system/StatusPages';
import { RequireRole } from './RequireRole';
import { authRoutes, publicRoutes } from './routes/public';
import { studentArea } from './routes/student';
import { mentorArea } from './routes/mentor';
import { adminArea } from './routes/admin';
import type { NavItem, RoleArea } from './routes/types';

// sidebar items come from the same route list so they never drift apart
const navItems = (area: RoleArea): NavItem[] =>
  area.routes.flatMap((r) => (r.nav ? [{ ...r.nav, to: r.path ?? area.basePath }] : []));

// role guard wraps the app shell which wraps a per-page error boundary
const buildArea = (area: RoleArea): RouteObject => ({
  path: area.basePath,
  element: <RequireRole role={area.role} />,
  children: [
    {
      element: <AppLayout nav={navItems(area)} />,
      children: [
        {
          // a page crash keeps the sidebar so the user can navigate away
          errorElement: <PageErrorPage />,
          children: area.routes.map((r) => (r.path ? { path: r.path, element: r.element } : { index: true, element: r.element })),
        },
      ],
    },
  ],
});

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      publicRoutes,
      authRoutes,
      ...[studentArea, mentorArea, adminArea].map(buildArea),
      { path: '/403', element: <ForbiddenPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
