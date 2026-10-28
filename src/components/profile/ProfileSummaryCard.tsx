import type { ReactNode } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface ProfileSummaryCardProps {
  name: string;
  email: string;
  avatarUrl: string | null;
  subtitle?: ReactNode;
  // e.g. verification status or rating
  badges?: ReactNode;
  // e.g. a link to the public profile
  action?: ReactNode;
  progress: { percent: number; missing: string[] };
}

// identity block at the top of a profile page with a completeness meter
export function ProfileSummaryCard({ name, email, avatarUrl, subtitle, badges, action, progress }: ProfileSummaryCardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar name={name} src={avatarUrl} size="xl" />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold text-ink">{name}</p>
            {badges}
          </div>
          {subtitle && <p className="text-sm text-ink-secondary">{subtitle}</p>}
          <p className="truncate text-sm text-ink-muted">{email}</p>
        </div>
        {action}
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Profile completeness</span>
          <span className="text-ink-secondary">{progress.percent}%</span>
        </div>
        <Progress value={progress.percent} label="Profile completeness" />
        <p className="mt-2 text-xs text-ink-secondary">
          {progress.missing.length > 0
            ? `Still to add: ${progress.missing.join(', ')}.`
            : 'Your profile is complete.'}
        </p>
      </div>
    </Card>
  );
}
