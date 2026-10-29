import { Link } from 'react-router-dom';
import { ArrowDown, Briefcase, GraduationCap, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { paths } from '@/app/paths';

const JOURNEY: { icon?: LucideIcon; title: string; text: string }[] = [
  { icon: GraduationCap, title: 'University', text: 'Lectures, projects and exams' },
  { title: 'MentorConnect', text: 'Guidance from professionals who made the same move' },
  { icon: Briefcase, title: 'Industry', text: 'Real teams, real deadlines, real expectations' },
];

const CARD_ANIMATIONS = ['animate-cascade-1', 'animate-cascade-2', 'animate-cascade-3'];
const ARROW_ANIMATIONS = ['animate-cascade-arrow-1', 'animate-cascade-arrow-2'];

/** The campus-to-career path, with MentorConnect as the bridge in the middle */
function GapBridge() {
  return (
    <ol aria-label="From university to industry" className="w-full max-w-md space-y-3">
      {JOURNEY.map((step, i) => (
        <li key={step.title} className={CARD_ANIMATIONS[i]}>
          <div className="flex items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm transition hover:shadow-md">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
              {step.icon ? (
                <step.icon className="size-6 text-ink-secondary" aria-hidden />
              ) : (
                <img src="/brand/mentor-cap-mark.png" alt="MentorConnect" className="size-8.5 object-contain" />
              )}
            </span>
            <div>
              <span className="block font-bold text-ink">{step.title}</span>
              <span className="block text-sm text-ink-secondary">{step.text}</span>
            </div>
          </div>
          {i < JOURNEY.length - 1 && (
            <div className={cn("flex justify-center py-1.5", ARROW_ANIMATIONS[i])}>
              <ArrowDown className="size-5.5 stroke-[2.5] text-neutral-800" aria-hidden />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * Hero Section: The university-to-industry gap, matching the home page design.
 * Features a warm brand yellow background, bold typography with left/right spacing,
 * single-line "between university and", and matching border colors on all 3 flowchart cards.
 */
export function HeroSection() {
  return (
    <section className="bg-[#f8d24d] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-12 lg:flex-row lg:items-center">
        {/* Left column: moved to the left side */}
        <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[48px] xl:text-[56px] leading-[1.12]">
            <span className="block">Bridge the gap</span>
            <span className="block whitespace-nowrap">between university and</span>
            <span className="block">industry</span>
          </h1>
          <p className="mt-6 max-w-lg text-base sm:text-lg font-medium text-ink leading-relaxed">
            Connect with industry professionals to turn academic theory into real-world career confidence.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={paths.login}
              className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-ink shadow-sm transition hover:bg-neutral-100"
            >
              Login
            </Link>
            <Link
              to={paths.signup}
              className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-ink shadow-sm transition hover:bg-neutral-100"
            >
              Get Start
            </Link>
          </div>
        </div>

        {/* Right column: moved to the right side */}
        <div className="flex w-full justify-start lg:w-auto lg:justify-end lg:ml-auto">
          <GapBridge />
        </div>
      </div>
    </section>
  );
}
