import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  /** Chart height in px */
  height?: number;
}

export function ChartCard({
  title,
  description,
  children,
  action,
  className,
  height = 300,
}: ChartCardProps) {
  return (
    <Card className={cn('surface-elevated overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div className="space-y-1 min-w-0">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && <CardDescription className="text-sm">{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-2">
        <div className="w-full min-w-0" style={{ height }} aria-label={title}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6 rounded-xl border border-dashed border-border/80 bg-muted/30',
        className,
      )}
      role="status"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const statusStyles = {
  success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  error: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  info: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status, children, icon: Icon, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status],
        className,
      )}
    >
      {Icon && <Icon className="w-3 h-3" aria-hidden />}
      {children}
    </span>
  );
}

interface AlertBannerProps {
  variant?: 'warning' | 'info' | 'error';
  children: React.ReactNode;
  className?: string;
}

const alertStyles = {
  warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-100',
  info: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200/80 dark:border-sky-800/50 text-sky-900 dark:text-sky-100',
  error: 'bg-red-50 dark:bg-red-950/30 border-red-200/80 dark:border-red-800/50 text-red-900 dark:text-red-100',
};

export function AlertBanner({ variant = 'info', children, className }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className={cn('flex items-start gap-2.5 p-3.5 rounded-xl border text-sm', alertStyles[variant], className)}
    >
      {children}
    </div>
  );
}

export function DashboardSkeleton({ kpiCount = 4 }: { kpiCount?: number }) {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-16 bg-muted rounded-xl max-w-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: kpiCount }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="h-80 bg-muted rounded-xl" />
        <div className="h-80 bg-muted rounded-xl" />
      </div>
    </div>
  );
}
