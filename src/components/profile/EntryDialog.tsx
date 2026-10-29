import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { hasErrors } from '@/lib/profile';

interface EntryDialogProps<T, E extends object> {
  title: string;
  entry: T;
  validate: (entry: T) => E;
  onSave: (entry: T) => void;
  onClose: () => void;
  children: (draft: T, set: (patch: Partial<T>) => void, errors: E) => ReactNode;
}

// add or edit one entry, the change only reaches the server when the whole profile is saved
export function EntryDialog<T extends object, E extends object>({ title, entry, validate, onSave, onClose, children }: EntryDialogProps<T, E>) {
  const formId = useId();
  const [draft, setDraft] = useState(entry);
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validate(draft) : ({} as E);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // react events bubble through the portal, so stop this reaching the profile form
    e.stopPropagation();
    setSubmitted(true);
    if (hasErrors(validate(draft))) return;
    onSave(draft);
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={formId}>Done</Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-4">
        {children(draft, (patch) => setDraft((d) => ({ ...d, ...patch })), errors)}
      </form>
    </Dialog>
  );
}
