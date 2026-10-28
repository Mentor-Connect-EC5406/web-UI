import { useState, type FormEvent } from 'react';
import type { Goal, GoalInput } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/common/FormField';
import { GOAL_TITLE_MAX_LENGTH } from '@/config/constants';
import { validateGoal, type GoalErrors } from '@/lib/goals';

interface GoalDialogProps {
  // the goal being edited, omit to add a new one
  goal?: Goal;
  saving: boolean;
  saveError?: string | null;
  onClose: () => void;
  onSave: (values: GoalInput) => void;
}

const hasErrors = (e: GoalErrors) => Object.values(e).some(Boolean);

// add or edit a career goal with title, optional target date and progress
export function GoalDialog({ goal, saving, saveError, onClose, onSave }: GoalDialogProps) {
  const [title, setTitle] = useState(goal?.title ?? '');
  const [targetDate, setTargetDate] = useState(goal?.targetDate ?? '');
  const [progress, setProgress] = useState(String(goal?.progress ?? 0));
  const [attempted, setAttempted] = useState(false);

  const values: GoalInput = { title, targetDate: targetDate || null, progress: Number(progress) };
  const errors: GoalErrors = attempted ? validateGoal(values, goal?.targetDate ?? null) : {};

  function submit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!hasErrors(validateGoal(values, goal?.targetDate ?? null))) onSave({ ...values, title: title.trim() });
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={goal ? 'Edit goal' : 'Add a career goal'}
      description="Short, specific goals are easier to track and to discuss with mentors."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" form="goal-form" loading={saving}>{goal ? 'Save goal' : 'Add goal'}</Button>
        </>
      }
    >
      <form id="goal-form" noValidate onSubmit={submit} className="space-y-4">
        <FormField htmlFor="goal-title" label="Goal" required error={errors.title} hint={`${title.trim().length} / ${GOAL_TITLE_MAX_LENGTH}`}>
          <Input
            id="goal-title"
            value={title}
            maxLength={GOAL_TITLE_MAX_LENGTH}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Land a software engineering internship"
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'goal-title-error' : 'goal-title-hint'}
            disabled={saving}
          />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="goal-date" label="Target date" error={errors.targetDate} hint="Optional">
            <Input
              id="goal-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              aria-invalid={errors.targetDate ? true : undefined}
              aria-describedby={errors.targetDate ? 'goal-date-error' : 'goal-date-hint'}
              disabled={saving}
            />
          </FormField>
          <FormField htmlFor="goal-progress" label="Progress (%)" error={errors.progress} hint="0 to 100">
            <Input
              id="goal-progress"
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              aria-invalid={errors.progress ? true : undefined}
              aria-describedby={errors.progress ? 'goal-progress-error' : 'goal-progress-hint'}
              disabled={saving}
            />
          </FormField>
        </div>
        {saveError && <p role="alert" className="text-sm text-accent">{saveError}</p>}
      </form>
    </Dialog>
  );
}
