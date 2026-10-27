import { CalendarX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { SlotLegend, TimeSlot } from '@/components/booking/TimeSlot';
import { useSession } from '@/auth/session';
import { useMentorSlots, useRemoveSlot } from '@/data/mentors';
import { formatDate, viewerTimezone } from '@/lib/format';

// upcoming slots grouped by day, available and blocked slots can be removed
export default function AvailabilityPage() {
  const user = useSession((s) => s.user);
  const slots = useMentorSlots(user?.id ?? '');
  const removeSlot = useRemoveSlot();

  return (
    <div>
      <PageHeader title="Availability" description={`Your upcoming time slots, shown in ${viewerTimezone()}.`} />
      <div className="mb-6">
        <SlotLegend statuses={['AVAILABLE', 'HELD', 'BOOKED', 'BLOCKED']} />
      </div>

      <AsyncContent query={slots} loading={<ListSkeleton rows={3} rowClassName="h-40" className="grid grid-cols-1 gap-4 space-y-0 md:grid-cols-2 lg:grid-cols-3" />}>
        {(list) => {
          const days = [...new Set(list.map((s) => formatDate(s.startsAt)))];
          return days.length === 0 ? (
            <EmptyState icon={CalendarX} title="No time slots" description="Slots you open for booking appear here." />
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
    </div>
  );
}
