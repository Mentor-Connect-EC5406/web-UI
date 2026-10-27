import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

/** Shown only for mentors whose verification is approved — DESIGN.md §10 */
export function VerifiedBadge() {
  return (
    <Badge tone="success">
      <ShieldCheck className="size-3" aria-hidden /> Verified
    </Badge>
  );
}
