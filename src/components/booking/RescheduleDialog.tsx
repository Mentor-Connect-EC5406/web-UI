import { useState } from 'react';
import { CalendarX, Clock } from 'lucide-react';
import type { Session, Slot } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { AsyncContent, type QueryLike } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { CANCELLATION_WINDOW_HOURS } from '@/config/constants';
import { formatSessionTime, viewerTimezone } from '@/lib/format';
import { isInsideChangeWindow } from '@/lib/sessions';
import { TimeSlot } from './TimeSlot';

interface RescheduleDialogProps {
  session: Session;
  // the mentor's slots, only available ones outside the change window can be picked
  slots: QueryLike<Slot[]>;
  saving: boolean;
  saveError?: string | null;
  onClose: () => void;
  onConfirm: (slot: Slot) => void;
  now?: Date;
}

// lets a student move an upcoming session to another free slot of the same mentor
export function RescheduleDialog({ session, slots, saving, saveError, onClose, onConfirm, now = new Date() }: RescheduleDialogProps) {
  const [selected, setSelected] = useState<Slot | null>(null);
  const locked = isInsideChangeWindow(session.startsAt, now);

  return (
    <Dialog
      open
      onClose={onClose}
      title="Reschedule session"
      description={`With ${session.mentorName} · currently ${formatSessionTime(session.startsAt, session.endsAt)}`}
      className="max-w-xl"
      footer={
        locked ? (
          <Button variant="secondary" onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose} disabled={saving}>Keep current time</Button>
            <Button disabled={!selected} loading={saving} onClick={() => selected && onConfirm(selected)}>
              Move session
            </Button>
          </>
        )
      }
    >
      {locked ? (
        <p className="flex items-start gap-2 rounded-xl bg-surface-subtle p-3 text-sm text-ink-secondary">
          <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
          This session starts in less than {CANCELLATION_WINDOW_HOURS} hours, so it can no longer be moved. Message your
          mentor if you cannot attend.
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-ink-secondary">
            Pick a new time. Sessions can be moved up to {CANCELLATION_WINDOW_HOURS} hours before they start. Times are shown in {viewerTimezone()}.
          </p>
          <AsyncContent query={slots} loading={<ListSkeleton rows={2} rowClassName="h-14" />}>
            {(list) => {
              const current = Date.parse(session.startsAt);
              const open = list.filter(
                (s) => s.status === 'AVAILABLE' && Date.parse(s.startsAt) !== current && !isInsideChangeWindow(s.startsAt, now),
              );
              return open.length === 0 ? (
                <EmptyState icon={CalendarX} title="No other times available" description="This mentor has no free slots right now. Try again later." className="py-8" />
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {open.map((slot) => (
                    <TimeSlot key={slot.id} slot={slot} showDate selected={selected?.id === slot.id} onSelect={setSelected} />
                  ))}
                </div>
              );
            }}
          </AsyncContent>
          {saveError && <p role="alert" className="mt-3 text-sm text-accent">{saveError}</p>}
        </>
      )}
    </Dialog>
  );
}
