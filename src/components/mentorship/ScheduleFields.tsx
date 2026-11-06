import { format } from 'date-fns';
import type { MentorshipFrequency, MentorshipSchedule, Weekday } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import { MENTORSHIP_FREQUENCY_LABELS, WEEKDAY_OPTIONS } from '@/config/options';
import { describeSchedule, MAX_DAY_OF_MONTH, ordinal, upcomingDates, type MentorshipErrors } from '@/lib/mentorships';

interface ScheduleFieldsProps {
  value: MentorshipSchedule;
  onChange: (value: MentorshipSchedule) => void;
  errors: Pick<MentorshipErrors, 'startDate' | 'time'>;
  idPrefix: string;
}

const FREQUENCY_OPTIONS = (Object.keys(MENTORSHIP_FREQUENCY_LABELS) as MentorshipFrequency[]).map((f) => ({ value: f, label: MENTORSHIP_FREQUENCY_LABELS[f] }));
const DAY_OF_MONTH_OPTIONS = Array.from({ length: MAX_DAY_OF_MONTH }, (_, i) => ({ value: String(i + 1), label: `The ${ordinal(i + 1)}` }));
const PREVIEW_COUNT = 3;

// how often, which day, what time and from when, with the first dates as a preview
export function ScheduleFields({ value, onChange, errors, idPrefix }: ScheduleFieldsProps) {
  const set = (changes: Partial<MentorshipSchedule>) => onChange({ ...value, ...changes });
  const id = (name: string) => `${idPrefix}-${name}`;
  const preview = Object.keys(errors).length === 0 ? upcomingDates(value, PREVIEW_COUNT) : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField htmlFor={id('frequency')} label="How often" required>
          <Select id={id('frequency')} value={value.frequency} onValueChange={(v) => set({ frequency: v as MentorshipFrequency })} placeholder="Choose" options={FREQUENCY_OPTIONS} />
        </FormField>
        {value.frequency === 'MONTHLY' ? (
          <FormField htmlFor={id('day')} label="Day of the month" required>
            <Select id={id('day')} value={String(value.dayOfMonth)} onValueChange={(v) => set({ dayOfMonth: Number(v) })} placeholder="Choose" options={DAY_OF_MONTH_OPTIONS} />
          </FormField>
        ) : (
          <FormField htmlFor={id('day')} label="Day of the week" required>
            <Select id={id('day')} value={String(value.weekday)} onValueChange={(v) => set({ weekday: Number(v) as Weekday })} placeholder="Choose" options={WEEKDAY_OPTIONS} />
          </FormField>
        )}
        <FormField htmlFor={id('time')} label="Time" required error={errors.time} hint={`In ${value.timezone}`}>
          <Input id={id('time')} type="time" step={900} value={value.time} onChange={(e) => set({ time: e.target.value })} aria-invalid={errors.time ? true : undefined} />
        </FormField>
        <FormField htmlFor={id('start')} label="Starting from" required error={errors.startDate}>
          <Input
            id={id('start')}
            type="date"
            min={format(new Date(), 'yyyy-MM-dd')}
            value={value.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
            aria-invalid={errors.startDate ? true : undefined}
          />
        </FormField>
      </div>
      {preview.length > 0 && (
        <div className="rounded-xl bg-surface-subtle p-3 text-sm">
          <p className="font-medium text-ink">{describeSchedule(value)}</p>
          <p className="mt-1 text-ink-secondary">First sessions: {preview.map((d) => format(d, 'EEE d MMM')).join(', ')}</p>
        </div>
      )}
    </div>
  );
}
