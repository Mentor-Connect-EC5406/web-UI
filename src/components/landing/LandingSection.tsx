import type { ReactNode } from 'react';

interface LandingSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  /** Grey background, used to alternate sections */
  muted?: boolean;
  children: ReactNode;
}

/** Shared width, spacing and heading for every landing-page section */
export function LandingSection({ id, title, subtitle, muted, children }: LandingSectionProps) {
  return (
    <section id={id} aria-labelledby={id && `${id}-title`} className={muted ? 'bg-page' : 'bg-surface'}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 id={id && `${id}-title`} className="text-center text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-2 max-w-2xl text-center text-ink-secondary">{subtitle}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
