import { useState, type FormEvent } from 'react';
import { format } from 'date-fns';
import type { Slot } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import { MAX_SLOT_REPEAT_WEEKS } from '@/config/constants';
import { sessionLengthLabel, viewerTimezone } from '@/lib/format';
import { buildSlotRanges, type SlotRange, type SlotRangeErrors } from '@/lib/slots';

interface AddSlotDialogProps {
  open: boolean;
  // checked for overlaps before saving
  existing: Slot[];
  saving: boolean;
  saveError?: string | null;
  onClose: () => void;
  onSave: (ranges: SlotRange[]) => void;
  now?: Date;
}

const REPEAT_OPTIONS = Array.from({ length: MAX_SLOT_REPEAT_WEEKS }, (_, i) => ({
  value: String(i + 1),
  label: i === 0 ? 'Only this date' : `Same time for ${i + 1} weeks`,
}));

// a date and a time range, split into bookable sessions, optionally repeated weekly
export function AddSlotDialog({ open, existing, saving, saveError, onClose, onSave, now = new Date() }: AddSlotDialogProps) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [repeatWeeks, setRepeatWeeks] = useState(1);
  const [errors, setErrors] = useState<SlotRangeErrors>({});
  const input = { date, startTime, endTime, repeatWeeks };
  // live preview once the form is complete, errors only appear after a save attempt
  const preview = date && startTime && endTime ? buildSlotRanges(input, existing, now) : null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = buildSlotRanges(input, existing, now);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onSave(result.ranges);
  }

  const aria = (field: keyof SlotRangeErrors, id: string) => ({
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${id}-error` : undefined,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add available times"
      description={`Each session is ${sessionLengthLabel()}. A longer range is split into back to back sessions. Times are in ${viewerTimezone()}.`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" form="add-slot-form" loading={saving}>
            {preview?.ok ? `Add ${preview.ranges.length} ${preview.ranges.length === 1 ? 'slot' : 'slots'}` : 'Add slots'}
          </Button>
        </>
      }
    >
      <form id="add-slot-form" noValidate onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField htmlFor="slot-date" label="Date" required error={errors.date}>
          <Input id="slot-date" type="date" min={format(now, 'yyyy-MM-dd')} value={date} onChange={(e) => setDate(e.target.value)} disabled={saving} {...aria('date', 'slot-date')} />
        </FormField>
        <FormField htmlFor="slot-repeat" label="Repeat">
          <Select id="slot-repeat" value={String(repeatWeeks)} onValueChange={(v) => setRepeatWeeks(Number(v))} placeholder="Only this date" options={REPEAT_OPTIONS} />
        </FormField>
        <FormField htmlFor="slot-start" label="From" required error={errors.startTime}>
          <Input id="slot-start" type="time" step={900} value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={saving} {...aria('startTime', 'slot-start')} />
        </FormField>
        <FormField htmlFor="slot-end" label="To" required error={errors.endTime}>
          <Input id="slot-end" type="time" step={900} value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={saving} {...aria('endTime', 'slot-end')} />
        </FormField>

        {preview?.ok && (
          <p role="status" className="rounded-xl bg-surface-subtle p-3 text-sm text-ink-secondary sm:col-span-2">
            Creates {preview.ranges.length} {sessionLengthLabel()} {preview.ranges.length === 1 ? 'slot' : 'slots'}
            {repeatWeeks > 1 && ` over ${repeatWeeks} weeks`}.
            {preview.skipped > 0 && ` ${preview.skipped} already taken or past ${preview.skipped === 1 ? 'time is' : 'times are'} skipped.`}
          </p>
        )}
        {saveError && <p role="alert" className="text-sm text-accent sm:col-span-2">{saveError}</p>}
      </form>
    </Dialog>
  );
}
