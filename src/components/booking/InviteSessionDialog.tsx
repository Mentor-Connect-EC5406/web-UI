import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Slot } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Input';
import { AsyncContent, type QueryLike } from '@/components/common/AsyncContent';
import { FormField } from '@/components/common/FormField';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { BOOKING_TOPIC_MAX_LENGTH } from '@/config/constants';
import { SlotPicker } from './SlotPicker';

interface InviteSessionDialogProps {
  studentName: string;
  // the mentor's own slots, only open ones can be offered
  slots: QueryLike<Slot[]>;
  // where the mentor adds more times
  availabilityHref: string;
  sending: boolean;
  sendError?: string | null;
  onClose: () => void;
  onSend: (invite: { slot: Slot; note: string }) => void;
}

// the mentor offers one of their open times, the student books it from the message
export function InviteSessionDialog({ studentName, slots, availabilityHref, sending, sendError, onClose, onSend }: InviteSessionDialogProps) {
  const [selected, setSelected] = useState<Slot | null>(null);
  const [note, setNote] = useState('');

  return (
    <Dialog
      open
      onClose={onClose}
      title={`Invite ${studentName} to a session`}
      description={`${studentName} gets a message with a link that opens the booking at this time. You accept it like any other request, then the meeting link is created for both of you.`}
      className="max-w-xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={sending}>Cancel</Button>
          <Button disabled={!selected} loading={sending} onClick={() => selected && onSend({ slot: selected, note })}>Send invitation</Button>
        </>
      }
    >
      <AsyncContent query={slots} loading={<ListSkeleton rows={2} rowClassName="h-14" />}>
        {(list) => (
          <SlotPicker
            slots={list}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
            emptyMessage="You have no open times. Add some in Availability first."
          />
        )}
      </AsyncContent>
      <p className="mt-2 text-xs text-ink-secondary">
        Need another time? <Link to={availabilityHref} className="font-medium text-ink underline">Add times in Availability</Link>.
      </p>
      <div className="mt-4">
        <FormField htmlFor="invite-note" label="Note for the student" hint="Optional, e.g. what to prepare">
          <Textarea id="invite-note" value={note} maxLength={BOOKING_TOPIC_MAX_LENGTH} onChange={(e) => setNote(e.target.value)} className="min-h-20" />
        </FormField>
      </div>
      {sendError && <p role="alert" className="mt-3 text-sm text-accent">{sendError}</p>}
    </Dialog>
  );
}
