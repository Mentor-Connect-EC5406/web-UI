import { CalendarClock, Check, CheckCircle2, MessageSquare, Star, X } from 'lucide-react';
import type { Session } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { CANCELLATION_WINDOW_HOURS } from '@/config/constants';
import { formatDateTime } from '@/lib/format';
import { canCancel, canReschedule, hasStarted } from '@/lib/sessions';

interface SessionActionsProps {
  session: Session;
  viewerRole: 'STUDENT' | 'MENTOR';
  // mentors may move a session only once the api allows it
  mentorCanReschedule: boolean;
  accepting?: boolean;
  completing?: boolean;
  messaging?: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
  onReschedule: () => void;
  onComplete: () => void;
  onReview: () => void;
  onMessage: () => void;
  now?: Date;
}

function Hint({ children }: { children: string }) {
  return <p className="text-xs text-ink-muted">{children}</p>;
}

// every action the viewer can take on this session, with the reason when one is not available
export function SessionActions(props: SessionActionsProps) {
  const { session, viewerRole, mentorCanReschedule, accepting, completing, messaging, now = new Date() } = props;
  const student = viewerRole === 'STUDENT';
  const other = student ? 'mentor' : 'student';
  const pending = session.status === 'PENDING';
  const confirmed = session.status === 'CONFIRMED';
  const movable = (student || mentorCanReschedule) && canReschedule(session, now);
  const cancellable = canCancel(session, now);

  return (
    <Card className="h-fit">
      <CardHeader title="Actions" />
      <CardBody className="space-y-3">
        {pending && !student && (
          <>
            <p className="text-sm text-ink-secondary">
              {session.studentName} asked for this time{session.expiresAt && `. Answer by ${formatDateTime(session.expiresAt)} or it is released`}.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" disabled={accepting} onClick={props.onDecline}><X /> Decline</Button>
              <Button loading={accepting} onClick={props.onAccept}><Check /> Accept</Button>
            </div>
          </>
        )}
        {pending && student && (
          <p className="text-sm text-ink-secondary">
            Waiting for {session.mentorName} to accept{session.expiresAt && ` by ${formatDateTime(session.expiresAt)}`}. You can withdraw the request any time until then.
          </p>
        )}

        {confirmed && student && hasStarted(session, now) && (
          <Button className="w-full" loading={completing} onClick={props.onComplete}><CheckCircle2 /> Mark as completed</Button>
        )}

        {(pending || confirmed) && (
          <>
            {movable && (
              <Button variant="secondary" className="w-full" onClick={props.onReschedule}><CalendarClock /> Change the time</Button>
            )}
            {confirmed && !canReschedule(session, now) && (
              <Hint>{`Times can change up to ${CANCELLATION_WINDOW_HOURS} hours before the start.`}</Hint>
            )}
            {cancellable && (
              <Button variant="secondary" className="w-full" onClick={props.onCancel}>
                <X /> {pending && student ? 'Withdraw request' : 'Cancel session'}
              </Button>
            )}
            {confirmed && !cancellable && !hasStarted(session, now) && (
              <Hint>{`It is too close to the start to cancel here. Message the ${other} instead.`}</Hint>
            )}
          </>
        )}

        {session.status === 'COMPLETED' && student && (
          session.reviewed ? (
            <Badge tone="success"><CheckCircle2 className="size-3" aria-hidden /> You reviewed this session</Badge>
          ) : (
            <Button className="w-full" onClick={props.onReview}><Star /> Write a review</Button>
          )
        )}
        {session.status === 'CANCELLED' && (
          <p className="text-sm text-ink-secondary">
            This session was cancelled{session.cancellationReason ? `: “${session.cancellationReason}”` : '.'}
          </p>
        )}

        <Button variant="ghost" className="w-full" loading={messaging} onClick={props.onMessage}>
          <MessageSquare /> Message the {other}
        </Button>
      </CardBody>
    </Card>
  );
}
