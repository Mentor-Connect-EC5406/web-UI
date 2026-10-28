import type { ReactNode } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import type { ProfileField } from '@/lib/profile';

interface ProfileSummaryCardProps {
  // photo picker on edit pages
  photo: ReactNode;
  name: string;
  headline?: string;
  location?: string;
  email?: string;
  // e.g. verification status or open to opportunities
  badges?: ReactNode;
  // e.g. preview and copy link buttons
  actions?: ReactNode;
  progress: { percent: number; missing: ProfileField[] };
}

function jumpTo(section?: string) {
  const target = section && document.getElementById(section);
  if (!target) return;
  target.scrollIntoView({ block: 'start' });
  // move keyboard focus to the first control in that section
  target.querySelector<HTMLElement>('input, textarea, button')?.focus({ preventScroll: true });
}

// identity block on profile pages with a completeness checklist that jumps to each missing section
export function ProfileSummaryCard({ photo, name, headline, location, email, badges, actions, progress }: ProfileSummaryCardProps) {
  return (
    <Card className="p-6">
      {photo}
      <div className="mt-4 space-y-1 text-center">
        <p className="text-lg font-semibold break-words text-ink">{name}</p>
        {badges && <div className="flex flex-wrap justify-center gap-1.5">{badges}</div>}
        {headline && <p className="text-sm break-words text-ink-secondary">{headline}</p>}
        {location && (
          <p className="flex items-center justify-center gap-1 text-sm text-ink-muted">
            <MapPin className="size-3.5" aria-hidden /> {location}
          </p>
        )}
        {email && <p className="truncate text-sm text-ink-muted">{email}</p>}
      </div>

      {actions && <div className="mt-4 space-y-2">{actions}</div>}

      <div className="mt-5 border-t border-line pt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Profile strength</span>
          <span className="text-ink-secondary">{progress.percent}%</span>
        </div>
        <Progress value={progress.percent} label="Profile strength" />
        {progress.missing.length > 0 ? (
          <ul className="mt-3 space-y-1">
            {progress.missing.map((field) => (
              <li key={field.label}>
                <button
                  type="button"
                  onClick={() => jumpTo(field.section)}
                  className="flex items-center gap-1.5 text-sm text-info hover:underline"
                >
                  <Plus className="size-3.5" aria-hidden /> Add {field.label}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-ink-secondary">Your profile is complete.</p>
        )}
      </div>
    </Card>
  );
}
