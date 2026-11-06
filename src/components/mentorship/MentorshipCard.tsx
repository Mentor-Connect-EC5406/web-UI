import type { ReactNode } from 'react';
import { CalendarClock } from 'lucide-react';
import type { Mentorship } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { describeSchedule } from '@/lib/mentorships';
import { formatDate } from '@/lib/format';
import { mentorshipStatusMeta } from '@/lib/status';

interface MentorshipCardProps {
  mentorship: Mentorship;
  counterpart: 'mentor' | 'student';
  actions?: ReactNode;
}

export function MentorshipCard({ mentorship, counterpart, actions }: MentorshipCardProps) {
  const name = counterpart === 'mentor' ? mentorship.mentorName : mentorship.studentName;
  const meta = mentorshipStatusMeta[mentorship.status];
  const requested = mentorship.status === 'REQUESTED';

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-ink">{mentorship.title}</p>
            <Badge tone={meta.tone}>{meta.label}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-ink-secondary">
            With {name} · {mentorship.durationMonths} months from {formatDate(mentorship.schedule.startDate)}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-secondary">
            <CalendarClock className="size-3.5" aria-hidden />
            {requested ? 'Preferred: ' : ''}{describeSchedule(mentorship.schedule)} ({mentorship.schedule.timezone})
          </p>
          <p className="mt-2 line-clamp-3 text-sm whitespace-pre-line text-ink">{mentorship.goals}</p>
          {mentorship.declineReason && <p className="mt-2 text-sm text-accent">Reason: {mentorship.declineReason}</p>}
        </div>
      </div>
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}
