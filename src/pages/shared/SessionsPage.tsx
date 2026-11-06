import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CalendarClock, CalendarDays, Check, List, Search, Video, X } from 'lucide-react';
import type { Session, SessionStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { ReasonDialog } from '@/components/booking/ReasonDialog';
import { SessionCard } from '@/components/booking/SessionCard';
import { SessionsWeekView } from '@/components/sessions/SessionsWeekView';
import { useMySessions, useRespondToRequest } from '@/data/sessions';
import { cn } from '@/lib/cn';
import { joinState, sortByStart } from '@/lib/sessions';
import { paths } from '@/app/paths';

type ViewerRole = 'STUDENT' | 'MENTOR';

interface TabDef {
  key: string;
  label: string;
  statuses: SessionStatus[];
  order: 'asc' | 'desc';
  empty: string;
}

// students follow their requests among upcoming sessions, mentors answer them in their own tab
const TABS: Record<ViewerRole, TabDef[]> = {
  STUDENT: [
    { key: 'upcoming', label: 'Upcoming', statuses: ['PENDING', 'CONFIRMED'], order: 'asc', empty: 'Sessions you book with mentors appear here.' },
    { key: 'completed', label: 'Completed', statuses: ['COMPLETED'], order: 'desc', empty: 'Sessions you finish appear here.' },
    { key: 'cancelled', label: 'Cancelled', statuses: ['CANCELLED'], order: 'desc', empty: 'Cancelled sessions and withdrawn requests appear here.' },
  ],
  MENTOR: [
    { key: 'requests', label: 'Requests', statuses: ['PENDING'], order: 'asc', empty: 'New booking requests from students appear here.' },
    { key: 'upcoming', label: 'Upcoming', statuses: ['CONFIRMED'], order: 'asc', empty: 'Open more time slots so students can book you.' },
    { key: 'completed', label: 'Completed', statuses: ['COMPLETED'], order: 'desc', empty: 'Sessions you have finished appear here.' },
    { key: 'cancelled', label: 'Cancelled', statuses: ['CANCELLED'], order: 'desc', empty: 'Sessions cancelled by you or a student appear here.' },
  ],
};

function ViewToggle({ view, onChange }: { view: 'list' | 'week'; onChange: (view: 'list' | 'week') => void }) {
  const option = (value: 'list' | 'week', label: string, icon: ReactNode) => (
    <button
      type="button"
      aria-pressed={view === value}
      onClick={() => onChange(value)}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors [&_svg]:size-4',
        view === value ? 'bg-surface text-ink shadow-sm' : 'text-ink-secondary hover:text-ink',
      )}
    >
      {icon} {label}
    </button>
  );
  return (
    <div role="group" aria-label="View" className="inline-flex gap-1 rounded-xl bg-surface-muted p-1">
      {option('list', 'List', <List aria-hidden />)}
      {option('week', 'Week', <CalendarDays aria-hidden />)}
    </div>
  );
}

// sessions grouped by status, or the week as a calendar, each opens its own page
export default function SessionsPage({ role }: { role: ViewerRole }) {
  const sessions = useMySessions(role);
  const respond = useRespondToRequest();
  const [view, setView] = useState<'list' | 'week'>('list');
  const [declining, setDeclining] = useState<Session | null>(null);
  const student = role === 'STUDENT';
  const area = student ? paths.student : paths.mentorArea;
  const counterpart = student ? 'mentor' : 'student';

  function actions(session: Session) {
    const join = joinState(session) === 'open' && session.meetingUrl;
    const answering = respond.isPending && respond.variables?.requestId === session.id;
    return (
      <>
        {!student && session.status === 'PENDING' && (
          <>
            <Button size="sm" loading={answering && respond.variables?.accept} disabled={respond.isPending} onClick={() => respond.mutate({ requestId: session.id, accept: true })}>
              <Check /> Accept
            </Button>
            <Button size="sm" variant="secondary" disabled={respond.isPending} onClick={() => { respond.reset(); setDeclining(session); }}>
              <X /> Decline
            </Button>
          </>
        )}
        {join && (
          <Button asChild size="sm"><a href={session.meetingUrl!} target="_blank" rel="noreferrer"><Video /> Join</a></Button>
        )}
        <Button asChild size="sm" variant="secondary"><Link to={area.session(session.id)}>View details</Link></Button>
        {student && session.status === 'COMPLETED' && !session.reviewed && <Badge tone="brand">Waiting for your review</Badge>}
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title={student ? 'My sessions' : 'Sessions'}
        description={student ? 'Your booked sessions, meeting links and session plans' : 'Requests and sessions with your students'}
        actions={
          <>
            <ViewToggle view={view} onChange={setView} />
            {student ? (
              <Button asChild variant="secondary"><Link to={paths.student.mentors}><Search /> Find a mentor</Link></Button>
            ) : (
              <Button asChild variant="secondary"><Link to={paths.mentorArea.availability}><CalendarClock /> Availability</Link></Button>
            )}
          </>
        }
      />
      {respond.error && !declining && <p role="alert" className="mb-4 rounded-xl bg-accent-soft p-3 text-sm text-accent">{respond.error.message}</p>}

      <AsyncContent query={sessions} loading={<ListSkeleton rows={3} />}>
        {(list) =>
          view === 'week' ? (
            <SessionsWeekView sessions={list.filter((s) => s.status !== 'CANCELLED')} counterpart={counterpart} detailsHref={area.session} />
          ) : (
            <Tabs defaultValue={!student && list.some((s) => s.status === 'PENDING') ? 'requests' : 'upcoming'}>
              <TabsList>
                {TABS[role].map((tab) => (
                  <TabsTrigger key={tab.key} value={tab.key}>
                    {tab.label} ({list.filter((s) => tab.statuses.includes(s.status)).length})
                  </TabsTrigger>
                ))}
              </TabsList>
              {TABS[role].map((tab) => {
                const tabSessions = sortByStart(list.filter((s) => tab.statuses.includes(s.status)), tab.order);
                return (
                  <TabsContent key={tab.key} value={tab.key} className="space-y-3">
                    {tabSessions.length === 0 ? (
                      <EmptyState
                        icon={Calendar}
                        title={`No ${tab.label.toLowerCase()}`}
                        description={tab.empty}
                        action={student && tab.key === 'upcoming' && <Button asChild><Link to={paths.student.mentors}>Find a mentor</Link></Button>}
                      />
                    ) : (
                      tabSessions.map((session) => (
                        <SessionCard key={session.id} session={session} counterpart={counterpart} detailsHref={area.session(session.id)} actions={actions(session)} />
                      ))
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )
        }
      </AsyncContent>

      {declining && (
        <ReasonDialog
          title="Decline this request?"
          description={`${declining.studentName} is notified and the time opens up again.`}
          confirmLabel="Decline request"
          loading={respond.isPending}
          error={respond.error?.message}
          onClose={() => setDeclining(null)}
          onConfirm={(reason) => respond.mutate({ requestId: declining.id, accept: false, reason }, { onSuccess: () => setDeclining(null) })}
        />
      )}
    </div>
  );
}
