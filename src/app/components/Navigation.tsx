import { useState } from 'react';
import { Link, useLocation } from 'react-router';
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
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Globe },
    { path: '/dashboard/leadership', label: 'Leadership Dashboard', icon: BarChart3 },
    { path: '/dashboard/projects', label: 'Projects', icon: LayoutDashboard },
    { path: '/data', label: 'Data Management', icon: Database },
    { path: '/lms', label: 'Learning', icon: GraduationCap },
    { path: '/finance', label: 'Finance', icon: DollarSign },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[--emerald] to-[--teal] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="font-semibold text-lg text-foreground">Shirkat Gah</h1>
                <p className="text-xs text-muted-foreground">Digital Platform</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.slice(1, 5).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn(
                        "gap-2 text-sm",
                        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/finance">
              <Button variant="ghost" size="sm" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Finance
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                Reports
              </Button>
            </Link>
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn(
                        "w-full justify-start gap-2",
                        isActive && "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <Button variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90 mt-4">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
