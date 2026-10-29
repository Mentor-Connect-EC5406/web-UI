import type { ReactNode } from 'react';
import { Calendar } from 'lucide-react';
import type { Session } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { formatPrice, formatSessionTime } from '@/lib/format';
import { SessionStatusBadge } from './SessionStatusBadge';

interface SessionCardProps {
  session: Session;
  // the mentor name is shown in the student view and the student name in the mentor view
  counterpart: 'mentor' | 'student';
  actions?: ReactNode;
}

// booked session with status, time, price and optional actions
export function SessionCard({ session, counterpart, actions }: SessionCardProps) {
  const name = counterpart === 'mentor' ? session.mentorName : session.studentName;
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-ink">{name}</p>
            <SessionStatusBadge status={session.status} />
          </div>
          <p className="mt-0.5 text-sm text-ink-secondary">{session.topic}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-secondary">
            <Calendar className="size-3.5" aria-hidden />
            {formatSessionTime(session.startsAt, session.endsAt)}
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-ink">{formatPrice(session.price)}</p>
      </div>
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}
