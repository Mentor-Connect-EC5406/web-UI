import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react';
import type { Session, SessionTask, SessionTaskType } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { MeetingCard } from '@/components/booking/MeetingCard';
import { MeetingLinkDialog } from '@/components/booking/MeetingLinkDialog';
import { ReasonDialog } from '@/components/booking/ReasonDialog';
import { RescheduleDialog } from '@/components/booking/RescheduleDialog';
import { ReviewDialog } from '@/components/booking/ReviewDialog';
import { SessionStatusBadge } from '@/components/booking/SessionStatusBadge';
import { SessionActions } from '@/components/sessions/SessionActions';
import { SessionPlan } from '@/components/sessions/SessionPlan';
import { TaskDialog } from '@/components/sessions/TaskDialog';
import { useSession } from '@/auth/session';
import { useMentorSlots, useMySlots } from '@/data/mentors';
import { useStartConversation } from '@/data/messages';
import { useCreateSessionTask, useDeleteSessionTask, useSessionTasks, useUpdateSessionTask } from '@/data/sessionTasks';
import {
  useCancelSession,
  useCompleteSession,
  useRescheduleSession,
  useRespondToRequest,
  useReviewSession,
  useSessionDetails,
  useUpdateMeetingLink,
} from '@/data/sessions';
import { isFeatureOn } from '@/config/features';
import { formatPrice, formatSessionTime } from '@/lib/format';
import { paths } from '@/app/paths';

type ViewerRole = 'STUDENT' | 'MENTOR';

const areaFor = (role: ViewerRole) => (role === 'STUDENT' ? paths.student : paths.mentorArea);

// students pick from the mentor's open slots, mentors from their own
function MoveSessionDialog({ session, role, onDone, onClose }: { session: Session; role: ViewerRole; onDone: () => void; onClose: () => void }) {
  const mentorSlots = useMentorSlots(role === 'STUDENT' ? session.mentorId ?? '' : '');
  const mySlots = useMySlots();
  const reschedule = useRescheduleSession();
  return (
    <RescheduleDialog
      session={session}
      withName={role === 'STUDENT' ? session.mentorName : session.studentName}
      slots={role === 'STUDENT' ? mentorSlots : mySlots}
      notice={`${role === 'STUDENT' ? 'Your mentor' : 'The student'} is notified of the new time.`}
      saving={reschedule.isPending}
      saveError={reschedule.error?.message}
      onClose={onClose}
      onConfirm={(slot) => reschedule.mutate({ sessionId: session.id, slotId: slot.id }, { onSuccess: onDone })}
    />
  );
}

function PlanSection({ session, role }: { session: Session; role: ViewerRole }) {
  const tasks = useSessionTasks(session.id);
  const create = useCreateSessionTask();
  const update = useUpdateSessionTask();
  const remove = useDeleteSessionTask();
  const [editing, setEditing] = useState<{ task?: SessionTask; type: SessionTaskType } | null>(null);
  const saving = create.isPending || (update.isPending && !!editing);
  const busyId = (update.isPending && update.variables?.id) || (remove.isPending && remove.variables?.id) || null;

  function save(input: Parameters<typeof create.mutate>[0]) {
    const done = { onSuccess: () => setEditing(null) };
    if (editing?.task) update.mutate({ ...input, id: editing.task.id }, done);
    else create.mutate(input, done);
  }

  return (
    <>
      <AsyncContent query={tasks} loading={<ListSkeleton rows={2} rowClassName="h-20" />}>
        {(list) => (
          <SessionPlan
            tasks={list}
            viewerRole={role}
            editable={session.status !== 'CANCELLED'}
            busyId={busyId}
            onAdd={(type) => { create.reset(); setEditing({ type }); }}
            onEdit={(task) => { update.reset(); setEditing({ task, type: task.type }); }}
            onToggle={(task) => update.mutate({ sessionId: session.id, id: task.id, done: !task.done })}
            onDelete={(task) => remove.mutate({ sessionId: session.id, id: task.id })}
          />
        )}
      </AsyncContent>
      {(update.error || remove.error) && !editing && (
        <p role="alert" className="text-sm text-accent">{(update.error ?? remove.error)?.message}</p>
      )}
      {editing && (
        <TaskDialog
          task={editing.task}
          defaultType={editing.type}
          saving={saving}
          saveError={(editing.task ? update.error : create.error)?.message}
          onClose={() => setEditing(null)}
          onSave={(input) => save({ ...input, sessionId: session.id })}
        />
      )}
    </>
  );
}

type OpenDialog = 'cancel' | 'decline' | 'move' | 'review' | 'link' | null;

