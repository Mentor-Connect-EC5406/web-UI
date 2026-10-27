import { useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import type { Mentor, Slot } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useDisclosure } from '@/hooks/useDisclosure';
import { CANCELLATION_WINDOW_HOURS } from '@/config/constants';
import { formatPrice, formatSessionTime, sessionLengthLabel, viewerTimezone } from '@/lib/format';
import { SlotLegend, TimeSlot } from './TimeSlot';

interface BookingPanelProps {
  mentor: Mentor;
  slots: Slot[];
  // the panel manages its own progress success and failure states around this call
  onBook: (slot: Slot) => Promise<unknown>;
}

// slot picker then review then confirm then result
export function BookingPanel({ mentor, slots, onBook }: BookingPanelProps) {
  const [selected, setSelected] = useState<Slot | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const review = useDisclosure();

  async function confirm() {
    if (!selected) return;
    setStatus('sending');
    try {
      await onBook(selected);
      setStatus('sent');
      setSelected(null);
      review.close();
    } catch {
      setStatus('failed');
    }
  }

  return (
    <Card id="book" className="h-fit lg:sticky lg:top-6">
      <CardHeader title={<><Calendar className="size-4 text-ink-secondary" aria-hidden /> Book a session</>} />
      <CardBody>
        {status === 'sent' && (
          <p role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-success-soft p-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
            Booking requested. You'll see it under My sessions as pending until the mentor confirms.
          </p>
        )}
        <p className="mb-3 text-sm text-ink-secondary">Choose an available time. Times are shown in {viewerTimezone()}.</p>
        <SlotLegend statuses={['AVAILABLE', 'HELD', 'BOOKED']} />

        <div className="mt-4 grid grid-cols-2 gap-2">
          {slots.map((slot) => (
            <TimeSlot key={slot.id} slot={slot} showDate selected={selected?.id === slot.id} onSelect={setSelected} />
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
          <span className="text-ink-secondary">Session ({sessionLengthLabel()})</span>
          <span className="font-semibold text-ink">{formatPrice(mentor.hourlyRate)}</span>
        </div>

        <Button className="mt-4 w-full" disabled={!selected} onClick={() => { setStatus('idle'); review.open(); }}>
          {selected ? 'Review booking' : 'Select a time slot'}
        </Button>
      </CardBody>

      <ConfirmDialog
        open={review.isOpen}
        onClose={review.close}
        onConfirm={confirm}
        loading={status === 'sending'}
        title="Confirm your booking"
        confirmLabel="Confirm booking"
        description={`Free cancellation up to ${CANCELLATION_WINDOW_HOURS} hours before the session starts.`}
      >
        {selected && (
          <dl className="space-y-2 rounded-xl bg-surface-subtle p-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-ink-secondary">Mentor</dt><dd className="font-medium">{mentor.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-secondary">When</dt><dd className="text-right font-medium">{formatSessionTime(selected.startsAt, selected.endsAt)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-secondary">Price</dt><dd className="font-medium">{formatPrice(mentor.hourlyRate)}</dd></div>
          </dl>
        )}
        {status === 'failed' && (
          <p role="alert" className="mt-3 text-sm text-accent">The booking could not be sent. Please try again.</p>
        )}
      </ConfirmDialog>
    </Card>
  );
}
