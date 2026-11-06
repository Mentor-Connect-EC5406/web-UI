import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/common/BrandLogo';
import { NotificationBell } from '@/components/messages/NotificationBell';
import { useSession } from '@/auth/session';
import { useConversations } from '@/data/messages';
import { NOTIFICATION_PREVIEW_COUNT } from '@/config/constants';
import { paths } from '@/app/paths';
import { cn } from '@/lib/cn';
import type { NavItem } from '@/app/routes/types';
import { PageOutlet } from './PageOutlet';

const roleLabel = { STUDENT: 'Student', MENTOR: 'Mentor', ADMIN: 'Admin' } as const;

// admins have no inbox so they get no bell
const inboxPaths = { STUDENT: paths.student, MENTOR: paths.mentorArea } as const;

function HeaderNotifications({ userId, inbox }: { userId: string; inbox: (typeof inboxPaths)[keyof typeof inboxPaths] }) {
  const conversations = useConversations(userId);
  return (
    <NotificationBell
      conversations={conversations.data?.slice(0, NOTIFICATION_PREVIEW_COUNT)}
      unread={conversations.data?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0}
      currentUserId={userId}
      conversationHref={inbox.conversation}
      allHref={inbox.messages}
    />
  );
}

// sidebar items are passed from the router so they stay in sync with the route list
export function AppLayout({ nav }: { nav: NavItem[] }) {
  const user = useSession((s) => s.user);
  const signOut = useSession((s) => s.signOut);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // always inside RequireRole so a user is guaranteed here
  if (!user) return null;

  function handleSignOut() {
    signOut();
    navigate(paths.login);
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* Top Navbar: spans across full width, logo always displayed */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-surface px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile drawer toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-ink-secondary hover:text-ink cursor-pointer"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          {/* Desktop sidebar collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex text-ink-secondary hover:text-ink cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="size-5" />
          </Button>

          {/* MentorConnect Logo - ALWAYS DISPLAYED */}
          <div className="pl-1">
            <BrandLogo size="sm" />
          </div>
        </div>

        {/* Right side user info & notifications */}
        <div className="flex items-center gap-3">
          {user.role !== 'ADMIN' && <HeaderNotifications userId={user.id} inbox={inboxPaths[user.role]} />}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-ink">{user.name}</p>
            <p className="text-xs text-ink-muted">{roleLabel[user.role]}</p>
          </div>
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
        </div>
      </header>

      {/* Main body: Collapsible Sidebar + Content */}
      <div className="flex flex-1">
        {/* Mobile backdrop */}
        {menuOpen && <div className="fixed inset-0 z-40 bg-ink/40 md:hidden" onClick={() => setMenuOpen(false)} aria-hidden />}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-surface transition-all duration-300 ease-in-out md:sticky md:top-16 md:z-0 md:h-[calc(100vh-4rem)]',
            menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            collapsed ? 'md:w-20' : 'md:w-64',
            'w-64', // mobile drawer width
          )}
        >
          {/* Mobile drawer header */}
          <div className="flex h-16 items-center justify-between border-b border-line px-4 md:hidden">
            <BrandLogo size="sm" />
            <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X />
            </Button>
          </div>

          <nav aria-label="App" className="flex-1 space-y-1.5 overflow-y-auto p-3">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={() => setMenuOpen(false)}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                    collapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5 pl-4',
                    isActive
                      ? 'bg-neutral-200/80 font-semibold text-ink shadow-xs'
                      : 'text-ink-secondary hover:bg-surface-subtle/80 hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active yellow indicator bar on left side */}
                    {isActive && (
                      <span
                        className="absolute left-1 top-2 bottom-2 w-1.5 rounded-full bg-brand"
                        aria-hidden
                      />
                    )}
                    <item.icon
                      className={cn(
                        'size-5 shrink-0 transition-colors',
                        isActive ? 'text-ink' : 'text-ink-secondary group-hover:text-ink',
                      )}
                      aria-hidden
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-line p-3">
            <Button
              variant="ghost"
              className={cn(
                'w-full text-ink-secondary hover:text-ink cursor-pointer',
                collapsed ? 'justify-center px-0' : 'justify-start gap-3',
              )}
              onClick={handleSignOut}
              title={collapsed ? 'Sign out' : undefined}
            >
              <LogOut className="size-5 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">
            <PageOutlet />
          </div>
        </main>
      </div>
    </div>
  );
}
