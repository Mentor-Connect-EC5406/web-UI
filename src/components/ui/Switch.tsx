import { cn } from '@/lib/cn';

interface SwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

// on off setting with its label, the state is also written out so it does not rely on colour
export function Switch({ id, label, description, checked, onCheckedChange, disabled }: SwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-ink">{label}</label>
        {description && <p id={`${id}-description`} className="mt-0.5 text-xs text-ink-secondary">{description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-ink-secondary" aria-hidden>{checked ? 'On' : 'Off'}</span>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-describedby={description ? `${id}-description` : undefined}
          disabled={disabled}
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            checked ? 'bg-brand' : 'bg-line-strong',
          )}
        >
          <span
            className={cn('inline-block size-5 rounded-full bg-surface shadow transition-transform', checked ? 'translate-x-5.5' : 'translate-x-0.5')}
          />
        </button>
      </div>
    </div>
  );
}
