import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Database,
  GraduationCap,
  DollarSign,
  FileText,
  Globe,
  BarChart3,
  Shield,
} from 'lucide-react';

/** Shared navigation item shape for sidebar and top nav RBAC filtering */
export type NavItemConfig = {
  path: string;
  label: string;
  icon: LucideIcon;
  auth?: boolean;
  roles?: string[];
};

export type SidebarGroup = {
  label: string;
  items: NavItemConfig[];
};

export const sidebarNavGroups: SidebarGroup[] = [
  {
    label: 'Overview',
    items: [
      { path: '/dashboard/leadership', label: 'Leadership', icon: BarChart3 },
      { path: '/dashboard/projects', label: 'Projects', icon: LayoutDashboard },
      { path: '/dashboard/public', label: 'Public Impact', icon: Globe },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/data', label: 'Data Management', icon: Database, auth: true },
      { path: '/finance', label: 'Finance', icon: DollarSign, auth: true },
      { path: '/reports', label: 'Reports', icon: FileText, auth: true },
      { path: '/lms', label: 'Learning', icon: GraduationCap },
    ],
  },
  {
    label: 'Administration',
    items: [{ path: '/admin', label: 'Admin', icon: Shield, roles: ['super_admin', 'admin'] }],
  },
];

/** Marketing top navigation items */
export const marketingNavItems: NavItemConfig[] = [
  { path: '/', label: 'Home', icon: Globe },
  { path: '/dashboard/leadership', label: 'Leadership', icon: BarChart3, auth: true },
  { path: '/dashboard/projects', label: 'Projects', icon: LayoutDashboard, auth: true },
  { path: '/dashboard/public', label: 'Public Impact', icon: Globe },
  { path: '/data', label: 'Data', icon: Database, auth: true },
  { path: '/lms', label: 'Learning', icon: GraduationCap },
  { path: '/finance', label: 'Finance', icon: DollarSign, auth: true },
  { path: '/reports', label: 'Reports', icon: FileText, auth: true },
  { path: '/admin', label: 'Admin', icon: Shield, roles: ['super_admin', 'admin'] },
];

/**
 * Filter navigation items by role. Items without `roles` are visible to everyone.
 * Items with `roles` require at least one matching user role.
 */
export function filterNavItemsByRole(
  items: NavItemConfig[],
  userRoles: string[] | undefined,
): NavItemConfig[] {
  return items.filter((item) => {
    if (item.roles?.length && userRoles?.length) {
      return item.roles.some((role) => userRoles.includes(role));
    }
    if (item.roles?.length && !userRoles?.length) {
      return false;
    }
    return true;
  });
}
