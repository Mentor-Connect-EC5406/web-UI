import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX, SlidersHorizontal } from 'lucide-react';
import type { Mentor, MentorFilterValues, MentorSort } from '@/types';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { MentorCard } from '@/components/mentor/MentorCard';
import { MentorFilters } from '@/components/mentor/MentorFilters';
import { useMentors } from '@/data/mentors';
import { useDebounce } from '@/hooks/useDebounce';
import { EMPTY_FILTERS, SORT_OPTIONS } from '@/lib/mentorFilters';

interface MentorsPageProps {
  // differs between the public site and the student area
  profilePath: (id: string) => string;
  // saving is offered only to signed in students, the public page passes none of these
  savedIds?: ReadonlySet<string>;
  pendingSaveId?: string | null;
  onToggleSave?: (mentor: Mentor) => void;
}

// mentor discovery with search, filters and sort
export default function MentorsPage({ profilePath, savedIds, pendingSaveId, onToggleSave }: MentorsPageProps) {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState<MentorFilterValues>(() => ({
    ...EMPTY_FILTERS,
    query: params.get('q') ?? '',
    industries: params.getAll('industry'),
  }));
  const debouncedQuery = useDebounce(filters.query);
  const mentors = useMentors({ ...filters, query: debouncedQuery });
  const count = mentors.data?.length;

  return (
    <div>
      <PageHeader
        title="Find mentors"
        description={count === undefined ? 'Searching…' : `${count} ${count === 1 ? 'mentor' : 'mentors'} found`}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          label="Search mentors"
          placeholder="Search by name, skill or company"
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          containerClassName="flex-1"
        />
        <Select
          aria-label="Sort mentors"
          placeholder="Sort"
          options={SORT_OPTIONS}
          value={filters.sort}
          onValueChange={(sort) => setFilters({ ...filters, sort: sort as MentorSort })}
          className="sm:w-48"
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="h-fit p-5 lg:w-64 lg:shrink-0">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
            <SlidersHorizontal className="size-4" aria-hidden /> Filters
          </h2>
          <MentorFilters value={filters} onChange={setFilters} />
        </Card>

        <div className="min-w-0 flex-1">
          <AsyncContent query={mentors} loading={<ListSkeleton rows={4} rowClassName="h-56" className="grid grid-cols-1 gap-4 space-y-0 xl:grid-cols-2" />}>
            {(list) =>
              list.length === 0 ? (
                <EmptyState icon={SearchX} title="No mentors match your search" description="Try a different keyword or reset the filters." />
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {list.map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      mentor={mentor}
                      profilePath={profilePath(mentor.id)}
                      saved={savedIds?.has(mentor.id)}
                      savePending={pendingSaveId === mentor.id}
                      onToggleSave={onToggleSave}
                    />
                  ))}
                </div>
              )
            }
          </AsyncContent>
        </div>
      </div>
    </div>
  );
}
