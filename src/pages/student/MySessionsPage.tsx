import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CalendarClock, CheckCircle2, Star, Video, X } from 'lucide-react';
import type { Session, SessionStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { RescheduleDialog } from '@/components/booking/RescheduleDialog';
import { ReviewDialog } from '@/components/booking/ReviewDialog';
import { SessionCard } from '@/components/booking/SessionCard';
import { useMentorSlots } from '@/data/mentors';
import { useCancelSession, useRescheduleSession, useReviewSession, useStudentSessions } from '@/data/sessions';
import { CANCELLATION_WINDOW_HOURS } from '@/config/constants';
import { paths } from '@/app/paths';

const TABS: { key: string; label: string; statuses: SessionStatus[] }[] = [
  { key: 'upcoming', label: 'Upcoming', statuses: ['PENDING', 'CONFIRMED'] },
  { key: 'completed', label: 'Completed', statuses: ['COMPLETED'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['CANCELLED'] },
];

// loads the mentor's slots only while the dialog is open
function RescheduleSession({ session, onDone, onClose }: { session: Session; onDone: () => void; onClose: () => void }) {
  const slots = useMentorSlots(session.mentorId ?? session.mentorName);
  const reschedule = useRescheduleSession();
  return (
    <RescheduleDialog
      session={session}
      slots={slots}
      saving={reschedule.isPending}
      saveError={reschedule.error?.message}
      onClose={onClose}
      onConfirm={(slot) => reschedule.mutate({ sessionId: session.id, slotId: slot.id }, { onSuccess: onDone })}
    />
  );
}

// sessions grouped by status with join, reschedule, cancel and review actions
export default function MySessionsPage() {
  const sessions = useStudentSessions();
  const cancel = useCancelSession();
  const review = useReviewSession();
  const [cancelling, setCancelling] = useState<Session | null>(null);
  const [moving, setMoving] = useState<Session | null>(null);
  const [reviewing, setReviewing] = useState<Session | null>(null);
  // confirmation shown after a change resolves
  const [notice, setNotice] = useState<string | null>(null);

  function confirmCancel() {
    if (!cancelling) return;
    cancel.mutate(cancelling.id, { onSuccess: () => setCancelling(null) });
  }

  function submitReview(input: { rating: number; text: string }) {
    if (!reviewing) return;
    const mentorName = reviewing.mentorName;
    review.mutate(
      { sessionId: reviewing.id, ...input },
      { onSuccess: () => { setReviewing(null); setNotice(`Thanks, your review of ${mentorName} is now on their profile.`); } },
    );
  }

  function sessionActions(tab: string, session: Session) {
    if (tab === 'upcoming') {
      return (
        <>
          {session.meetingUrl && (
            <Button asChild size="sm">
              <a href={session.meetingUrl} target="_blank" rel="noreferrer"><Video /> Join</a>
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => { setNotice(null); setMoving(session); }}>
            <CalendarClock /> Reschedule
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setCancelling(session)}>
            <X /> Cancel
          </Button>
        </>
      );
    }
    if (tab === 'completed') {
      return session.reviewed ? (
        <Badge tone="success"><CheckCircle2 className="size-3" aria-hidden /> Reviewed</Badge>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => { setNotice(null); review.reset(); setReviewing(session); }}>
          <Star /> Write a review
        </Button>
      );
    }
    return null;
  }

  return (
    <div>
      <PageHeader title="My sessions" description="View and manage your mentoring sessions" />

      {notice && (
        <p role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-success-soft p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          {notice}
        </p>
      )}

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
                      <SessionCard key={session.id} session={session} counterpart="mentor" actions={sessionActions(tab.key, session)} />
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

      {moving && (
        <RescheduleSession
          session={moving}
          onClose={() => setMoving(null)}
          onDone={() => { setNotice(`Your session with ${moving.mentorName} has been moved.`); setMoving(null); }}
        />
      )}

      {reviewing && (
        <ReviewDialog
          session={reviewing}
          saving={review.isPending}
          saveError={review.error?.message}
          onClose={() => setReviewing(null)}
          onSubmit={submitReview}
        />
      )}
    </div>
  );
}
