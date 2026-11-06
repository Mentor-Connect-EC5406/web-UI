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
    <Card className="flex flex-col justify-between p-6 transition-all duration-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <Avatar name={name} className="size-11 shrink-0" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              {detailsHref ? (
                <Link to={detailsHref} className="text-base font-semibold text-ink hover:underline">{name}</Link>
              ) : (
                <p className="text-base font-semibold text-ink">{name}</p>
              )}
              <SessionStatusBadge status={session.status} />
            </div>
            <p className="text-sm font-medium text-ink-secondary">{session.topic}</p>
            <p className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Calendar className="size-3.5 text-ink-muted" aria-hidden />
              {formatSessionTime(session.startsAt, session.endsAt)}
            </p>
            {session.status === 'PENDING' && session.expiresAt && (
              <p className="text-xs text-ink-muted">
                {counterpart === 'mentor' ? 'Waiting for the mentor to accept' : 'Answer this request'} by {formatDateTime(session.expiresAt)}
              </p>
            )}
          </div>
        </div>
        <p className="shrink-0 text-base font-semibold text-ink">{formatPrice(session.price)}</p>
      </div>
      {actions && (
        <div className="mt-5 flex flex-wrap items-center gap-3 pt-1">
          {actions}
        </div>
      )}
    </Card>
  );
}
