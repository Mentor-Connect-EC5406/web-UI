import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useSession } from '@/auth/session';
import { paths } from '@/app/paths';
import { cn } from '@/lib/cn';
import type { NavItem } from '@/app/routes/types';
import { PageOutlet } from './PageOutlet';

const roleLabel = { STUDENT: 'Student', MENTOR: 'Mentor', ADMIN: 'Admin' } as const;

// sidebar items are passed from the router so they stay in sync with the route list
export function AppLayout({ nav }: { nav: NavItem[] }) {
  const user = useSession((s) => s.user);
  const signOut = useSession((s) => s.signOut);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // always inside RequireRole so a user is guaranteed here
  if (!user) return null;

  function handleSignOut() {
    signOut();
    navigate(paths.login);
  }

  return (
    <div className="flex min-h-screen bg-page">
      {menuOpen && <div className="fixed inset-0 z-40 bg-ink/40 md:hidden" onClick={() => setMenuOpen(false)} aria-hidden />}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0',
          menuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <BrandLogo size="sm" />
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X />
          </Button>
        </div>

        <nav aria-label="App" className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-soft text-ink' : 'text-ink-secondary hover:bg-surface-subtle hover:text-ink',
                )
              }
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <Button variant="ghost" className="w-full justify-start text-ink-secondary" onClick={handleSignOut}>
            <LogOut /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-surface px-4 md:justify-end md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu />
          </Button>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">{user.name}</p>
              <p className="text-xs text-ink-muted">{roleLabel[user.role]}</p>
            </div>
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">
          <PageOutlet />
        </main>
      </div>
    </div>
  );
}
