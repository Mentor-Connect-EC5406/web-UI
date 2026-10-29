import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export type SaveStatus = 'saved' | 'error' | null;

interface FormActionsProps {
  dirty: boolean;
  saving: boolean;
  status: SaveStatus;
  onDiscard: () => void;
}

// save and discard bar, it sticks to the bottom while there is something to save because the profile pages are long
export function FormActions({ dirty, saving, status, onDiscard }: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-3 rounded-2xl sm:flex-row sm:items-center sm:justify-between',
        (dirty || saving) && 'sticky bottom-4 z-10 border border-line bg-surface p-4 shadow-lg',
      )}
    >
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
