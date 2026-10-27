import { Link } from 'react-router-dom';
import { CalendarCheck, Flag, ShieldCheck, Users, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { PersonRow } from '@/components/common/PersonRow';
import { StatCard } from '@/components/common/StatCard';
import { useAdminStats, useMentorApplications, useReports } from '@/data/admin';
import { paths } from '@/app/paths';

const reportStatusLabel = { OPEN: 'Open', UNDER_REVIEW: 'Under review' } as const;

// platform metrics and the queues that need admin action
export default function AdminDashboardPage() {
  const stats = useAdminStats();
  const applications = useMentorApplications();
  const reports = useReports();

  return (
    <div className="space-y-6">
      <PageHeader title="Platform overview" description="Monitor activity and act on pending items" />

      <AsyncContent query={stats} loading={<Skeleton className="h-24" />}>
        {(s) => (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total users" value={s.users} icon={Users} />
            <StatCard label="Active mentors" value={s.mentors} icon={ShieldCheck} />
            <StatCard label="Total bookings" value={s.bookings} icon={CalendarCheck} />
            <StatCard label="Revenue" value={s.revenue} icon={Wallet} />
          </div>
        )}
      </AsyncContent>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Pending verifications"
            action={<Button asChild variant="ghost" size="sm"><Link to={paths.admin.verification}>Review all</Link></Button>}
          />
          <CardBody>
            <AsyncContent query={applications} loading={<ListSkeleton rows={2} rowClassName="h-16" />}>
              {(list) =>
                list.length === 0 ? (
                  <p className="py-4 text-center text-sm text-ink-secondary">No applications waiting.</p>
                ) : (
                  <div className="space-y-3">
                    {list.map((a) => (
                      <PersonRow key={a.id} name={a.name} detail={`${a.organization} · Submitted ${a.submittedAt}`} />
                    ))}
                  </div>
                )
              }
            </AsyncContent>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={<><Flag className="size-4 text-ink-secondary" aria-hidden /> Open reports</>} />
          <CardBody>
            <AsyncContent query={reports} loading={<ListSkeleton rows={2} rowClassName="h-16" />}>
              {(list) => (
                <div className="space-y-3">
                  {list.map((r) => (
                    <div key={r.id} className="rounded-xl border border-line p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink">{r.type}</p>
                        <Badge tone={r.status === 'OPEN' ? 'accent' : 'brand'}>{reportStatusLabel[r.status]}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-secondary">By {r.reporter} against {r.reportedUser}</p>
                    </div>
                  ))}
                </div>
              )}
            </AsyncContent>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