function SessionDetails({ session, role }: { session: Session; role: ViewerRole }) {
  const user = useSession((s) => s.user);
  const navigate = useNavigate();
  const cancel = useCancelSession();
  const respond = useRespondToRequest();
  const complete = useCompleteSession();
  const review = useReviewSession();
  const updateLink = useUpdateMeetingLink();
  const startConversation = useStartConversation();
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const student = role === 'STUDENT';
  const otherName = student ? session.mentorName : session.studentName;
  const error = respond.error ?? complete.error ?? startConversation.error;

  function open(next: OpenDialog) {
    [cancel, respond, review, updateLink].forEach((m) => m.reset());
    setNotice(null);
    setDialog(next);
  }

  const finish = (message: string) => () => {
    setDialog(null);
    setNotice(message);
  };

  function message() {
    if (!user) return;
    startConversation.mutate(
      { userId: user.id, otherId: student ? '' : session.studentId ?? '', mentorId: student ? session.mentorId : undefined },
      { onSuccess: (id) => navigate(areaFor(role).conversation(id)) },
    );
  }

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
        <Avatar name={otherName} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-ink">{session.topic}</h1>
            <SessionStatusBadge status={session.status} />
          </div>
          <p className="mt-1 text-ink-secondary">With {otherName}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink">
            <Calendar className="size-4 text-ink-secondary" aria-hidden />
            {formatSessionTime(session.startsAt, session.endsAt)}
          </p>
        </div>
        <p className="text-lg font-semibold text-ink">{formatPrice(session.price)}</p>
      </Card>

      {notice && (
        <p role="status" className="flex items-start gap-2 rounded-xl bg-success-soft p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden /> {notice}
        </p>
      )}
      {error && <p role="alert" className="rounded-xl bg-accent-soft p-3 text-sm text-accent">{error.message}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <MeetingCard session={session} onEditLink={isFeatureOn('meetingLinkEdit') ? () => open('link') : undefined} />
          {isFeatureOn('sessionTasks') && <PlanSection session={session} role={role} />}
        </div>
        <SessionActions
          session={session}
          viewerRole={role}
          mentorCanReschedule={isFeatureOn('mentorReschedule')}
          accepting={respond.isPending}
          completing={complete.isPending}
          messaging={startConversation.isPending}
          onAccept={() => respond.mutate({ requestId: session.id, accept: true }, { onSuccess: finish(`Accepted. ${session.studentName} is notified and the meeting link is ready.`) })}
          onDecline={() => open('decline')}
          onCancel={() => open('cancel')}
          onReschedule={() => open('move')}
          onComplete={() => complete.mutate(session.id, { onSuccess: finish('Marked as completed. You can now review the session.') })}
          onReview={() => open('review')}
          onMessage={message}
        />
      </div>

      {dialog === 'cancel' && (
        <ReasonDialog
          title={session.status === 'PENDING' && student ? 'Withdraw this request?' : 'Cancel this session?'}
          description={`${otherName} is notified and the time becomes free for others.`}
          confirmLabel={session.status === 'PENDING' && student ? 'Withdraw request' : 'Cancel session'}
          loading={cancel.isPending}
          error={cancel.error?.message}
          onClose={() => setDialog(null)}
          onConfirm={(reason) => cancel.mutate({ sessionId: session.id, reason }, { onSuccess: finish(`Done. ${otherName} has been notified.`) })}
        />
      )}
      {dialog === 'decline' && (
        <ReasonDialog
          title="Decline this request?"
          description={`${session.studentName} is notified and the time opens up again.`}
          confirmLabel="Decline request"
          loading={respond.isPending}
          error={respond.error?.message}
          onClose={() => setDialog(null)}
          onConfirm={(reason) => respond.mutate({ requestId: session.id, accept: false, reason }, { onSuccess: finish('Request declined.') })}
        />
      )}
      {dialog === 'move' && (
        <MoveSessionDialog session={session} role={role} onClose={() => setDialog(null)} onDone={finish(`Moved. ${otherName} has been notified of the new time.`)} />
      )}
      {dialog === 'review' && (
        <ReviewDialog
          session={session}
          saving={review.isPending}
          saveError={review.error?.message}
          onClose={() => setDialog(null)}
          onSubmit={(input) => review.mutate({ sessionId: session.id, ...input }, { onSuccess: finish(`Thanks, your review of ${session.mentorName} is now on their profile.`) })}
        />
      )}
      {dialog === 'link' && session.meetingUrl && (
        <MeetingLinkDialog
          current={session.meetingUrl}
          saving={updateLink.isPending}
          saveError={updateLink.error?.message}
          onClose={() => setDialog(null)}
          onSave={(meetingUrl) => updateLink.mutate({ sessionId: session.id, meetingUrl }, { onSuccess: finish(`Meeting link updated. ${otherName} has been notified.`) })}
        />
      )}
    </div>
  );
}

// one session with its meeting link, plan and every action for the viewer
export default function SessionDetailPage({ role }: { role: ViewerRole }) {
  const { id = '' } = useParams();
  const session = useSessionDetails(id);
  const back = areaFor(role).sessions;

  return (
    <div>
      <Link to={back} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Back to sessions
      </Link>
      <AsyncContent query={session} loading={<ListSkeleton rows={2} rowClassName="h-40" />}>
        {(data) => <SessionDetails session={data} role={role} />}
      </AsyncContent>
    </div>
  );
}
