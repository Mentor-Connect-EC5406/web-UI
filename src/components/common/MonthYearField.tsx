import { Select } from '@/components/ui/Select';
import { MONTH_OPTIONS, yearOptions } from '@/lib/profile';

interface MonthYearFieldProps {
  id: string;
  // used to name the two selects for screen readers e.g. "Start date"
  label: string;
  // YYYY-MM, a half picked value like "2024-" is kept so the other select can be filled next
  value: string;
  onChange: (value: string) => void;
}

// month and year selects instead of type month which some browsers do not support
export function MonthYearField({ id, label, value, onChange }: MonthYearFieldProps) {
  const [year = '', month = ''] = value.split('-');
  return (
    <div className="grid grid-cols-2 gap-2">
      <Select
        id={id}
        aria-label={`${label} month`}
        placeholder="Month"
        options={MONTH_OPTIONS}
        value={month}
        onValueChange={(m) => onChange(`${year}-${m}`)}
      />
      <Select
        id={`${id}-year`}
        aria-label={`${label} year`}
        placeholder="Year"
        options={yearOptions()}
        value={year}
        onValueChange={(y) => onChange(`${y}-${month}`)}
      />
    </div>
  );
}
