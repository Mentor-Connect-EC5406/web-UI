import { useState, type FormEvent } from 'react';
import type { MentorshipSchedule } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { hasErrors, validateSchedule } from '@/lib/mentorships';
import { ScheduleFields } from './ScheduleFields';

interface ScheduleDialogProps {
  title: string;
  description: string;
  initial: MentorshipSchedule;
  confirmLabel: string;
  saving: boolean;
  saveError?: string | null;
  onClose: () => void;
  onSave: (schedule: MentorshipSchedule) => void;
}

// used to approve a request with a schedule and to change the schedule later
export function ScheduleDialog({ title, description, initial, confirmLabel, saving, saveError, onClose, onSave }: ScheduleDialogProps) {
  const [schedule, setSchedule] = useState(initial);
  const [attempted, setAttempted] = useState(false);
  const errors = attempted ? validateSchedule(schedule) : {};

  function submit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!hasErrors(validateSchedule(schedule))) onSave(schedule);
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={title}
      description={description}
      className="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" form="schedule-form" loading={saving}>{confirmLabel}</Button>
        </>
      }
    >
      <form id="schedule-form" noValidate onSubmit={submit}>
        <ScheduleFields value={schedule} onChange={setSchedule} errors={errors} idPrefix="schedule" />
        {saveError && <p role="alert" className="mt-3 text-sm text-accent">{saveError}</p>}
      </form>
    </Dialog>
  );
}
