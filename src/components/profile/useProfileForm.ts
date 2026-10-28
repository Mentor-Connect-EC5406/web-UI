import { useState, type FormEvent } from 'react';
import { hasErrors } from '@/lib/profile';
import type { SaveStatus } from './FormActions';

// form state shared by the profile pages: edits, validation after the first submit, save result
export function useProfileForm<T extends object, E extends object>(
  initial: T,
  validate: (values: T) => E,
  onSave: (values: T) => Promise<unknown>,
) {
  // last saved values, compared against the edits to know if anything changed
  const [baseline, setBaseline] = useState(initial);
  const [values, setValues] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<SaveStatus>(null);

  const errors = submitted ? validate(values) : ({} as E);
  const dirty = JSON.stringify(values) !== JSON.stringify(baseline);

  function set(patch: Partial<T>) {
    setValues((v) => ({ ...v, ...patch }));
    setStatus(null);
  }

  function discard() {
    setValues(baseline);
    setSubmitted(false);
    setStatus(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitted(true);
    if (hasErrors(validate(values))) {
      // wait for the error state to render before moving focus to it
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    const saving = values;
    try {
      await onSave(saving);
      setBaseline(saving);
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }

  return { values, saved: baseline, set, errors, dirty, status, discard, handleSubmit };
}
