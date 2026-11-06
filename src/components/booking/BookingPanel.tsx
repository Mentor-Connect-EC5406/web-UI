import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2 } from 'lucide-react';
import type { Mentor, Slot } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FormField } from '@/components/common/FormField';
import { useDisclosure } from '@/hooks/useDisclosure';
import { BOOKING_TOPIC_MAX_LENGTH, CANCELLATION_WINDOW_HOURS, MENTOR_RESPONSE_HOURS } from '@/config/constants';
import { formatPrice, formatSessionTime, sessionLengthLabel } from '@/lib/format';
import { SlotPicker } from './SlotPicker';

interface BookingPanelProps {
  mentor: Mentor;
  slots: Slot[];
  // the panel manages its own progress success and failure states around this call
  onBook: (slot: Slot, topic: string) => Promise<unknown>;
  // replaces the book button when the viewer cannot book, e.g. signed out or not a student
  blocked?: ReactNode;
  // where the booked session can be followed
  sessionsHref?: string;
  // the time a mentor invited the student to, chosen up front
  invitedSlotId?: string | null;
  now?: Date;
}

// day, then time, then review with a topic, then confirm, then result
export function BookingPanel({ mentor, slots, onBook, blocked, sessionsHref, invitedSlotId, now }: BookingPanelProps) {
  const invited = invitedSlotId ? slots.find((s) => s.id === invitedSlotId && s.status === 'AVAILABLE') ?? null : null;
  const [selected, setSelected] = useState<Slot | null>(invited);
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [failure, setFailure] = useState<string | null>(null);
  const review = useDisclosure();

  async function confirm() {
    if (!selected) return;
    setStatus('sending');
    try {
      await onBook(selected, topic);
      setStatus('sent');
      setSelected(null);
      setTopic('');
      review.close();
    } catch (error) {
      setFailure(error instanceof Error ? error.message : null);
      setStatus('failed');
    }
  }

  return (
    <Card id="book" className="h-fit lg:sticky lg:top-6">
      <CardHeader title={<><Calendar className="size-4 text-ink-secondary" aria-hidden /> Book a session</>} />
      <CardBody>
        {status === 'sent' && (
          <div role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-success-soft p-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              Request sent. {mentor.name} has up to {MENTOR_RESPONSE_HOURS} hours to accept, and the time is held for you until then.
              {sessionsHref && <> <Link to={sessionsHref} className="font-semibold underline">Follow it in My sessions</Link>.</>}
            </p>
          </div>
        )}

        {invitedSlotId && status === 'idle' && (
          <p className="mb-4 rounded-xl bg-brand-soft p-3 text-sm text-ink">
            {invited
              ? `${mentor.name} invited you to the time selected below. Review it and send the request.`
              : `The time ${mentor.name} invited you to is no longer free. Pick another time or message ${mentor.name}.`}
          </p>
        )}

        <SlotPicker
          slots={slots}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          emptyMessage="No free times right now. Check back later or message the mentor."
          now={now}
        />

        <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
          <span className="text-ink-secondary">Session ({sessionLengthLabel()})</span>
          <span className="font-semibold text-ink">{formatPrice(mentor.hourlyRate)}</span>
        </div>

        {blocked ?? (
          <Button className="mt-4 w-full" disabled={!selected} onClick={() => { setStatus('idle'); review.open(); }}>
            {selected ? 'Review booking' : 'Select a time slot'}
          </Button>
        )}
      </CardBody>

      <ConfirmDialog
        open={review.isOpen}
        onClose={review.close}
        onConfirm={confirm}
        loading={status === 'sending'}
        title="Confirm your booking"
        confirmLabel="Send request"
        description={`You can withdraw the request any time before ${mentor.name} accepts. After that, changes are possible up to ${CANCELLATION_WINDOW_HOURS} hours before the start.`}
      >
        {selected && (
          <dl className="space-y-2 rounded-xl bg-surface-subtle p-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-ink-secondary">Mentor</dt><dd className="font-medium">{mentor.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-secondary">When</dt><dd className="text-right font-medium">{formatSessionTime(selected.startsAt, selected.endsAt)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-secondary">Price</dt><dd className="font-medium">{formatPrice(mentor.hourlyRate)}</dd></div>
          </dl>
        )}
        <div className="mt-4">
          <FormField htmlFor="booking-topic" label="What would you like to discuss?" hint="Optional, helps the mentor prepare">
            <Textarea
              id="booking-topic"
              value={topic}
              maxLength={BOOKING_TOPIC_MAX_LENGTH}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Reviewing my CV for internship applications"
              className="min-h-20"
            />
          </FormField>
        </div>
        {status === 'failed' && (
          <p role="alert" className="mt-3 text-sm text-accent">The booking could not be sent. {failure || 'Please try again.'}</p>
        )}
      </ConfirmDialog>
    </Card>
  );
}
