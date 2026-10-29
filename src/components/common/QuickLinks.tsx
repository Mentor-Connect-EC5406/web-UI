import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export interface QuickLink {
  label: string;
  to: string;
  icon: LucideIcon;
}

// quick actions card used on dashboards
export function QuickLinks({ links }: { links: QuickLink[] }) {
  return (
    <Card>
      <CardHeader title="Quick actions" />
      <CardBody className="space-y-1">
        {links.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle"
          >
            <Icon className="size-4 text-ink-muted" aria-hidden />
            {label}
            <ArrowRight className="ml-auto size-4 text-ink-muted" aria-hidden />
          </Link>
        ))}
      </CardBody>
    </Card>
  );
}
