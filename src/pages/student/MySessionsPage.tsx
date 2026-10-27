import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Video, X } from 'lucide-react';
import type { Session, SessionStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { SessionCard } from '@/components/booking/SessionCard';
import { useCancelSession, useStudentSessions } from '@/data/sessions';
import { CANCELLATION_WINDOW_HOURS } from '@/config/constants';
import { paths } from '@/app/paths';

const TABS: { key: string; label: string; statuses: SessionStatus[] }[] = [
  { key: 'upcoming', label: 'Upcoming', statuses: ['PENDING', 'CONFIRMED'] },
  { key: 'completed', label: 'Completed', statuses: ['COMPLETED'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['CANCELLED'] },
];

// sessions grouped by status with join and cancel actions
export default function MySessionsPage() {
  const sessions = useStudentSessions();
  const cancel = useCancelSession();
  const [cancelling, setCancelling] = useState<Session | null>(null);

  function confirmCancel() {
    if (!cancelling) return;
    cancel.mutate(cancelling.id, { onSuccess: () => setCancelling(null) });
  }

  return (
    <div>
      <PageHeader title="My sessions" description="View and manage your mentoring sessions" />

      <AsyncContent query={sessions} loading={<ListSkeleton rows={3} />}>
        {(list) => (
          <Tabs defaultValue="upcoming">
            <TabsList>
              {TABS.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.label} ({list.filter((s) => tab.statuses.includes(s.status)).length})
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => {
              const tabSessions = list.filter((s) => tab.statuses.includes(s.status));
              return (
                <TabsContent key={tab.key} value={tab.key} className="space-y-3">
                  {tabSessions.length === 0 ? (
                    <EmptyState
                      icon={Calendar}
                      title={`No ${tab.label.toLowerCase()} sessions`}
                      description="Sessions you book with mentors appear here."
                      action={<Button asChild><Link to={paths.student.mentors}>Find a mentor</Link></Button>}
                    />
                  ) : (
                    tabSessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        counterpart="mentor"
                        actions={tab.key === 'upcoming' && (
                          <>
                            {session.meetingUrl && (
                              <Button asChild size="sm">
                                <a href={session.meetingUrl} target="_blank" rel="noreferrer"><Video /> Join</a>
                              </Button>
                            )}
                            <Button size="sm" variant="secondary" onClick={() => setCancelling(session)}>
                              <X /> Cancel
                            </Button>
                          </>
                        )}
                      />
                    ))
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </AsyncContent>

      <ConfirmDialog
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        onConfirm={confirmCancel}
        loading={cancel.isPending}
        title="Cancel this session?"
        description={`Your session with ${cancelling?.mentorName ?? 'this mentor'} will be cancelled. Cancellations less than ${CANCELLATION_WINDOW_HOURS} hours before the start may not be refunded.`}
        confirmLabel="Cancel session"
        cancelLabel="Keep session"
        danger
      />
    </div>
  );
}
