import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { fieldClasses } from './fieldClasses';

interface SelectProps {
  id?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder: string;
  options: readonly string[] | readonly { value: string; label: string }[];
  className?: string;
  'aria-label'?: string;
}

// pass options as plain strings or as value label pairs
export function Select({ id, value, onValueChange, placeholder, options, className, ...aria }: SelectProps) {
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        id={id}
        className={cn(fieldClasses, 'flex h-10 items-center justify-between gap-2 data-[placeholder]:text-ink-muted', className)}
        {...aria}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="size-4 text-ink-muted" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          // long lists like years scroll inside the menu instead of running off the screen
          className="z-50 max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-(--radix-select-trigger-width) overflow-hidden rounded-xl border border-line bg-surface shadow-lg"
        >
          <SelectPrimitive.Viewport className="p-1">
            {items.map((item) => (
              <SelectPrimitive.Item
                key={item.value}
                value={item.value}
                className="relative flex cursor-pointer items-center rounded-lg py-2 pr-2 pl-8 text-sm text-ink outline-none select-none data-[highlighted]:bg-surface-subtle"
              >
                <SelectPrimitive.ItemIndicator className="absolute left-2">
                  <Check className="size-4" />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
