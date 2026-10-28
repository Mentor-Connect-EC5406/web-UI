import { useState, type FormEvent } from 'react';
import { format } from 'date-fns';
import type { Slot } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/common/FormField';
import { sessionLengthLabel, viewerTimezone } from '@/lib/format';
import { validateNewSlot, type NewSlotErrors } from '@/lib/slots';

interface AddSlotDialogProps {
  open: boolean;
  // checked for overlaps before saving
  existing: Slot[];
  saving: boolean;
  saveError?: string | null;
  onClose: () => void;
  onSave: (range: { startsAt: string; endsAt: string }) => void;
  now?: Date;
}

// date and start time for a new bookable slot, the length is fixed by the session length rule
export function AddSlotDialog({ open, existing, saving, saveError, onClose, onSave, now = new Date() }: AddSlotDialogProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState<NewSlotErrors>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = validateNewSlot(date, time, existing, now);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onSave({ startsAt: result.startsAt, endsAt: result.endsAt });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add a time slot"
      description={`Students can book this ${sessionLengthLabel()} slot. Times are in ${viewerTimezone()}.`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" form="add-slot-form" loading={saving}>Add slot</Button>
        </>
      }
    >
      <form id="add-slot-form" noValidate onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField htmlFor="slot-date" label="Date" required error={errors.date}>
          <Input
            id="slot-date"
            type="date"
            min={format(now, 'yyyy-MM-dd')}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={errors.date ? 'slot-date-error' : undefined}
            disabled={saving}
          />
        </FormField>
        <FormField htmlFor="slot-time" label="Start time" required error={errors.time} hint={`Ends ${sessionLengthLabel()} later`}>
          <Input
            id="slot-time"
            type="time"
            step={900}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-invalid={errors.time ? true : undefined}
            aria-describedby={errors.time ? 'slot-time-error' : 'slot-time-hint'}
            disabled={saving}
          />
        </FormField>
        {saveError && <p role="alert" className="text-sm text-accent sm:col-span-2">{saveError}</p>}
      </form>
    </Dialog>
  );
}
