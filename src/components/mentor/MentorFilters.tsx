import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/common/FormField';
import type { MentorFilterValues } from '@/types';
import { INDUSTRIES } from '@/config/options';
import { EMPTY_FILTERS } from '@/lib/mentorFilters';
import { formatPrice } from '@/lib/format';

const RATING_OPTIONS = [
  { value: '4', label: '4+ stars' },
  { value: '4.5', label: '4.5+ stars' },
];

const RATE_OPTIONS = [2000, 3000, 5000].map((rate) => ({ value: String(rate), label: `Up to ${formatPrice(rate)}` }));

interface MentorFiltersProps {
  value: MentorFilterValues;
  onChange: (value: MentorFilterValues) => void;
}

// controlled filter panel for mentor discovery
export function MentorFilters({ value, onChange }: MentorFiltersProps) {
  const set = (patch: Partial<MentorFilterValues>) => onChange({ ...value, ...patch });

  function toggleIndustry(industry: string) {
    const industries = value.industries.includes(industry)
      ? value.industries.filter((i) => i !== industry)
      : [...value.industries, industry];
    set({ industries });
  }

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">Industry</legend>
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {INDUSTRIES.map((industry) => (
            <label key={industry} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                className="size-4 rounded accent-brand"
                checked={value.industries.includes(industry)}
                onChange={() => toggleIndustry(industry)}
              />
              {industry}
            </label>
          ))}
        </div>
      </fieldset>

      <FormField htmlFor="filter-rating" label="Minimum rating">
        <Select
          id="filter-rating"
          placeholder="Any rating"
          options={RATING_OPTIONS}
          value={value.minRating}
          onValueChange={(minRating) => set({ minRating })}
        />
      </FormField>

      <FormField htmlFor="filter-rate" label="Price per hour">
        <Select
          id="filter-rate"
          placeholder="Any price"
          options={RATE_OPTIONS}
          value={value.maxRate}
          onValueChange={(maxRate) => set({ maxRate })}
        />
      </FormField>

      <Button variant="secondary" className="w-full" onClick={() => onChange({ ...EMPTY_FILTERS, sort: value.sort })}>
        Reset filters
      </Button>
    </div>
  );
}
