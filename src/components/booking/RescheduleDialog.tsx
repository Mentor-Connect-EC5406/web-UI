import { useState } from 'react';
import { Clock } from 'lucide-react';
import type { Session, Slot } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { AsyncContent, type QueryLike } from '@/components/common/AsyncContent';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { CANCELLATION_WINDOW_HOURS } from '@/config/constants';
import { formatSessionTime } from '@/lib/format';
import { isInsideChangeWindow } from '@/lib/sessions';
import { SlotPicker } from './SlotPicker';

interface RescheduleDialogProps {
  session: Session;
  // the other person in the session, named in the description
  withName: string;
  // the mentor's slots, only available ones outside the change window can be picked
  slots: QueryLike<Slot[]>;
  saving: boolean;
  saveError?: string | null;
  // tells the other side what happens after the move
  notice?: string;
  onClose: () => void;
  onConfirm: (slot: Slot) => void;
  now?: Date;
}

// moves an upcoming session to another free slot of the same mentor
export function RescheduleDialog({ session, withName, slots, saving, saveError, notice, onClose, onConfirm, now = new Date() }: RescheduleDialogProps) {
  const [selected, setSelected] = useState<Slot | null>(null);
  const locked = isInsideChangeWindow(session.startsAt, now);
  const current = Date.parse(session.startsAt);

  return (
    <Dialog
      open
      onClose={onClose}
      title="Change the time"
      description={`With ${withName} · currently ${formatSessionTime(session.startsAt, session.endsAt)}`}
      className="max-w-xl"
      footer={
        locked ? (
          <Button variant="secondary" onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose} disabled={saving}>Keep current time</Button>
            <Button disabled={!selected} loading={saving} onClick={() => selected && onConfirm(selected)}>Move session</Button>
          </>
        )
      }
    >
      {locked ? (
        <p className="flex items-start gap-2 rounded-xl bg-surface-subtle p-3 text-sm text-ink-secondary">
          <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
          This session starts in less than {CANCELLATION_WINDOW_HOURS} hours, so it can no longer be moved. Send a message if you cannot attend.
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-ink-secondary">
            Pick a new time. Sessions can be moved up to {CANCELLATION_WINDOW_HOURS} hours before they start. {notice}
          </p>
          <AsyncContent query={slots} loading={<ListSkeleton rows={2} rowClassName="h-14" />}>
            {(list) => (
              <SlotPicker
                slots={list}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
                isPickable={(s) => Date.parse(s.startsAt) !== current && !isInsideChangeWindow(s.startsAt, now)}
                emptyMessage="There are no other free times right now. Try again later."
                now={now}
              />
            )}
          </AsyncContent>
          {saveError && <p role="alert" className="mt-3 text-sm text-accent">{saveError}</p>}
        </>
      )}
    </Dialog>
  );
}
