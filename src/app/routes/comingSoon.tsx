import { lazy } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { AreaRoute } from './types';

const ComingSoonPage = lazy(() => import('@/pages/system/ComingSoonPage'));

// placeholder for pages that are not built yet
export const comingSoon = (path: string, label: string, icon: LucideIcon): AreaRoute => ({
  path,
  nav: { label, icon },
  element: <ComingSoonPage title={label} />,
});
