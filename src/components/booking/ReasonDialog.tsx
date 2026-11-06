import { useState, type ReactNode } from 'react';
import { Textarea } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FormField } from '@/components/common/FormField';
import { CANCEL_REASON_MAX_LENGTH } from '@/config/constants';

interface ReasonDialogProps {
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  // shown to the other side with the notification
  reasonLabel?: string;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

// confirms a cancel, withdraw or decline with an optional reason for the other side
export function ReasonDialog({ title, description, confirmLabel, cancelLabel = 'Go back', reasonLabel = 'Reason (optional)', loading, error, onClose, onConfirm }: ReasonDialogProps) {
  const [reason, setReason] = useState('');
  return (
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={() => onConfirm(reason)}
      loading={loading}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      danger
    >
      <FormField htmlFor="reason" label={reasonLabel} hint="The other person sees this">
        <Textarea id="reason" value={reason} maxLength={CANCEL_REASON_MAX_LENGTH} onChange={(e) => setReason(e.target.value)} className="min-h-20" />
      </FormField>
      {error && <p role="alert" className="mt-3 text-sm text-accent">{error}</p>}
    </ConfirmDialog>
  );
}
