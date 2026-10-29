import type { ReactNode } from 'react';
import type { Slot, SlotStatus } from '@/types';
import { cn } from '@/lib/cn';
import { formatDate, formatTime } from '@/lib/format';
import { slotStatusMeta } from '@/lib/status';

interface TimeSlotProps {
  slot: Slot;
  selected?: boolean;
  // when provided only available slots are selectable
  onSelect?: (slot: Slot) => void;
  // extra control placed at the end e.g. a remove button
  trailing?: ReactNode;
  showDate?: boolean;
}

// one time slot showing its time and status
export function TimeSlot({ slot, selected, onSelect, trailing, showDate }: TimeSlotProps) {
  const meta = slotStatusMeta[slot.status];
  const selectable = !!onSelect && slot.status === 'AVAILABLE';
  const content = (
    <>
      <span className="font-semibold">{formatTime(slot.startsAt)}</span>
      {showDate && <span className="text-xs">{formatDate(slot.startsAt)}</span>}
      <span className="text-xs">{selected ? 'Selected' : meta.label}</span>
    </>
  );
  const classes = cn(
    'flex w-full flex-col items-start gap-0.5 rounded-xl border p-2.5 text-left text-sm transition-colors',
    meta.className,
    selected && 'border-ink bg-brand-soft text-ink ring-2 ring-ink',
  );

  if (onSelect) {
    return (
      <button type="button" disabled={!selectable} aria-pressed={selected} onClick={() => onSelect(slot)} className={cn(classes, 'disabled:cursor-not-allowed')}>
        {content}
      </button>
    );
  }
  return (
    <div className={cn(classes, 'flex-row items-center justify-between')}>
      <div className="flex flex-col gap-0.5">{content}</div>
      {trailing}
    </div>
  );
}

// legend that explains slot statuses with text labels
export function SlotLegend({ statuses }: { statuses: SlotStatus[] }) {
  return (
    <ul className="flex flex-wrap gap-2 text-xs" aria-label="Slot status legend">
      {statuses.map((status) => (
        <li key={status} className={cn('rounded-full border px-2 py-0.5 font-medium', slotStatusMeta[status].className)}>
          {slotStatusMeta[status].label}
        </li>
      ))}
    </ul>
  );
}
