import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  // short supporting text e.g. "3 this month"
  hint?: string;
}

// metric tile used on dashboards with interactive hover popup transition
export function StatCard({ label, value, icon: Icon, hint }: StatCardProps) {
  return (
    <Card className="group flex items-center justify-between gap-3 p-5 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/5 hover:border-brand/40">
      <div>
        <p className="text-sm text-ink-secondary transition-colors duration-200 group-hover:text-ink">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
        {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
      </div>
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-subtle transition-all duration-300 ease-out group-hover:bg-brand-soft/50 group-hover:scale-110">
        <Icon className="size-6 text-ink-secondary transition-colors duration-200 group-hover:text-ink" aria-hidden />
      </div>
    </Card>
  );
}
