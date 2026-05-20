'use client';

import { cn } from '@/lib/utils';

interface CinematicAtmosphereProps {
  className?: string;
  /** Show floating gradient blobs */
  blobs?: boolean;
  /** Subtle particle dots */
  particles?: boolean;
}

export function CinematicAtmosphere({
  className,
  blobs = true,
  particles = true,
}: CinematicAtmosphereProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      {blobs && (
        <>
          <div className="floating-blob absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div
            className="floating-blob absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl"
            style={{ animationDelay: '-4s' }}
          />
          <div
            className="floating-blob absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-pink-500/15 blur-3xl"
            style={{ animationDelay: '-8s' }}
          />
        </>
      )}
      {particles && (
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/60"
              style={{
                top: `${10 + (i * 7) % 80}%`,
                left: `${5 + (i * 11) % 90}%`,
                animation: `pulse-glow ${3 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
