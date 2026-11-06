import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/common/FormField';
import { isMeetingUrl } from '@/lib/sessions';

interface MeetingLinkDialogProps {
  current: string;
  saving: boolean;
  saveError?: string | null;
  onClose: () => void;
  onSave: (url: string) => void;
}

// e.g. a Zoom or Google Meet link instead of the generated one, both sides see the change
export function MeetingLinkDialog({ current, saving, saveError, onClose, onSave }: MeetingLinkDialogProps) {
  const [url, setUrl] = useState(current);
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!isMeetingUrl(url)) {
      setError('Enter a full link starting with https://');
      return;
    }
    setError(null);
    onSave(url.trim());
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title="Change the meeting link"
      description="The other person is notified and joins with the new link."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" form="meeting-link-form" loading={saving}>Save link</Button>
        </>
      }
    >
      <form id="meeting-link-form" noValidate onSubmit={submit}>
        <FormField htmlFor="meeting-url" label="Meeting link" required error={error ?? undefined}>
          <Input
            id="meeting-url"
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'meeting-url-error' : undefined}
          />
        </FormField>
        {saveError && <p role="alert" className="mt-3 text-sm text-accent">{saveError}</p>}
      </form>
    </Dialog>
  );
}
