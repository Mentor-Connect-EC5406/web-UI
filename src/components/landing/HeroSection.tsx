import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Briefcase, GraduationCap, HeartHandshake, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { paths } from '@/app/paths';

const JOURNEY: { icon?: LucideIcon; title: string; text: string; highlight?: boolean }[] = [
  { icon: GraduationCap, title: 'University', text: 'Lectures, projects and exams' },
  { title: 'MentorConnect', text: 'Guidance from professionals who made the same move', highlight: true },
  { icon: Briefcase, title: 'Industry', text: 'Real teams, real deadlines, real expectations' },
];

/** The campus-to-career path, with MentorConnect as the bridge in the middle */
function GapBridge() {
  return (
    <ol aria-label="From university to industry" className="mx-auto w-full max-w-sm space-y-2">
      {JOURNEY.map((step, i) => (
        <li key={step.title}>
          <div
            className={cn(
              'flex items-center gap-4 rounded-2xl border p-4',
              step.highlight ? 'border-brand bg-brand-soft' : 'border-line bg-surface',
            )}
          >
            <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', step.highlight ? 'bg-surface' : 'bg-surface-subtle')}>
              {step.icon ? (
                <step.icon className="size-6 text-ink-secondary" aria-hidden />
              ) : (
                <img src="/brand/mentorconnect-mark.png" alt="" className="size-9" />
              )}
            </span>
            <span>
              <span className="block font-semibold text-ink">{step.title}</span>
              <span className="block text-sm text-ink-secondary">{step.text}</span>
            </span>
          </div>
          {i < JOURNEY.length - 1 && (
            <ArrowDown className="mx-auto mt-2 size-5 text-ink-muted" aria-hidden />
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * First thing visitors see: the university-to-industry gap, a reason for
 * students to join and for professionals to mentor.
 * Log in and sign up go through the auth pages, where the identity provider
 * (Asgardeo) is connected; the role is chosen after sign-up.
 */
export function HeroSection() {
  return (
    <section className="bg-surface px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-ink">From university to career</span>
          <h1 className="mt-6 text-4xl leading-tight font-bold text-ink sm:text-5xl">
            Bridge the gap between university and industry
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-secondary">
            University teaches you the theory. Industry expects experience. MentorConnect pairs you with
            professionals who have already made that move, so you step into your first role with confidence.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to={paths.signup}>Join as a student <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to={paths.login}>Log in</Link>
            </Button>
          </div>

          <div className="mt-8 flex max-w-xl items-start gap-3 rounded-2xl border border-line bg-page p-4">
            <HeartHandshake className="mt-0.5 size-5 shrink-0 text-ink-secondary" aria-hidden />
            <p className="text-sm text-ink-secondary">
              <span className="font-semibold text-ink">Working in industry?</span> You remember how hard that first
              step was. Share an hour of your experience and help the next generation find their way.{' '}
              <Link to={paths.signup} className="font-semibold text-ink underline-offset-4 hover:underline">
                Become a mentor
              </Link>
            </p>
          </div>
        </div>

        <GapBridge />
      </div>
    </section>
  );
}
