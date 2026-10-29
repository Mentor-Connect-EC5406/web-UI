import type { AccountStatus, ReportStatus, SessionStatus, SlotStatus } from '@/types';
import type { BadgeTone } from '@/components/ui/Badge';

export const sessionStatusMeta: Record<SessionStatus, { label: string; tone: BadgeTone }> = {
  PENDING: { label: 'Pending', tone: 'brand' },
  CONFIRMED: { label: 'Confirmed', tone: 'info' },
  COMPLETED: { label: 'Completed', tone: 'success' },
  CANCELLED: { label: 'Cancelled', tone: 'accent' },
};

export const slotStatusMeta: Record<SlotStatus, { label: string; className: string }> = {
  AVAILABLE: { label: 'Available', className: 'border-success bg-success-soft text-success' },
  HELD: { label: 'On hold', className: 'border-line bg-brand-soft text-ink-secondary' },
  BOOKED: { label: 'Booked', className: 'border-line bg-surface-muted text-ink-muted' },
  BLOCKED: { label: 'Blocked', className: 'border-line bg-surface-subtle text-ink-muted' },
};

export const reportStatusMeta: Record<ReportStatus, { label: string; tone: BadgeTone }> = {
  OPEN: { label: 'Open', tone: 'accent' },
  UNDER_REVIEW: { label: 'Under review', tone: 'brand' },
  RESOLVED: { label: 'Resolved', tone: 'success' },
  DISMISSED: { label: 'Dismissed', tone: 'neutral' },
};

export const accountStatusMeta: Record<AccountStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Active', tone: 'success' },
  SUSPENDED: { label: 'Suspended', tone: 'accent' },
};
