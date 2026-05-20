'use client';

import { useEffect, useState } from 'react';

/** Soft ambient glow that follows the cursor on desktop — subtle, non-distracting */
export function PremiumCursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || coarse || window.innerWidth < 1024) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-[5] hidden lg:block"
      style={{
        left: pos.x,
        top: pos.y,
        width: 420,
        height: 420,
        transform: 'translate(-50%, -50%)',
        background:
          'radial-gradient(circle, rgba(168, 85, 247, 0.14) 0%, rgba(217, 70, 239, 0.06) 35%, transparent 70%)',
        filter: 'blur(40px)',
        transition: 'left 0.35s cubic-bezier(0.22, 1, 0.36, 1), top 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      aria-hidden
    />
  );
}
