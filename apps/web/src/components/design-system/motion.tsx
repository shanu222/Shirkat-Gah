'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  duration?: number;
}

export function FadeIn({ className, delay = 0, duration = 0.4, children, ...props }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      exit={fadeInUp.exit}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ className, children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ className, children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={className}
      variants={staggerItem}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScaleOnHoverProps extends HTMLMotionProps<'div'> {
  scale?: number;
}

export function ScaleOnHover({ className, scale = 1.01, children, ...props }: ScaleOnHoverProps) {
  return (
    <motion.div
      className={cn('will-change-transform', className)}
      whileHover={{ scale, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.995 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
