import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  // short supporting text e.g. "3 this month"
  hint?: string;
  className?: string;
}

// metric tile used on dashboards with centered details and hover popup transition
export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <Card className={cn("group flex flex-col items-center justify-center p-5 text-center cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/5 hover:border-brand/40", className)}>
      <p className="text-sm font-medium text-ink-secondary transition-colors duration-200 group-hover:text-ink">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-ink">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </Card>
  );
}
