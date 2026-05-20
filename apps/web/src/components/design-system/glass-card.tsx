'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  className?: string;
  interactive?: boolean;
  glow?: boolean;
  float?: boolean;
  children?: React.ReactNode;
}

export function GlassCard({
  className,
  interactive = false,
  glow = false,
  float = false,
  children,
}: GlassCardProps) {
  const classes = cn(
    interactive ? 'glass-card-interactive' : 'glass-card',
    glow && 'glass-card-glow',
    className,
  );

  if (!interactive && !float) {
    return <div className={classes}>{children}</div>;
  }

  return (
    <motion.div
      className={classes}
      whileHover={interactive ? { y: -4, scale: 1.01 } : undefined}
      animate={float ? { y: [0, -6, 0] } : undefined}
      transition={
        float
          ? { duration: 5, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
