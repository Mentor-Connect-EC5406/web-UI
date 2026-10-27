import type { SessionStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { sessionStatusMeta } from '@/lib/status';

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const { label, tone } = sessionStatusMeta[status];
  return <Badge tone={tone}>{label}</Badge>;
}
