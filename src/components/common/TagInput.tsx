import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TagInputProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}

// free text tags added with Enter, comma or the Add button
export function TagInput({ id, value, onChange, max, placeholder, invalid, describedBy }: TagInputProps) {
  const [draft, setDraft] = useState('');
  const full = max !== undefined && value.length >= max;

  function add() {
    const tag = draft.trim();
    if (!tag || full) return;
    // duplicates are dropped quietly so a repeated entry is not an error
    if (!value.some((v) => v.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
    setDraft('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li key={tag}>
              <Badge className="py-1 pr-1 text-sm">
                {tag}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((t) => t !== tag))}
                  aria-label={`Remove ${tag}`}
                  className="rounded-full p-0.5 text-ink-muted hover:bg-surface-subtle hover:text-ink"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={full ? `Limit of ${max} reached` : placeholder}
          disabled={full}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
        <Button type="button" variant="secondary" onClick={add} disabled={full || !draft.trim()}>
          Add
        </Button>
      </div>
    </div>
  );
}
