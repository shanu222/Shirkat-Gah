import { Navigation } from '@/components/layout/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-muted/30 py-8 mt-auto">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Shirkat Gah — Women&apos;s Resource Centre
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/dashboard/public" className="hover:text-primary transition-colors">
                Public Dashboard
              </a>
              <a href="/lms" className="hover:text-primary transition-colors">
                Learning
              </a>
              <a href="/auth/login" className="hover:text-primary transition-colors">
                Portal Login
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
