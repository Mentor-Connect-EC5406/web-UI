import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface LandingSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  /** Grey background, used to alternate sections */
  muted?: boolean;
  className?: string;
  children: ReactNode;
}

/** Shared width, spacing and heading for every landing-page section */
export function LandingSection({ id, title, subtitle, muted, className, children }: LandingSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={id && `${id}-title`}
      className={cn(muted ? 'bg-page' : 'bg-surface', className)}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2
          id={id && `${id}-title`}
          className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[40px]"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-center text-base sm:text-lg text-ink-secondary">
            {subtitle}
          </p>
        )}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
