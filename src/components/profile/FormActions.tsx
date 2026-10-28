import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type SaveStatus = 'saved' | 'error' | null;

interface FormActionsProps {
  dirty: boolean;
  saving: boolean;
  status: SaveStatus;
  onDiscard: () => void;
}

// save and discard buttons with the result of the last save
export function FormActions({ dirty, saving, status, onDiscard }: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p role="status" className="text-sm">
        {status === 'saved' && (
          <span className="flex items-center gap-1.5 text-success">
            <CheckCircle2 className="size-4" aria-hidden /> Changes saved
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1.5 text-accent">
            <AlertCircle className="size-4" aria-hidden /> Your changes could not be saved. Please try again.
          </span>
        )}
        {!status && dirty && <span className="text-ink-secondary">You have unsaved changes</span>}
      </p>
      <div className="flex gap-3">
        <Button type="button" variant="secondary" disabled={!dirty || saving} onClick={onDiscard}>
          Discard
        </Button>
        <Button type="submit" loading={saving} disabled={!dirty}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
