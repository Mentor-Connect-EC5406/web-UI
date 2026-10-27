import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Check, Handshake, Presentation, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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

function ServiceCard({ service }: { service: Service }) {
  const { icon: Icon, title, summary, highlights, action } = service;
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft">
          <Icon className="size-6 text-ink" aria-hidden />
        </span>
        {!action && <Badge>Coming soon</Badge>}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{summary}</p>
      <ul className="mt-4 space-y-2">
        {highlights.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-ink">
            <Check className="size-4 shrink-0 text-success" aria-hidden /> {item}
          </li>
        ))}
      </ul>
      {action && (
        <Button asChild variant="secondary" className="mt-6 self-start">
          <Link to={action.to}>{action.label} <ArrowRight /></Link>
        </Button>
      )}
    </Card>
  );
}

/** The three ways MentorConnect helps students */
export function ServicesSection() {
  return (
    <LandingSection id="services" title="How MentorConnect helps you" subtitle="Three ways to get the guidance you need, whenever you need it." muted>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
    </LandingSection>
  );
}
