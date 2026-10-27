import type { ComponentProps } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { fieldClasses } from '@/components/ui/fieldClasses';

interface SearchInputProps extends ComponentProps<'input'> {
  label: string;
  containerClassName?: string;
}

/** Text input with a search icon. `label` is read by screen readers. */
export function SearchInput({ label, className, containerClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      <input type="search" aria-label={label} className={cn(fieldClasses, 'h-10 pl-9', className)} {...props} />
    </div>
  );
}
