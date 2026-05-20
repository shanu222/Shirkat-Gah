'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronLeft, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  filterNavItemsByRole,
  sidebarNavGroups,
  type NavItemConfig,
} from '@/components/layout/nav-config';

function NavItem({
  path,
  label,
  icon: Icon,
  collapsed,
  onNavigate,
}: {
  path: string;
  label: string;
  icon: NavItemConfig['icon'];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === path || (path !== '/' && pathname.startsWith(`${path}/`));

  const link = (
    <Link
      href={path}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon
        className={cn(
          'w-[18px] h-[18px] shrink-0 transition-colors',
          isActive ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-primary',
        )}
        aria-hidden
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {isActive && !collapsed && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" aria-hidden />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

interface AppSidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function AppSidebar({ mobile, onNavigate }: AppSidebarProps) {
  const { data: session } = useSession();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const isCollapsed = mobile ? false : collapsed;
  const userRoles = session?.user?.roles;

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'flex flex-col h-full glass-panel border-r border-white/14',
          mobile ? 'w-full' : isCollapsed ? 'w-[72px]' : 'w-[260px]',
          'transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        )}
        aria-label="Main navigation"
      >
        <div className={cn('flex items-center h-16 border-b border-sidebar-border shrink-0', isCollapsed ? 'px-3 justify-center' : 'px-4 gap-3')}>
          <Link href="/" className="flex items-center gap-3 min-w-0 focus-ring rounded-lg" onClick={onNavigate}>
            <div className="w-9 h-9 gradient-feminist rounded-lg flex items-center justify-center shadow-md shrink-0">
              <Users className="w-5 h-5 text-white" aria-hidden />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="font-semibold text-sm text-sidebar-foreground truncate">Shirkat Gah</p>
                <p className="text-[11px] text-sidebar-muted truncate">Enterprise Platform</p>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-thin space-y-6">
          {sidebarNavGroups.map((group) => {
            const items = filterNavItemsByRole(group.items, userRoles);
            if (items.length === 0) return null;

            return (
              <div key={group.label}>
                {!isCollapsed && (
                  <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5" role="list">
                  {items.map((item) => (
                    <li key={item.path}>
                      <NavItem
                        path={item.path}
                        label={item.label}
                        icon={item.icon}
                        collapsed={isCollapsed}
                        onNavigate={onNavigate}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        {!mobile && (
          <div className="p-3 border-t border-sidebar-border shrink-0">
            <Button
              variant="ghost"
              size={isCollapsed ? 'icon' : 'sm'}
              onClick={toggleSidebar}
              className={cn('w-full text-sidebar-muted hover:text-sidebar-foreground', !isCollapsed && 'justify-start gap-2')}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft className={cn('w-4 h-4 transition-transform duration-300', isCollapsed && 'rotate-180')} />
              {!isCollapsed && <span className="text-xs">Collapse</span>}
            </Button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}

export { sidebarNavGroups } from '@/components/layout/nav-config';
