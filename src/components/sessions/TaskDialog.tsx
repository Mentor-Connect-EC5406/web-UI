import { useState, type FormEvent } from 'react';
import type { SessionTask, SessionTaskInput, SessionTaskType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import { TASK_DETAILS_MAX_LENGTH, TASK_TITLE_MAX_LENGTH } from '@/config/constants';
import { SESSION_TASK_LABELS } from '@/config/options';
import { validateTask, type TaskErrors } from '@/lib/sessions';

interface TaskDialogProps {
  // editing when given, adding otherwise
  task?: SessionTask;
  defaultType: SessionTaskType;
  saving: boolean;
  saveError?: string | null;
  onClose: () => void;
  onSave: (input: SessionTaskInput) => void;
}

const TYPE_OPTIONS = (Object.keys(SESSION_TASK_LABELS) as SessionTaskType[]).map((type) => ({ value: type, label: SESSION_TASK_LABELS[type].label }));

export function TaskDialog({ task, defaultType, saving, saveError, onClose, onSave }: TaskDialogProps) {
  const [type, setType] = useState<SessionTaskType>(task?.type ?? defaultType);
  const [title, setTitle] = useState(task?.title ?? '');
  const [details, setDetails] = useState(task?.details ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [errors, setErrors] = useState<TaskErrors>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const found = validateTask({ title, details });
    setErrors(found);
    if (Object.keys(found).length === 0) onSave({ type, title, details, dueDate: dueDate || null });
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={task ? `Edit ${SESSION_TASK_LABELS[task.type].label.toLowerCase()}` : 'Add to the session plan'}
      description={SESSION_TASK_LABELS[type].hint}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" form="task-form" loading={saving}>{task ? 'Save changes' : 'Add'}</Button>
        </>
      }
    >
      <form id="task-form" noValidate onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="task-type" label="Type" required>
            <Select id="task-type" value={type} onValueChange={(v) => setType(v as SessionTaskType)} placeholder="Choose a type" options={TYPE_OPTIONS} />
          </FormField>
          <FormField htmlFor="task-due" label="Due date">
            <Input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </FormField>
        </div>
        <FormField htmlFor="task-title" label="Title" required error={errors.title}>
          <Input
            id="task-title"
            value={title}
            maxLength={TASK_TITLE_MAX_LENGTH}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'task-title-error' : undefined}
          />
        </FormField>
        <FormField htmlFor="task-details" label="Details" error={errors.details}>
          <Textarea id="task-details" value={details} maxLength={TASK_DETAILS_MAX_LENGTH} onChange={(e) => setDetails(e.target.value)} />
        </FormField>
        {saveError && <p role="alert" className="text-sm text-accent">{saveError}</p>}
      </form>
    </Dialog>
  );
}
