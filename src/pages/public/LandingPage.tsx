import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle2, Search, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroSection } from '@/components/landing/HeroSection';
import { LandingSection } from '@/components/landing/LandingSection';
import { MentorSearchSection } from '@/components/landing/MentorSearchSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { paths } from '@/app/paths';

const STEPS = [
  { icon: Search, title: 'Find your mentor', text: 'Search by skill or industry and compare mentor profiles.' },
  { icon: Calendar, title: 'Book a session', text: 'Pick an available time, share your goals and confirm.' },
  { icon: Sprout, title: 'Learn and grow', text: 'Meet online and leave with clear, practical next steps.' },
];

const MENTOR_BENEFITS = ['Flexible schedule', 'Set your own rate', 'Make a real impact', 'Grow your network'];

/** Public home page. Sections alternate white / grey backgrounds. */
export default function LandingPage() {
  const { hash } = useLocation();

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
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-soft">
                <step.icon className="size-7 text-ink" aria-hidden />
              </div>
              <p className="mt-4 text-xs font-medium text-ink-muted">Step {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{step.text}</p>
            </li>
          ))}
        </ol>
      </LandingSection>

      <LandingSection title="Share your expertise, shape careers" subtitle="Help the next generation while growing your own network.">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {MENTOR_BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-ink">
              <CheckCircle2 className="size-4 text-success" aria-hidden /> {benefit}
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link to={paths.signup}>Become a mentor <ArrowRight /></Link>
          </Button>
        </div>
      </LandingSection>
    </>
  );
}
