import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarPlus, CheckCircle2, MessageSquare, SearchX, Users } from 'lucide-react';
import type { MentoredStudent, Session, Slot } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { PersonRow } from '@/components/common/PersonRow';
import { SearchInput } from '@/components/common/SearchInput';
import { InviteSessionDialog } from '@/components/booking/InviteSessionDialog';
import { useSession } from '@/auth/session';
import { useMyMentorProfile, useMySlots } from '@/data/mentors';
import { useSendToPerson, useStartConversation } from '@/data/messages';
import { useMentorSessions } from '@/data/sessions';
import { formatDate, formatSessionTime } from '@/lib/format';
import { inviteLink, inviteMessage } from '@/lib/invitations';
import { isUpcoming, mentoredStudents, sortByStart } from '@/lib/sessions';
import { paths } from '@/app/paths';

// the student's next request or session, a waiting request comes first because it needs an answer
function nextSessionOf(studentId: string | null, sessions: Session[]) {
  const upcoming = sortByStart(sessions.filter((s) => s.studentId === studentId && isUpcoming(s)));
  return upcoming.find((s) => s.status === 'PENDING') ?? upcoming[0];
}

// loads the mentor's slots only while the dialog is open
function InviteStudent({ student, onClose, onSent }: { student: MentoredStudent; onClose: () => void; onSent: (message: string) => void }) {
  const user = useSession((s) => s.user);
  const profile = useMyMentorProfile();
  const slots = useMySlots();
  const send = useSendToPerson();

  function invite({ slot, note }: { slot: Slot; note: string }) {
    const mentorId = profile.data?.id;
    if (!user || !student.studentId || !mentorId) return;
    const text = inviteMessage({ mentorName: user.name, slot, note, link: inviteLink(window.location.origin, mentorId, slot.id) });
    send.mutate(
      { userId: user.id, otherId: student.studentId, text },
      { onSuccess: () => onSent(`Invitation sent to ${student.name} for ${formatSessionTime(slot.startsAt, slot.endsAt)}. You will see their request under Sessions.`) },
    );
  }

  return (
    <InviteSessionDialog
      studentName={student.name}
      slots={slots}
      availabilityHref={paths.mentorArea.availability}
      sending={send.isPending}
      sendError={send.error?.message ?? (profile.data === null ? 'Set up your mentor profile before inviting students.' : null)}
      onClose={onClose}
      onSend={invite}
    />
  );
}

// students the mentor has had sessions with, with their next request or session and an invite to book another
export default function MentorStudentsPage() {
  const user = useSession((s) => s.user);
  const sessions = useMentorSessions();
  const start = useStartConversation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [inviting, setInviting] = useState<MentoredStudent | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function message(student: MentoredStudent) {
    if (!user || !student.studentId) return;
    start.mutate({ userId: user.id, otherId: student.studentId }, { onSuccess: (id) => navigate(paths.mentorArea.conversation(id)) });
  }

  return (
    <div>
      <PageHeader title="Students" description="Students you have mentored or have sessions booked with" />
      {notice && (
        <p role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-success-soft p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden /> {notice}
        </p>
      )}

      <AsyncContent query={sessions} loading={<ListSkeleton rows={3} rowClassName="h-16" />}>
        {(list) => {
          const students = mentoredStudents(list);
          if (students.length === 0) {
            return <EmptyState icon={Users} title="No students yet" description="Students appear here after their first session with you is booked." />;
          }
          const q = query.trim().toLowerCase();
          const shown = students.filter((s) => s.name.toLowerCase().includes(q));
          return (
            <>
              <SearchInput
                label="Search students"
                placeholder="Search by name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                containerClassName="mb-4 sm:max-w-sm"
              />
              {start.error && <p role="alert" className="mb-3 text-sm text-accent">{start.error.message}</p>}
              {shown.length === 0 ? (
                <EmptyState icon={SearchX} title="No students match your search" description="Check the spelling or clear the search." />
              ) : (
                <ul className="space-y-3">
                  {shown.map((student) => {
                    const busy = start.isPending && start.variables?.otherId === student.studentId;
                    const next = nextSessionOf(student.studentId, list);
                    const waiting = next?.status === 'PENDING';
                    return (
                      <li key={student.key}>
                        <PersonRow
                          className="bg-surface p-4"
                          name={student.name}
                          detail={
                            next
                              ? `${waiting ? 'Requested' : 'Next session'} ${formatSessionTime(next.startsAt, next.endsAt)}`
                              : `${student.sessionCount} ${student.sessionCount === 1 ? 'session' : 'sessions'} · Last session ${formatDate(student.lastSessionAt)}`
                          }
                          badges={waiting && <Badge tone="brand">Request waiting</Badge>}
                          actions={
                            <>
                              {next && (
                                <Button asChild size="sm" variant={waiting ? 'primary' : 'secondary'}>
                                  <Link to={paths.mentorArea.session(next.id)}>{waiting ? 'Review request' : 'View session'}</Link>
                                </Button>
                              )}
                              {student.studentId && (
                                <>
                                  <Button size="sm" variant="secondary" onClick={() => { setNotice(null); setInviting(student); }}>
                                    <CalendarPlus /> Invite to a session
                                  </Button>
                                  <Button size="sm" variant="secondary" loading={busy} disabled={start.isPending} onClick={() => message(student)}>
                                    {!busy && <MessageSquare />} Message
                                  </Button>
                                </>
                              )}
                            </>
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          );
        }}
      </AsyncContent>

      {inviting && (
        <InviteStudent
          student={inviting}
          onClose={() => setInviting(null)}
          onSent={(message) => { setInviting(null); setNotice(message); }}
        />
      )}
    </div>
  );
}
