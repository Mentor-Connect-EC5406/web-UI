import { useState } from 'react';
import { addWeeks } from 'date-fns';
import { AlertCircle, CalendarX, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import type { Slot } from '@/types';
import { Button } from '@/components/ui/Button';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { WeekCalendar } from '@/components/common/WeekCalendar';
import { WeekNavigator } from '@/components/common/WeekNavigator';
import { AddSlotDialog } from '@/components/booking/AddSlotDialog';
import { SlotLegend, TimeSlot } from '@/components/booking/TimeSlot';
import { useAddSlots, useMySlots, useRemoveSlot, type AddSlotsResult } from '@/data/mentors';
import { useDisclosure } from '@/hooks/useDisclosure';
import { formatWeekRange, groupByDay, startOfWeekOf, weekDays } from '@/lib/calendar';
import { formatSessionTime, viewerTimezone } from '@/lib/format';

function SaveSummary({ result }: { result: AddSlotsResult }) {
  return (
    <div className="mb-4 space-y-2">
      <p role="status" className="flex items-start gap-2 rounded-xl bg-success-soft p-3 text-sm text-success">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
        {result.created} {result.created === 1 ? 'slot' : 'slots'} added. Students can book them now.
      </p>
      {result.failed.length > 0 && (
        <div role="alert" className="flex items-start gap-2 rounded-xl bg-accent-soft p-3 text-sm text-accent">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p>{result.failed.length} could not be added:</p>
            <ul className="mt-1 list-disc pl-5">
              {result.failed.map(({ range, reason }) => <li key={range.startsAt}>{formatSessionTime(range.startsAt, range.endsAt)}: {reason}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// the mentor's week at a glance, open or blocked slots can be removed
export default function AvailabilityPage() {
  const slots = useMySlots();
  const removeSlot = useRemoveSlot();
  const addSlots = useAddSlots();
  const dialog = useDisclosure();
  const thisWeek = startOfWeekOf(new Date());
  const [weekStart, setWeekStart] = useState(thisWeek);
  const days = weekDays(weekStart);

  function openDialog() {
    addSlots.reset();
    dialog.open();
  }

  const removeButton = (slot: Slot) => {
    const busy = removeSlot.isPending && removeSlot.variables === slot.id;
    return (slot.status === 'AVAILABLE' || slot.status === 'BLOCKED') && (
      <Button variant="ghost" size="icon" className="size-8" aria-label="Remove slot" loading={busy} disabled={removeSlot.isPending} onClick={() => removeSlot.mutate(slot.id)}>
        {!busy && <Trash2 />}
      </Button>
    );
  };

  return (
    <div>
      <PageHeader
        title="Availability"
        description={`Open times students can book, shown in ${viewerTimezone()}.`}
        actions={<Button onClick={openDialog} disabled={!slots.data}><Plus /> Add times</Button>}
      />
      {addSlots.data && !dialog.isOpen && <SaveSummary result={addSlots.data} />}
      {removeSlot.error && <p role="alert" className="mb-4 rounded-xl bg-accent-soft p-3 text-sm text-accent">{removeSlot.error.message}</p>}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <WeekNavigator
          label={formatWeekRange(days)}
          onPrevious={() => setWeekStart((w) => addWeeks(w, -1))}
          onNext={() => setWeekStart((w) => addWeeks(w, 1))}
          previousDisabled={weekStart <= thisWeek}
          onToday={weekStart > thisWeek ? () => setWeekStart(thisWeek) : undefined}
          className="sm:min-w-80"
        />
        <SlotLegend statuses={['AVAILABLE', 'HELD', 'BOOKED', 'BLOCKED']} />
      </div>

      <AsyncContent query={slots} loading={<ListSkeleton rows={3} rowClassName="h-32" />}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No open times yet"
              description="Add the times you can mentor. Students see them on your profile and can book them."
              action={<Button onClick={openDialog}><Plus /> Add times</Button>}
            />
          ) : (
            <WeekCalendar
              days={days}
              itemsByDay={groupByDay(list, (s) => s.startsAt)}
              itemKey={(s) => s.id}
              emptyDayLabel="No slots"
              renderItem={(slot) => <TimeSlot slot={slot} trailing={removeButton(slot)} />}
            />
          )
        }
      </AsyncContent>

      {dialog.isOpen && (
        <AddSlotDialog
          open
          existing={slots.data ?? []}
          saving={addSlots.isPending}
          saveError={addSlots.error?.message}
          onClose={dialog.close}
          onSave={(ranges) => addSlots.mutate(ranges, { onSuccess: dialog.close })}
        />
      )}
    </div>
  );
}
