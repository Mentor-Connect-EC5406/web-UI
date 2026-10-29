import { INDUSTRIES } from '@/config/options';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import { LandingSection } from './LandingSection';

/**
 * Explore mentors by industry field from the home page.
 * Displays 20 non-clickable category pills arranged in 5 per row across 4 lines.
 * Features a 50% opacity premium gray background and bidirectional left/right converging entrance transition.
 */
export function MentorSearchSection() {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <LandingSection
      id="industries"
      title="Find the mentor for your field"
      subtitle="Explore top industries and connect with experts who match your career goals."
      className="overflow-hidden pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 lg:pb-20 scroll-mt-16"
    >
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-5">
          {INDUSTRIES.map((field, index) => {
            const col = index % 5;
            const row = Math.floor(index / 5);

            // Left side categories come from the left; right side categories come from the right
            const isLeft = col < 2;
            const isCenter = col === 2;

            const initialTransform = isLeft
              ? '-translate-x-16 sm:-translate-x-24 opacity-0'
              : isCenter
                ? 'translate-y-8 scale-95 opacity-0'
                : 'translate-x-16 sm:translate-x-24 opacity-0';

            return (
              <div
                key={field}
                className={cn(
                  'flex items-center justify-center rounded-full border border-gray-200/80 bg-[#f0f2f5]/50 px-3.5 py-2.5 text-center text-xs font-semibold text-ink shadow-2xs backdrop-blur-xs transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-sm select-none',
                  isInView ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : initialTransform
                )}
                style={{
                  transitionDelay: `${row * 90 + (isLeft ? col * 70 : isCenter ? 120 : (4 - col) * 70)}ms`,
                }}
              >
                {field}
              </div>
            );
          })}
        </div>
      </div>
    </LandingSection>
  );
}
