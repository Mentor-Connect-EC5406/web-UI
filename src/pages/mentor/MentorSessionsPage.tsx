import { Link } from 'react-router-dom';
import { Calendar, CalendarClock, Video } from 'lucide-react';
import type { SessionStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { SessionCard } from '@/components/booking/SessionCard';
import { useMentorSessions } from '@/data/sessions';
import { paths } from '@/app/paths';

const TABS: { key: string; label: string; statuses: SessionStatus[]; empty: string }[] = [
  { key: 'upcoming', label: 'Upcoming', statuses: ['PENDING', 'CONFIRMED'], empty: 'Open more time slots so students can book you.' },
  { key: 'completed', label: 'Completed', statuses: ['COMPLETED'], empty: 'Sessions you have finished appear here.' },
  { key: 'cancelled', label: 'Cancelled', statuses: ['CANCELLED'], empty: 'Sessions cancelled by you or a student appear here.' },
];

// the mentor's sessions grouped by status
export default function MentorSessionsPage() {
  const sessions = useMentorSessions();

  return (
    <div>
      <PageHeader
        title="Sessions"
        description="Your mentoring sessions with students"
        actions={<Button asChild variant="secondary"><Link to={paths.mentorArea.availability}><CalendarClock /> Manage availability</Link></Button>}
      />

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
              // upcoming soonest first, past sessions most recent first
              const tabSessions = list
                .filter((s) => tab.statuses.includes(s.status))
                .sort((a, b) => (tab.key === 'upcoming' ? 1 : -1) * (Date.parse(a.startsAt) - Date.parse(b.startsAt)));
              return (
                <TabsContent key={tab.key} value={tab.key} className="space-y-3">
                  {tabSessions.length === 0 ? (
                    <EmptyState icon={Calendar} title={`No ${tab.label.toLowerCase()} sessions`} description={tab.empty} />
                  ) : (
                    tabSessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        counterpart="student"
                        actions={tab.key === 'upcoming' && session.meetingUrl && (
                          <Button asChild size="sm">
                            <a href={session.meetingUrl} target="_blank" rel="noreferrer"><Video /> Join</a>
                          </Button>
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
    </div>
  );
}
