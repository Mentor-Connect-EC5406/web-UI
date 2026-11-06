import { useState, type FormEvent } from 'react';
import type { MentorshipRequestInput, MentorshipSchedule } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import { MENTORSHIP_DURATIONS_MONTHS, MENTORSHIP_GOALS_MAX_LENGTH, MENTORSHIP_TITLE_MAX_LENGTH } from '@/config/constants';
import { defaultSchedule, hasErrors, validateMentorshipRequest, type MentorshipErrors } from '@/lib/mentorships';
import { ScheduleFields } from './ScheduleFields';

interface MentorshipRequestDialogProps {
  mentorName: string;
  saving: boolean;
  saveError?: string | null;
  onClose: () => void;
  onSubmit: (input: Omit<MentorshipRequestInput, 'mentorId'>) => void;
}

const DURATION_OPTIONS = MENTORSHIP_DURATIONS_MONTHS.map((m) => ({ value: String(m), label: m < 12 ? `${m} months` : `${m / 12} ${m === 12 ? 'year' : 'years'}` }));

// the student's goals and preferred rhythm, the mentor confirms or adjusts the schedule
export function MentorshipRequestDialog({ mentorName, saving, saveError, onClose, onSubmit }: MentorshipRequestDialogProps) {
  const [title, setTitle] = useState('');
  const [goals, setGoals] = useState('');
  const [durationMonths, setDurationMonths] = useState<number>(MENTORSHIP_DURATIONS_MONTHS[0]);
  const [schedule, setSchedule] = useState<MentorshipSchedule>(() => defaultSchedule());
  const [attempted, setAttempted] = useState(false);
  const errors: MentorshipErrors = attempted ? validateMentorshipRequest({ title, goals, schedule }) : {};

  function submit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!hasErrors(validateMentorshipRequest({ title, goals, schedule }))) onSubmit({ title, goals, durationMonths, schedule });
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title="Request long term mentorship"
      description={`${mentorName} reviews your request and confirms a schedule. You can withdraw it until they answer.`}
      className="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" form="mentorship-form" loading={saving}>Send request</Button>
        </>
      }
    >
      <form id="mentorship-form" noValidate onSubmit={submit} className="space-y-4">
        <FormField htmlFor="mentorship-title" label="Title" required error={errors.title}>
          <Input id="mentorship-title" value={title} maxLength={MENTORSHIP_TITLE_MAX_LENGTH} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Becoming a frontend engineer" aria-invalid={errors.title ? true : undefined} />
        </FormField>
        <FormField htmlFor="mentorship-goals" label="What do you want to achieve?" required error={errors.goals}>
          <Textarea id="mentorship-goals" value={goals} maxLength={MENTORSHIP_GOALS_MAX_LENGTH} onChange={(e) => setGoals(e.target.value)} aria-invalid={errors.goals ? true : undefined} />
        </FormField>
        <FormField htmlFor="mentorship-duration" label="For how long" required>
          <Select id="mentorship-duration" value={String(durationMonths)} onValueChange={(v) => setDurationMonths(Number(v))} placeholder="Choose" options={DURATION_OPTIONS} />
        </FormField>
        <ScheduleFields value={schedule} onChange={setSchedule} errors={errors} idPrefix="mentorship" />
        {saveError && <p role="alert" className="text-sm text-accent">{saveError}</p>}
      </form>
    </Dialog>
  );
}
