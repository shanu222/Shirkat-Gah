'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type GlassCardVariant = 'default' | 'stat' | 'premium';

interface GlassCardProps {
  className?: string;
  variant?: GlassCardVariant;
  interactive?: boolean;
  glow?: boolean;
  float?: boolean;
  children?: React.ReactNode;
}

const variantClass: Record<GlassCardVariant, string> = {
  default: 'glass-card',
  stat: 'glass-card-stat',
  premium: 'glass-card-premium',
};

export function GlassCard({
  className,
  variant = 'default',
  interactive = false,
  glow = false,
  float = false,
  children,
}: GlassCardProps) {
  const classes = cn(
    variantClass[variant],
    interactive && 'glass-card-interactive',
    glow && 'glass-card-glow',
    className,
  );

  const hoverMotion = interactive
    ? { y: -6, scale: 1.01 }
    : undefined;

  if (!interactive && !float) {
    return <div className={classes}>{children}</div>;
  }

  return (
    <motion.div
      className={classes}
      whileHover={hoverMotion}
      animate={float ? { y: [0, -5, 0] } : undefined}
      transition={
        float
          ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
