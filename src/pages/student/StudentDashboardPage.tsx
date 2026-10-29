import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Calendar, CalendarCheck, Search, Target } from 'lucide-react';
import type { Session } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { PersonRow } from '@/components/common/PersonRow';
import { QuickLinks } from '@/components/common/QuickLinks';
import { RatingStars } from '@/components/common/RatingStars';
import { StatCard } from '@/components/common/StatCard';
import { SessionCard } from '@/components/booking/SessionCard';
import { useSession } from '@/auth/session';
import { useGoals } from '@/data/goals';
import { useMentors, useSavedMentors } from '@/data/mentors';
import { useStudentSessions } from '@/data/sessions';
import { firstName } from '@/lib/format';
import { EMPTY_FILTERS } from '@/lib/mentorFilters';
import { paths } from '@/app/paths';

const isUpcoming = (s: Session) => s.status === 'CONFIRMED' || s.status === 'PENDING';

// shows upcoming sessions, goals progress and recommended mentors
export default function StudentDashboardPage() {
  const user = useSession((s) => s.user);
  const sessions = useStudentSessions();
  const goals = useGoals();
  const mentors = useMentors(EMPTY_FILTERS);
  const saved = useSavedMentors();
  const upcoming = sessions.data?.filter(isUpcoming) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName(user?.name ?? 'there')}`}
        description={sessions.data && `You have ${upcoming.length} upcoming ${upcoming.length === 1 ? 'session' : 'sessions'}.`}
        actions={<Button asChild><Link to={paths.student.mentors}>Find a mentor <ArrowRight /></Link></Button>}
      />

      <AsyncContent query={sessions} loading={<Skeleton className="h-24" />}>
        {(list) => (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Upcoming sessions" value={upcoming.length} icon={Calendar} />
            <StatCard label="Completed sessions" value={list.filter((s) => s.status === 'COMPLETED').length} icon={CalendarCheck} />
            <StatCard label="Active goals" value={goals.data?.length ?? '–'} icon={Target} />
            <StatCard label="Saved mentors" value={saved.data?.length ?? '–'} icon={Bookmark} />
          </div>
        )}
      </AsyncContent>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section aria-labelledby="next-session">
            <h2 id="next-session" className="mb-3 text-lg font-semibold text-ink">Next session</h2>
            <AsyncContent query={sessions} loading={<ListSkeleton rows={1} rowClassName="h-28" />}>
              {(list) => {
                const next = list.find(isUpcoming);
                return next ? (
                  <SessionCard
                    session={next}
                    counterpart="mentor"
                    actions={next.meetingUrl && (
                      <Button asChild size="sm"><a href={next.meetingUrl} target="_blank" rel="noreferrer">Join session</a></Button>
                    )}
                  />
                ) : (
                  <Card className="p-6 text-sm text-ink-secondary">No upcoming sessions. Find a mentor to book your first one.</Card>
                );
              }}
            </AsyncContent>
          </section>

          <Card>
            <CardHeader
              title="Career goals"
              action={<Button asChild variant="ghost" size="sm"><Link to={paths.student.goals}>Manage</Link></Button>}
            />
            <CardBody>
              <AsyncContent query={goals} loading={<ListSkeleton rows={3} rowClassName="h-8" />}>
                {(list) => list.length === 0 ? (
                  <p className="py-2 text-sm text-ink-secondary">No goals yet. Add one to track your progress.</p>
                ) : (
                  <div className="space-y-4">
                    {list.map((goal) => (
                      <div key={goal.id}>
                        <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                          <p className="font-medium text-ink">{goal.title}</p>
                          <span className="text-xs text-ink-muted">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} label={goal.title} />
                      </div>
                    ))}
                  </div>
                )}
              </AsyncContent>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <QuickLinks
            links={[
              { label: 'Find a mentor', to: paths.student.mentors, icon: Search },
              { label: 'My sessions', to: paths.student.sessions, icon: Calendar },
              { label: 'Career goals', to: paths.student.goals, icon: Target },
            ]}
          />
          <Card>
            <CardHeader
              title="Recommended mentors"
              action={<Button asChild variant="ghost" size="sm"><Link to={paths.student.mentors}>See all</Link></Button>}
            />
            <CardBody>
              <AsyncContent query={mentors} loading={<ListSkeleton rows={3} rowClassName="h-14" />}>
                {(list) => (
                  <div className="space-y-2">
                    {list.slice(0, 3).map((mentor) => (
                      <Link key={mentor.id} to={paths.student.mentor(mentor.id)} className="block rounded-xl transition-colors hover:bg-surface-subtle">
                        <PersonRow name={mentor.name} avatarUrl={mentor.avatarUrl} detail={<RatingStars rating={mentor.rating} />} className="border-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </AsyncContent>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
