import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import type { Session } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { formatDateTime, formatPrice, formatSessionTime } from '@/lib/format';
import { SessionStatusBadge } from './SessionStatusBadge';

interface SessionCardProps {
  session: Session;
  // the mentor name is shown in the student view and the student name in the mentor view
  counterpart: 'mentor' | 'student';
  // opens the session page with the meeting link, plan and every action
  detailsHref?: string;
  actions?: ReactNode;
}

export function SessionCard({ session, counterpart, detailsHref, actions }: SessionCardProps) {
  const name = counterpart === 'mentor' ? session.mentorName : session.studentName;
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {detailsHref ? (
              <Link to={detailsHref} className="text-sm font-semibold text-ink hover:underline">{name}</Link>
            ) : (
              <p className="text-sm font-semibold text-ink">{name}</p>
            )}
            <SessionStatusBadge status={session.status} />
          </div>
          <p className="mt-0.5 text-sm text-ink-secondary">{session.topic}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-secondary">
            <Calendar className="size-3.5" aria-hidden />
            {formatSessionTime(session.startsAt, session.endsAt)}
          </p>
          {session.status === 'PENDING' && session.expiresAt && (
            <p className="mt-1 text-xs text-ink-muted">
              {counterpart === 'mentor' ? 'Waiting for the mentor to accept' : 'Answer this request'} by {formatDateTime(session.expiresAt)}
            </p>
          )}
        </div>
        <p className="shrink-0 text-sm font-semibold text-ink">{formatPrice(session.price)}</p>
      </div>
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}
