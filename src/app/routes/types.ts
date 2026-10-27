import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '@/types';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface AreaRoute {
  // absolute path from paths, omit for the area index route
  path?: string;
  element: ReactNode;
  // when present the page also appears in the sidebar
  nav?: { label: string; icon: LucideIcon };
}

// a signed in area with its role guard, base path and page list
export interface RoleArea {
  role: Role;
  basePath: string;
  routes: AreaRoute[];
}
