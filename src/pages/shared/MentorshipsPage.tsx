import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Check, CheckCircle2, Handshake, Search, X } from 'lucide-react';
import type { Mentorship, MentorshipStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { ReasonDialog } from '@/components/booking/ReasonDialog';
import { MentorshipCard } from '@/components/mentorship/MentorshipCard';
import { ScheduleDialog } from '@/components/mentorship/ScheduleDialog';
import {
  useApproveMentorship,
  useCancelMentorship,
  useChangeMentorshipSchedule,
  useDeclineMentorship,
  useMentorships,
  useWithdrawMentorship,
} from '@/data/mentorships';
import { paths } from '@/app/paths';

type ViewerRole = 'STUDENT' | 'MENTOR';
type Action = 'approve' | 'decline' | 'withdraw' | 'reschedule' | 'end';

const TABS: { key: string; label: string; statuses: MentorshipStatus[] }[] = [
  { key: 'requests', label: 'Requests', statuses: ['REQUESTED'] },
  { key: 'active', label: 'Active', statuses: ['ACTIVE'] },
  { key: 'past', label: 'Past', statuses: ['COMPLETED', 'CANCELLED', 'DECLINED', 'WITHDRAWN'] },
];

// long term mentorships: students request, mentors approve with a schedule, either side can change or end it
export default function MentorshipsPage({ role }: { role: ViewerRole }) {
  const mentorships = useMentorships();
  const approve = useApproveMentorship();
  const decline = useDeclineMentorship();
  const withdraw = useWithdrawMentorship();
  const changeSchedule = useChangeMentorshipSchedule();
  const end = useCancelMentorship();
  const [open, setOpen] = useState<{ action: Action; mentorship: Mentorship } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const student = role === 'STUDENT';
  const counterpart = student ? 'mentor' : 'student';
  const area = student ? paths.student : paths.mentorArea;

  function start(action: Action, mentorship: Mentorship) {
    [approve, decline, withdraw, changeSchedule, end].forEach((m) => m.reset());
    setNotice(null);
    setOpen({ action, mentorship });
  }

  const finish = (message: string) => () => {
    setOpen(null);
    setNotice(message);
  };

  function actions(m: Mentorship) {
    if (m.status === 'REQUESTED') {
      return student ? (
        <Button size="sm" variant="secondary" onClick={() => start('withdraw', m)}><X /> Withdraw request</Button>
      ) : (
        <>
          <Button size="sm" onClick={() => start('approve', m)}><Check /> Approve and schedule</Button>
          <Button size="sm" variant="secondary" onClick={() => start('decline', m)}><X /> Decline</Button>
        </>
      );
    }
    if (m.status === 'ACTIVE') {
      return (
        <>
          <Button asChild size="sm"><Link to={area.sessions}>View sessions</Link></Button>
          <Button size="sm" variant="secondary" onClick={() => start('reschedule', m)}><CalendarClock /> Change schedule</Button>
          <Button size="sm" variant="ghost" onClick={() => start('end', m)}>End mentorship</Button>
        </>
      );
    }
    return null;
  }

  const other = (m: Mentorship) => (student ? m.mentorName : m.studentName);

  return (
    <div>
      <PageHeader
        title="Mentorships"
        description={student ? 'Long term mentoring with regular sessions' : 'Students who asked you for regular mentoring'}
        actions={student && <Button asChild variant="secondary"><Link to={paths.student.mentors}><Search /> Find a mentor</Link></Button>}
      />
      {notice && (
        <p role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-success-soft p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden /> {notice}
        </p>
      )}

      <AsyncContent query={mentorships} loading={<ListSkeleton rows={3} />}>
        {(list) => (
          <Tabs defaultValue={list.some((m) => m.status === 'REQUESTED') ? 'requests' : 'active'}>
            <TabsList>
              {TABS.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.label} ({list.filter((m) => tab.statuses.includes(m.status)).length})
                </TabsTrigger>
              ))}
            </TabsList>
            {TABS.map((tab) => {
              const items = list.filter((m) => tab.statuses.includes(m.status));
              return (
                <TabsContent key={tab.key} value={tab.key} className="space-y-3">
                  {items.length === 0 ? (
                    <EmptyState
                      icon={Handshake}
                      title={`No ${tab.label.toLowerCase()}`}
                      description={student ? 'Open a mentor profile and choose "Request mentorship" to start.' : 'Requests from students appear here.'}
                    />
                  ) : (
                    items.map((m) => <MentorshipCard key={m.id} mentorship={m} counterpart={counterpart} actions={actions(m)} />)
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </AsyncContent>

      {open?.action === 'approve' && (
        <ScheduleDialog
          title="Approve and confirm the schedule"
          description={`This is ${open.mentorship.studentName}'s preferred schedule. Adjust it if needed. Sessions and their meeting links are created when you approve.`}
          initial={open.mentorship.schedule}
          confirmLabel="Approve"
          saving={approve.isPending}
          saveError={approve.error?.message}
          onClose={() => setOpen(null)}
          onSave={(schedule) => approve.mutate({ id: open.mentorship.id, schedule }, { onSuccess: finish(`Approved. ${open.mentorship.studentName} is notified and the sessions are scheduled.`) })}
        />
      )}
      {open?.action === 'reschedule' && (
        <ScheduleDialog
          title="Change the schedule"
          description={`Upcoming sessions move to the new schedule and ${other(open.mentorship)} is notified.`}
          initial={open.mentorship.schedule}
          confirmLabel="Save schedule"
          saving={changeSchedule.isPending}
          saveError={changeSchedule.error?.message}
          onClose={() => setOpen(null)}
          onSave={(schedule) => changeSchedule.mutate({ id: open.mentorship.id, schedule }, { onSuccess: finish(`Schedule updated. ${other(open.mentorship)} has been notified.`) })}
        />
      )}
      {open?.action === 'decline' && (
        <ReasonDialog
          title="Decline this request?"
          description={`${open.mentorship.studentName} is notified.`}
          confirmLabel="Decline request"
          loading={decline.isPending}
          error={decline.error?.message}
          onClose={() => setOpen(null)}
          onConfirm={(reason) => decline.mutate({ id: open.mentorship.id, reason }, { onSuccess: finish('Request declined.') })}
        />
      )}
      {open?.action === 'end' && (
        <ReasonDialog
          title="End this mentorship?"
          description={`Upcoming sessions are cancelled and ${other(open.mentorship)} is notified.`}
          confirmLabel="End mentorship"
          loading={end.isPending}
          error={end.error?.message}
          onClose={() => setOpen(null)}
          onConfirm={(reason) => end.mutate({ id: open.mentorship.id, reason }, { onSuccess: finish('Mentorship ended.') })}
        />
      )}
      <ConfirmDialog
        open={open?.action === 'withdraw'}
        onClose={() => setOpen(null)}
        onConfirm={() => open && withdraw.mutate(open.mentorship.id, { onSuccess: finish('Request withdrawn.') })}
        loading={withdraw.isPending}
        title="Withdraw this request?"
        description={`${open ? open.mentorship.mentorName : 'The mentor'} will no longer see it. You can send a new request later.`}
        confirmLabel="Withdraw request"
        cancelLabel="Keep request"
        danger
      >
        {withdraw.error && <p role="alert" className="text-sm text-accent">{withdraw.error.message}</p>}
      </ConfirmDialog>
    </div>
  );
}
