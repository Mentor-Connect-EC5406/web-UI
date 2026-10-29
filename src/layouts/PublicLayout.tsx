import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useSession } from '@/auth/session';
import { homePathFor, paths } from '@/app/paths';
import { cn } from '@/lib/cn';
import { PageOutlet } from './PageOutlet';

// shared nav links used in both the navbar and the footer
const PUBLIC_NAV = [
  { label: 'Find mentors', to: paths.mentors },
  { label: 'How it works', to: paths.howItWorks },
  { label: 'Become a mentor', to: paths.signup },
];

function YoutubeIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const LANDING_NAV = [
  { label: 'Home', targetId: 'top' },
  { label: 'Industries', targetId: 'industries' },
  { label: 'Mentor', targetId: 'mentor' },
  { label: 'About Us', targetId: 'about-us' },
];

function Navbar() {
  const user = useSession((s) => s.user);
  const location = useLocation();
  const isLanding = location.pathname === paths.home;

  const handleLandingScroll = (targetId: string) => {
    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors',
        isLanding ? 'bg-[#f8d24d] border-b border-black/15' : 'bg-surface border-b border-line'
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center justify-between',
          isLanding
            ? 'w-full px-6 sm:px-10 lg:px-12'
            : 'mx-auto max-w-7xl gap-4 px-4 sm:px-6 lg:px-8'
        )}
      >
        <div className={cn('flex items-center', isLanding && 'pl-2 sm:pl-3')}>
          <BrandLogo />
        </div>

        {isLanding ? (
          <nav aria-label="Main" className="flex items-center gap-5 sm:gap-8 lg:gap-10 text-sm sm:text-base font-bold text-ink">
            {LANDING_NAV.map((item) => (
              <a
                key={item.label}
                href={item.targetId === 'top' ? '#' : `#${item.targetId}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLandingScroll(item.targetId);
                }}
                className="inline-block cursor-pointer text-[#202124] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:text-[#202124] active:scale-95 select-none"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : (
          <>
            <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-semibold md:flex">
              {PUBLIC_NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-ink-secondary hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {user ? (
                <Button asChild>
                  <Link to={homePathFor(user.role)}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link to={paths.login}>Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link to={paths.signup}>Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer id="about-us" className="border-t border-black/10 bg-[#f8d24d] text-ink py-12 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-start">
          {/* Col 1: Brand & tagline */}
          <div className="space-y-3">
            <BrandLogo size="md" />
            <p className="text-base font-bold text-ink">Connect. Learn. Grow.</p>
          </div>

          {/* Col 2: Contact Us, Contact info, Social icons, Copyright */}
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Top: Contact Us heading on the exact same level as Platform */}
            <h2 className="m-0 p-0 text-base font-bold leading-6 text-ink">Contact Us</h2>

            {/* Contact info */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-ink">
              <a
                href="mailto:info@mentorconnect.com"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <Mail className="size-4 text-ink" />
                <span>info@mentorconnect.com</span>
              </a>
              <span className="text-ink/40">|</span>
              <a
                href="tel:+94771234567"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <Phone className="size-4 text-ink" />
                <span>+94 77 123 4567</span>
              </a>
            </div>

            {/* Social media icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-lg bg-black text-white transition hover:bg-neutral-800"
              >
                <span className="text-sm font-bold">in</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-lg bg-black text-white transition hover:bg-neutral-800"
              >
                <span className="text-sm font-bold">f</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex size-9 items-center justify-center rounded-lg bg-black text-white transition hover:bg-neutral-800"
              >
                <YoutubeIcon className="size-4.5 text-white" />
              </a>
            </div>

            {/* Copyright under the contact info */}
            <p className="pt-2 text-sm font-normal text-ink sm:text-base">
              © 2026 MentorConnect. All Rights Reserved.
            </p>
          </div>

          {/* Col 3: Platform links */}
          <div className="flex flex-col md:items-end">
            <div className="space-y-2 text-left">
              <h2 className="m-0 p-0 text-base font-bold leading-6 text-ink">Platform</h2>
              <ul className="space-y-2 text-sm font-semibold text-ink">
                {PUBLIC_NAV.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// marketing site and public discovery pages
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <PageOutlet />
      </main>
      <Footer />
    </div>
  );
}
