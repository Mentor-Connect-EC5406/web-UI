import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useSession } from '@/auth/session';
import { homePathFor, paths } from '@/app/paths';
import { PageOutlet } from './PageOutlet';

// shared nav links used in both the navbar and the footer
const PUBLIC_NAV = [
  { label: 'Find mentors', to: paths.mentors },
  { label: 'How it works', to: paths.howItWorks },
  { label: 'Become a mentor', to: paths.signup },
];

function Navbar() {
  const user = useSession((s) => s.user);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo />
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-medium md:flex">
          {PUBLIC_NAV.map((item) => (
            <Link key={item.label} to={item.to} className="text-ink-secondary transition-colors hover:text-ink">
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
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <BrandLogo size="sm" />
          <p className="mt-3 text-sm text-ink-secondary">Connect. Learn. Grow.</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="mb-3 text-sm font-semibold text-ink">Platform</h2>
          <ul className="space-y-2 text-sm">
            {PUBLIC_NAV.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-ink-secondary transition-colors hover:text-ink">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-7xl border-t border-line px-4 py-6 text-sm text-ink-muted sm:px-6 lg:px-8">
        © {new Date().getFullYear()} MentorConnect
      </p>
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
