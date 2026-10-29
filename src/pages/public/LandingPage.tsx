import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HeroSection } from '@/components/landing/HeroSection';
import { LandingSection } from '@/components/landing/LandingSection';
import { MentorSearchSection } from '@/components/landing/MentorSearchSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import { paths } from '@/app/paths';

const STEPS = [
  { title: 'Find your mentor', text: 'Search by skill or industry and compare mentor profiles.' },
  { title: 'Book a session', text: 'Pick an available time, share your goals and confirm.' },
  { title: 'Learn and grow', text: 'Meet online and leave with clear, practical next steps.' },
];

const MENTOR_BENEFITS = ['Flexible schedule', 'Set your own rate', 'Make a real impact', 'Grow your network'];

/** Public home page matching the modern design specifications. */
export default function LandingPage() {
  const { hash } = useLocation();
  const { ref: stepsRef, isInView: stepsInView } = useInView({ threshold: 0.15 });

  // Scroll to "#how-it-works" when arriving from a nav link
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <>
      <HeroSection />

      <ServicesSection />

      <MentorSearchSection />

      <LandingSection id="how-it-works" title="How it works" subtitle="Three steps to your next mentoring session" muted>
        <div ref={stepsRef}>
          <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="text-center">
                {/* 3D opposite flip transition applied ONLY to the step number parts */}
                <div className="relative inline-block perspective-1400">
                  <div
                    className={cn(
                      'relative preserve-3d transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)]',
                      stepsInView ? 'rotate-y-0' : 'rotate-y-180'
                    )}
                    style={{ transitionDelay: `${i * 180}ms` }}
                  >
                    {/* FRONT FACE: Revealed when scrolled into view */}
                    <div className="backface-hidden">
                      <p className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Step {i + 1}</p>
                    </div>

                    {/* BACK FACE: The opposite side initially shown; flips to front on reach */}
                    <div className="absolute inset-0 flex items-center justify-center backface-hidden rotate-y-180">
                      <p className="text-2xl font-extrabold tracking-tight text-ink-muted/50 sm:text-3xl select-none">
                        Step {i + 1}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="mt-2 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-secondary">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </LandingSection>

      {/* White gap separating the two gray sections */}
      <div className="h-14 sm:h-20 lg:h-24 bg-white" aria-hidden="true" />

      <section id="mentor" className="bg-[#f0f2f5] pt-10 pb-12 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[40px]">
            Share your expertise, shape careers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-secondary sm:text-lg">
            Help the next generation while growing your own network.
          </p>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 sm:gap-x-12 gap-y-4">
            {MENTOR_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2.5 sm:gap-3 text-base font-medium text-ink">
                <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden /> {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Ready to inspire the next generation?
            </h3>
            <Link
              to={paths.mentorRegistration}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-ink shadow-2xs transition hover:bg-brand-hover"
            >
              Become a mentor <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
