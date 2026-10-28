import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ChipToggleGroupProps<T extends string> {
  // accessible name of the group
  label: string;
  options: readonly T[];
  value: readonly T[];
  onChange: (value: T[]) => void;
  max?: number;
}

// pill buttons for picking several options, selected ones get a tick as well as a colour
export function ChipToggleGroup<T extends string>({ label, options, value, onChange, max }: ChipToggleGroupProps<T>) {
  const full = max !== undefined && value.length >= max;

  function toggle(option: T) {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            disabled={!selected && full}
            onClick={() => toggle(option)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-50',
              selected
                ? 'border-brand bg-brand-soft font-medium text-ink'
                : 'border-line bg-surface text-ink-secondary hover:bg-surface-subtle',
            )}
          >
            {selected && <Check className="size-3.5" aria-hidden />}
            {option}
          </button>
        );
      })}
    </div>
  );
}
