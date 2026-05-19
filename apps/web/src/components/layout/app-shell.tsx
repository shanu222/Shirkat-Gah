import { Navigation } from '@/components/layout/navigation';
import { DashboardShell } from '@/components/layout/dashboard-shell';

interface AppShellProps {
  children: React.ReactNode;
  /** Marketing pages use top nav; app pages use sidebar dashboard layout */
  variant?: 'marketing' | 'dashboard';
  title?: string;
}

export function AppShell({ children, variant = 'marketing', title }: AppShellProps) {
  if (variant === 'dashboard') {
    return <DashboardShell title={title}>{children}</DashboardShell>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col gradient-mesh">
      <Navigation />
      <main id="main-content" className="flex-1 overflow-x-hidden" tabIndex={-1}>
        {children}
      </main>
      <footer className="border-t border-border/80 bg-card/50 backdrop-blur-sm py-8 mt-auto">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Shirkat Gah — Women&apos;s Resource Centre
            </p>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground" aria-label="Footer">
              <a href="/dashboard/public" className="hover:text-primary transition-colors focus-ring rounded-sm">
                Public Dashboard
              </a>
              <a href="/lms" className="hover:text-primary transition-colors focus-ring rounded-sm">
                Learning
              </a>
              <a href="/auth/login" className="hover:text-primary transition-colors focus-ring rounded-sm">
                Portal Login
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
