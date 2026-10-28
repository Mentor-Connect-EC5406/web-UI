import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

const LABELS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

interface StarRatingInputProps {
  // used as the radio group name and to link the error message
  id: string;
  label: string;
  // 0 means nothing chosen yet
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

// native radios keep arrow key and screen reader support, the stars are only the visual
export function StarRatingInput({ id, label, value, onChange, error, disabled }: StarRatingInputProps) {
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} disabled={disabled}>
      <legend className="mb-1.5 text-sm font-medium text-ink">{label}</legend>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {LABELS.map((text, i) => {
            const stars = i + 1;
            return (
              <label key={stars} className="cursor-pointer rounded-lg p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand">
                <input
                  type="radio"
                  name={id}
                  value={stars}
                  checked={value === stars}
                  onChange={() => onChange(stars)}
                  className="sr-only"
                  aria-invalid={error ? true : undefined}
                />
                <span className="sr-only">{`${stars} ${stars === 1 ? 'star' : 'stars'}, ${text}`}</span>
                <Star aria-hidden className={cn('size-7', stars <= value ? 'fill-brand text-ink' : 'text-line-strong')} />
              </label>
            );
          })}
        </div>
        <span className="text-sm text-ink-secondary" aria-hidden>
          {value ? `${value} of 5 · ${LABELS[value - 1]}` : 'Not rated'}
        </span>
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-accent">{error}</p>}
    </fieldset>
  );
}
