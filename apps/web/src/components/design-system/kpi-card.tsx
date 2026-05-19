'use client';

import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScaleOnHover } from '@/components/design-system/motion';

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
  gradient = 'from-emerald-500 to-teal-500',
  className,
}: KpiCardProps) {
  const TrendIcon = trend === 'down' ? TrendingDown : TrendingUp;

  return (
    <ScaleOnHover>
      <Card className={cn('surface-interactive overflow-hidden group', className)}>
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div
              className={cn(
                'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md',
                'ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105',
                gradient,
              )}
              aria-hidden
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            {change && (
              <Badge
                variant="secondary"
                className={cn(
                  'text-xs font-medium tabular-nums shrink-0',
                  trend === 'up' && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
                  trend === 'down' && 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
                )}
              >
                {change}
                {trend !== 'neutral' && <TrendIcon className="w-3 h-3 ml-1 inline" aria-hidden />}
              </Badge>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums text-foreground mb-1">
            {value}
          </p>
          <p className="text-sm text-muted-foreground leading-snug">{label}</p>
        </CardContent>
      </Card>
    </ScaleOnHover>
  );
}

export function KpiGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5', className)}>
      {children}
    </div>
  );
}
