'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  Users,
  Menu,
  Moon,
  Sun,
  Bell,
  Search,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { filterNavItemsByRole, marketingNavItems } from '@/components/layout/nav-config';

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filteredNav = filterNavItemsByRole(marketingNavItems, session?.user?.roles);

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {filteredNav.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => mobile && setMobileOpen(false)}
            className={cn(
              'relative group',
              mobile ? 'block w-full' : 'inline-flex',
            )}
          >
            <span
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                mobile ? 'w-full' : '',
                isActive
                  ? 'text-fuchsia-200'
                  : 'text-white/85 hover:text-white',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </span>
            {!mobile && (
              <span
                className={cn(
                  'absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-fuchsia-400 to-pink-400 transition-transform origin-left',
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                )}
              />
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/15 bg-[rgba(15,8,25,0.72)] backdrop-blur-xl shadow-lg shadow-purple-950/20'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="page-container">
        <div className="flex justify-between items-center h-16 lg:h-[4.25rem]">
          <div className="flex items-center gap-4 lg:gap-10">
            <Link href="/" className="flex items-center gap-3 shrink-0 focus-ring rounded-lg">
              <div className="w-10 h-10 gradient-feminist rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/25">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-base text-white leading-tight tracking-tight">
                  Shirkat Gah
                </h1>
                <p className="text-[11px] text-white/60">Women&apos;s Resource Centre</p>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-1">
              <NavLinks />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link href="/search">
              <Button variant="glass" size="icon" aria-label="Search">
                <Search className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="glass"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {session ? (
              <>
                <Button variant="glass" size="icon" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                </Button>
                <Link href="/admin">
                  <Button variant="glass" size="icon" aria-label="Settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="glass" size="sm" onClick={() => signOut()} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" variant="hero">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="glass" size="icon" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100vw-2rem,320px)] glass border-white/20 bg-[rgba(15,8,25,0.92)] backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-1 mt-10">
                <NavLinks mobile />
                <div className="section-divider my-6" />
                {session ? (
                  <Button variant="glass" onClick={() => signOut()} className="gap-2 w-full">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="hero" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
