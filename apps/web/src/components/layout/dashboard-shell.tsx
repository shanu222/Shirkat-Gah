'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { PremiumCursorGlow } from '@/components/design-system';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
  children: React.ReactNode;
  /** Optional page title shown in mobile header */
  title?: string;
  className?: string;
}

export function DashboardShell({ children, title, className }: DashboardShellProps) {
  return (
    <div className="min-h-screen flex gradient-mesh relative">
      <PremiumCursorGlow />
      <div className="hidden lg:flex shrink-0">
        <AppSidebar />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <AppHeader title={title} />
        <main
          id="main-content"
          className={cn('flex-1 overflow-x-hidden', className)}
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
