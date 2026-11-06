import { useId, useState, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { matchSuggestions } from '@/lib/suggestions';
import { fieldClasses } from './fieldClasses';

interface ComboboxProps extends Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange'> {
  suggestions: readonly string[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

// free text input that suggests matches, any typed value is still accepted
export function Combobox({ suggestions, value, defaultValue = '', onValueChange, className, id, onBlur, ...props }: ComboboxProps) {
  const [draft, setDraft] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const current = value ?? draft;
  const matches = matchSuggestions(suggestions, current);
  const showList = open && matches.length > 0;

  function change(next: string) {
    if (value === undefined) setDraft(next);
    onValueChange?.(next);
  }

  function pick(option: string) {
    change(option);
    setOpen(false);
    setActive(-1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!showList) return setOpen(true);
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (i + step + matches.length) % matches.length);
    } else if (e.key === 'Enter' && showList && active >= 0) {
      e.preventDefault();
      pick(matches[active]);
    } else if (e.key === 'Escape' && showList) {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <input
        {...props}
        id={id}
        value={current}
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        className={cn(fieldClasses, 'h-10', className)}
        onChange={(e) => {
          change(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          setOpen(false);
          onBlur?.(e);
        }}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-line bg-surface p-1 shadow-lg"
        >
          {matches.map((option, i) => (
            <li
              key={option}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown runs before the input blurs and closes the list
              onMouseDown={(e) => {
                e.preventDefault();
                pick(option);
              }}
              className={cn('cursor-pointer rounded-lg px-3 py-2 text-sm text-ink', i === active && 'bg-surface-subtle')}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
