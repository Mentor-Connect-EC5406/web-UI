import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/common/SearchInput';
import { INDUSTRIES } from '@/config/options';
import { cn } from '@/lib/cn';
import { paths } from '@/app/paths';
import { LandingSection } from './LandingSection';

/**
 * Find a mentor from the home page: type keywords, pick one or more job
 * fields, then continue to the results (Find mentors page applies both).
 */
export function MentorSearchSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [fields, setFields] = useState<string[]>([]);

  const toggleField = (field: string) =>
    setFields((current) => (current.includes(field) ? current.filter((f) => f !== field) : [...current, field]));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    fields.forEach((field) => params.append('industry', field));
    const search = params.toString();
    navigate(search ? `${paths.mentors}?${search}` : paths.mentors);
  }

  return (
    <LandingSection
      id="find-mentor"
      title="Find the mentor for your field"
      subtitle="Search by name, skill or company, and pick one or more job fields you are interested in."
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput
            label="Search mentors"
            placeholder="Try “React”, “data analyst” or a company name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            containerClassName="flex-1"
            className="h-12"
          />
          <Button type="submit" size="lg">
            {fields.length > 0 ? `Search ${fields.length} ${fields.length === 1 ? 'field' : 'fields'}` : 'Search mentors'}
          </Button>
        </div>

        <fieldset className="mt-6">
          <legend className="mb-3 flex w-full items-center justify-between text-sm font-medium text-ink">
            <span>Hot job fields</span>
            {fields.length > 0 && (
              <button type="button" onClick={() => setFields([])} className="text-ink-secondary underline-offset-4 hover:text-ink hover:underline">
                Clear selection
              </button>
            )}
          </legend>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((field) => {
              const selected = fields.includes(field);
              return (
                <button
                  key={field}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleField(field)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    selected ? 'border-brand bg-brand-soft text-ink' : 'border-line bg-surface text-ink-secondary hover:border-line-strong hover:text-ink',
                  )}
                >
                  {selected && <Check className="size-3.5" aria-hidden />}
                  {field}
                </button>
              );
            })}
          </div>
        </fieldset>
      </form>
    </LandingSection>
  );
}
