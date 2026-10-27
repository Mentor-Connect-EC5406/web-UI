import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CalendarClock, ClipboardList, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { PersonRow } from '@/components/common/PersonRow';
import { QuickLinks } from '@/components/common/QuickLinks';
import { StatCard } from '@/components/common/StatCard';
import { useSession } from '@/auth/session';
import { useBookingRequests, useMentorSessions, useRespondToRequest } from '@/data/sessions';
import { firstName, formatSessionTime, formatTime } from '@/lib/format';
import { paths } from '@/app/paths';

// shows todays sessions and pending booking requests
export default function MentorDashboardPage() {
  const user = useSession((s) => s.user);
  const sessions = useMentorSessions();
  const requests = useBookingRequests();
  const respond = useRespondToRequest();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good to see you, ${firstName(user?.name ?? 'there')}`}
        description={sessions.data && `You have ${sessions.data.length} sessions today.`}
        actions={<Button asChild><Link to={paths.mentorArea.availability}>Manage availability <ArrowRight /></Link></Button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Sessions today" value={sessions.data?.length ?? '–'} icon={Calendar} />
        <StatCard label="Pending requests" value={requests.data?.length ?? '–'} icon={ClipboardList} />
        <StatCard label="Students mentored" value={48} icon={Users} />
        <StatCard label="Average rating" value="4.8" icon={Star} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Today's sessions" />
            <CardBody>
              <AsyncContent query={sessions} loading={<ListSkeleton rows={2} rowClassName="h-16" />}>
                {(list) => (
                  <div className="space-y-3">
                    {list.map((s) => (
                      <PersonRow
                        key={s.id}
                        name={s.studentName}
                        detail={`${s.topic} · ${formatTime(s.startsAt)}`}
                        actions={s.meetingUrl && (
                          <Button asChild size="sm"><a href={s.meetingUrl} target="_blank" rel="noreferrer">Join</a></Button>
                        )}
                      />
                    ))}
                  </div>
                )}
              </AsyncContent>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Booking requests"
              action={!!requests.data?.length && <Badge tone="brand">{requests.data.length} pending</Badge>}
            />
            <CardBody>
              <AsyncContent query={requests} loading={<ListSkeleton rows={1} rowClassName="h-16" />}>
                {(list) =>
                  list.length === 0 ? (
                    <p className="py-4 text-center text-sm text-ink-secondary">No pending requests.</p>
                  ) : (
                    <div className="space-y-3">
                      {list.map((r) => {
                        const busy = respond.isPending && respond.variables?.requestId === r.id;
                        return (
                          <PersonRow
                            key={r.id}
                            name={r.studentName}
                            detail={`${r.topic} · ${formatSessionTime(r.startsAt, r.endsAt)}`}
                            actions={
                              <>
                                <Button size="sm" variant="secondary" disabled={busy} onClick={() => respond.mutate({ requestId: r.id, accept: false })}>Decline</Button>
                                <Button size="sm" loading={busy && respond.variables?.accept} disabled={busy} onClick={() => respond.mutate({ requestId: r.id, accept: true })}>Accept</Button>
                              </>
                            }
                          />
                        );
                      })}
                    </div>
                  )
                }
              </AsyncContent>
            </CardBody>
          </Card>
        </div>

        <QuickLinks
          links={[
            { label: 'Set availability', to: paths.mentorArea.availability, icon: CalendarClock },
            { label: 'Sessions', to: paths.mentorArea.sessions, icon: Calendar },
            { label: 'My students', to: paths.mentorArea.students, icon: Users },
          ]}
        />
      </div>
    </div>
  );
}
