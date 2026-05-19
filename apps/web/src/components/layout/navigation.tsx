'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Database,
  GraduationCap,
  DollarSign,
  FileText,
  Users,
  Globe,
  BarChart3,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  Search,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
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

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNav = navItems.filter((item) => {
    if (item.roles && session?.user?.roles) {
      return item.roles.some((r) => session.user.roles.includes(r));
    }
    return true;
  });

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {filteredNav.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link key={item.path} href={item.path} onClick={() => mobile && setMobileOpen(false)}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                mobile ? 'w-full justify-start gap-2' : 'gap-2 text-sm',
                isActive && 'bg-primary/10 text-primary hover:bg-primary/20',
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 gradient-emerald rounded-lg flex items-center justify-center shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-lg text-foreground leading-tight">Shirkat Gah</h1>
                <p className="text-xs text-muted-foreground">Digital Platform</p>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-1">
              <NavLinks />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {session ? (
              <>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                </Button>
                <Link href="/admin">
                  <Button variant="ghost" size="icon" aria-label="Settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-2 mt-8">
                <NavLinks mobile />
                <div className="border-t border-border pt-4 mt-4 flex flex-col gap-2">
                  {session ? (
                    <Button variant="outline" onClick={() => signOut()} className="gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-primary">Sign In</Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
