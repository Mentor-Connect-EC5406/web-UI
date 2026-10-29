import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Check, Handshake, Presentation, type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import { paths } from '@/app/paths';
import { LandingSection } from './LandingSection';

interface Service {
  icon: LucideIcon;
  title: string;
  summary: string;
  highlights: string[];
  /** Omit for services that are not available yet */
  action?: { label: string; to: string };
}

const SERVICES: Service[] = [
  {
    icon: CalendarCheck,
    title: 'One-to-one sessions',
    summary:
      'Book a single, focused session with an industry mentor. Bring your questions or goals and leave with clear, practical next steps.',
    highlights: ['CV and portfolio reviews', 'Interview preparation', 'Answers to specific career questions'],
    action: { label: 'Book a session', to: paths.mentors },
  },
  {
    icon: Handshake,
    title: 'Long-term mentorship',
    summary:
      'Find a mentor who guides you over months, not minutes. Set goals together and get steady support from your first day at university all the way into your first job.',
    highlights: ['Shared goals and milestones', 'Regular check-ins', 'Ongoing career guidance'],
    action: { label: 'Find a long-term mentor', to: paths.mentors },
  },
  {
    icon: Presentation,
    title: 'Tech events',
    summary:
      'Join workshops, talks and networking events run by industry professionals. Learn what companies look for and meet the people behind them.',
    highlights: ['Workshops and tech talks', 'Networking with professionals', 'Hands-on learning'],
  },
];

function ServiceCard({ service, index, isInView }: { service: Service; index: number; isInView: boolean }) {
  const { icon: Icon, title, summary, highlights, action } = service;

  return (
    <div className="relative h-full w-full perspective-1400">
      <div
        className={cn(
          'relative h-full w-full rounded-2xl preserve-3d transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)]',
          isInView ? 'rotate-y-0' : 'rotate-y-180'
        )}
        style={{ transitionDelay: `${index * 200}ms` }}
      >
        {/* FRONT FACE: Reveals the correct details when scrolled into view */}
        <div className="h-full w-full backface-hidden">
          <Card className="flex h-full flex-col justify-between rounded-2xl border border-line/60 bg-white p-7 shadow-xs transition hover:shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl border border-[#e5e7eb] bg-[#f0f2f5]">
                  <Icon className="size-6 text-ink" aria-hidden />
                </span>
                {!action && (
                  <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                    Coming soon
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{summary}</p>
              <ul className="mt-5 space-y-2.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink">
                    <Check className="size-4 shrink-0 text-success" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>
            {action && (
              <div className="mt-6 pt-2">
                <Link
                  to={action.to}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:bg-surface-subtle"
                >
                  {action.label} <ArrowRight className="size-3.5" />
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* BACK FACE: The opposite side initially shown; flips to front on reach */}
        <div className="absolute inset-0 size-full backface-hidden rotate-y-180">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-line/60 bg-white p-7 text-center shadow-xs">
            <span className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#e5e7eb] bg-[#f0f2f5] shadow-xs">
              <img src="/brand/mentor-cap-mark.png" alt="" className="size-9 object-contain" />
            </span>
            <span className="inline-block rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-muted">
              {action ? 'Available now' : 'Coming soon'}
            </span>
            <h4 className="mt-3 text-base font-bold text-ink">MentorConnect</h4>
            <p className="mt-1 text-xs text-ink-secondary">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The three ways MentorConnect helps students, with bidirectional scroll-driven 3D flip */
export function ServicesSection() {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <LandingSection
      id="services"
      title="How MentorConnect helps you"
      subtitle="Three ways to get the guidance you need, whenever you need it."
      className="pt-6 sm:pt-10 lg:pt-14"
      muted
    >
      <div ref={ref} className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
        {SERVICES.map((service, index) => (
          <ServiceCard
            key={service.title}
            service={service}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>
    </LandingSection>
  );
}
