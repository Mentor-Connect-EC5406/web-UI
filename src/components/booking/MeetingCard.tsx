import { Pencil, Video } from 'lucide-react';
import type { Session } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { JOIN_EARLY_MINUTES } from '@/config/constants';
import { joinState } from '@/lib/sessions';

interface MeetingCardProps {
  session: Session;
  // present only when the viewer may change the link
  onEditLink?: () => void;
  now?: Date;
}

const MESSAGES = {
  early: `The meeting opens ${JOIN_EARLY_MINUTES} minutes before the start. You and the other person join with this same link.`,
  open: 'The meeting is open. You and the other person join with this same link.',
  ended: 'This session has ended.',
} as const;

function unavailableMessage(session: Session) {
  if (session.status === 'PENDING') return 'The meeting link is created as soon as the mentor accepts the request.';
  if (session.status === 'COMPLETED') return 'This session is completed.';
  if (session.status === 'CANCELLED') return 'This session was cancelled, so there is no meeting.';
  return 'The meeting link is not ready yet.';
}

// one shared link for mentor and student
export function MeetingCard({ session, onEditLink, now }: MeetingCardProps) {
  const state = joinState(session, now);
  const url = session.meetingUrl;

  return (
    <Card>
      <CardHeader
        title={<><Video className="size-4 text-ink-secondary" aria-hidden /> Meeting</>}
        action={onEditLink && url && state !== 'ended' && (
          <Button variant="ghost" size="sm" onClick={onEditLink}><Pencil /> Change link</Button>
        )}
      />
      <CardBody className="space-y-3">
        <p className="text-sm text-ink-secondary">{state === 'unavailable' ? unavailableMessage(session) : MESSAGES[state]}</p>
        {url && state !== 'unavailable' && state !== 'ended' && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            {state === 'open' ? (
              <Button asChild><a href={url} target="_blank" rel="noreferrer"><Video /> Join meeting</a></Button>
            ) : (
              <Button disabled><Video /> Join opens soon</Button>
            )}
            <CopyLinkButton url={url} label="Copy meeting link" className="sm:w-48" />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
