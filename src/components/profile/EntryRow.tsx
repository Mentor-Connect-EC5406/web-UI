import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface EntryRowProps {
  icon: LucideIcon;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  // edit and remove buttons in the editor, empty on read only views
  actions?: ReactNode;
}

// one item in an experience, education, certificate or project list
export function EntryRow({ icon: Icon, title, subtitle, meta, body, footer, actions }: EntryRowProps) {
  return (
    <div className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-ink-secondary">
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-ink">{title}</h3>
            {subtitle && <p className="text-sm text-ink">{subtitle}</p>}
            {meta && <p className="text-sm text-ink-muted">{meta}</p>}
          </div>
          {actions && <div className="flex shrink-0 gap-1">{actions}</div>}
        </div>
        {body && <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink-secondary">{body}</p>}
        {footer && <div className="mt-2">{footer}</div>}
      </div>
    </div>
  );
}
