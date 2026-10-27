import type { ReactNode } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/cn';

interface PersonRowProps {
  name: string;
  avatarUrl?: string | null;
  // second line below the name
  detail: ReactNode;
  // badges shown next to the name
  badges?: ReactNode;
  // action buttons on the right
  actions?: ReactNode;
  className?: string;
}

// avatar row used for sessions, booking requests and mentor applications
export function PersonRow({ name, avatarUrl, detail, badges, actions, className }: PersonRowProps) {
  return (
    <div className={cn('flex flex-col gap-3 rounded-xl border border-line p-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={name} src={avatarUrl} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-ink">{name}</p>
            {badges}
          </div>
          <div className="text-xs text-ink-secondary">{detail}</div>
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
