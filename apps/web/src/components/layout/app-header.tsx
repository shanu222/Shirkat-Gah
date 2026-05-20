'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  Bell,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  title?: string;
  className?: string;
}

export function AppHeader({ title, className }: AppHeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : session?.user?.email?.slice(0, 2).toUpperCase() ?? 'SG';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 sm:h-16 items-center gap-3 border-b border-white/14',
        'bg-[rgba(20,20,28,0.88)] backdrop-blur-[18px] shadow-[0_4px_24px_rgba(0,0,0,0.28)]',
        'px-4 sm:px-6',
        className,
      )}
    >
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" aria-label="Open navigation menu">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 border-sidebar-border">
          <AppSidebar mobile onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      {title && (
        <h2 className="text-sm sm:text-base font-semibold text-foreground truncate lg:hidden">{title}</h2>
      )}

      <div className="flex-1 hidden md:flex max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden />
          <input
            type="search"
            placeholder="Search projects, reports, data…"
            className={cn(
              'w-full h-9 pl-9 pr-4 rounded-lg text-sm',
              'bg-muted/50 border border-border/60',
              'placeholder:text-muted-foreground/70',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background',
            )}
            aria-label="Search platform"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search"
          asChild
        >
          <Link href="/search">
            <Search className="w-4 h-4" />
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="relative"
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {session && (
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="w-4 h-4" />
          </Button>
        )}

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-2 sm:pr-3 h-9" aria-label="User menu">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
                  {session.user?.name ?? session.user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium truncate">{session.user?.name ?? 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/leadership" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/login">
            <Button size="sm" className="shadow-sm">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
