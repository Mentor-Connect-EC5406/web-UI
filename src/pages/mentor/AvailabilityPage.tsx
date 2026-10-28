import { useState } from 'react';
import { CalendarX, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { AddSlotDialog } from '@/components/booking/AddSlotDialog';
import { SlotLegend, TimeSlot } from '@/components/booking/TimeSlot';
import { useSession } from '@/auth/session';
import { useAddSlot, useMentorSlots, useRemoveSlot } from '@/data/mentors';
import { useDisclosure } from '@/hooks/useDisclosure';
import { formatDate, formatSessionTime, viewerTimezone } from '@/lib/format';

// upcoming slots grouped by day, available and blocked slots can be removed
export default function AvailabilityPage() {
  const user = useSession((s) => s.user);
  const slots = useMentorSlots(user?.id ?? '');
  const removeSlot = useRemoveSlot();
  const addSlot = useAddSlot();
  const dialog = useDisclosure();
  const [added, setAdded] = useState<string | null>(null);

  function openDialog() {
    addSlot.reset();
    setAdded(null);
    dialog.open();
  }

  function save(range: { startsAt: string; endsAt: string }) {
    addSlot.mutate(range, {
      onSuccess: () => {
        setAdded(formatSessionTime(range.startsAt, range.endsAt));
        dialog.close();
      },
    });
  }

  return (
    <div>
      <PageHeader
        title="Availability"
        description={`Your upcoming time slots, shown in ${viewerTimezone()}.`}
        actions={<Button onClick={openDialog} disabled={!slots.data}><Plus /> Add slot</Button>}
      />
      {added && (
        <p role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-success-soft p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          Slot added for {added}. Students can book it now.
        </p>
      )}
      <div className="mb-6">
        <SlotLegend statuses={['AVAILABLE', 'HELD', 'BOOKED', 'BLOCKED']} />
      </div>

      <AsyncContent query={slots} loading={<ListSkeleton rows={3} rowClassName="h-40" className="grid grid-cols-1 gap-4 space-y-0 md:grid-cols-2 lg:grid-cols-3" />}>
        {(list) => {
          const days = [...new Set(list.map((s) => formatDate(s.startsAt)))];
          return days.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No time slots"
              description="Slots you open for booking appear here."
              action={<Button onClick={openDialog}><Plus /> Add slot</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {days.map((day) => (
                <Card key={day}>
                  <CardHeader title={day} />
                  <CardBody className="space-y-2">
                    {list
                      .filter((s) => formatDate(s.startsAt) === day)
                      .map((slot) => (
                        <TimeSlot
                          key={slot.id}
                          slot={slot}
                          trailing={(slot.status === 'AVAILABLE' || slot.status === 'BLOCKED') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              aria-label="Remove slot"
                              loading={removeSlot.isPending && removeSlot.variables === slot.id}
                              onClick={() => removeSlot.mutate(slot.id)}
                            >
                              {!(removeSlot.isPending && removeSlot.variables === slot.id) && <Trash2 />}
                            </Button>
                          )}
                        />
                      ))}
                  </CardBody>
                </Card>
              ))}
            </div>
          );
        }}
      </AsyncContent>

      {dialog.isOpen && (
        <AddSlotDialog
          open
          existing={slots.data ?? []}
          saving={addSlot.isPending}
          saveError={addSlot.error?.message}
          onClose={dialog.close}
          onSave={save}
        />
      )}
    </div>
  );
}
