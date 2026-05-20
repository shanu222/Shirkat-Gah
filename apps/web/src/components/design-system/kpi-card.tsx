'use client';

import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
export interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  gradient?: string;
  className?: string;
}

export function KpiCard({
  label,
  value,
  change,
  trend = 'up',
  icon: Icon,
  gradient = 'from-fuchsia-500 to-pink-500',
  className,
}: KpiCardProps) {
  const TrendIcon = trend === 'down' ? TrendingDown : TrendingUp;

  return (
      <Card className={cn('glass-card-stat glass-card-interactive overflow-hidden group', className)}>
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div
              className={cn(
                'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center stat-icon-glow',
                'transition-transform duration-300 group-hover:scale-105',
                gradient,
              )}
              aria-hidden
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            {change && (
              <Badge
                variant="secondary"
                className={cn(
                  'text-xs font-medium tabular-nums shrink-0',
                  trend === 'up' && 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/25',
                  trend === 'down' && 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
                )}
              >
                {change}
                {trend !== 'neutral' && <TrendIcon className="w-3 h-3 ml-1 inline" aria-hidden />}
              </Badge>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-on-cinematic mb-1">
            {value}
          </p>
          <p className="text-sm text-muted-cinematic leading-snug">{label}</p>
        </CardContent>
      </Card>
  );
}

export function KpiGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5', className)}>
      {children}
    </div>
  );
}
