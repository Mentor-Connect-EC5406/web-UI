import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  // short supporting text e.g. "3 this month"
  hint?: string;
}

// metric tile used on dashboards
export function StatCard({ label, value, icon: Icon, hint }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between gap-3 p-5">
      <div>
        <p className="text-sm text-ink-secondary">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
        {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
      </div>
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
        <Icon className="size-6 text-ink-secondary" aria-hidden />
      </div>
    </Card>
  );
}
