import { Link } from 'react-router-dom';
import { Bookmark, BookmarkX, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { PersonRow } from '@/components/common/PersonRow';
import { RatingStars } from '@/components/common/RatingStars';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { useSavedMentors, useUnsaveMentor } from '@/data/mentors';
import { paths } from '@/app/paths';

// mentors the student bookmarked while browsing
export default function SavedMentorsPage() {
  const saved = useSavedMentors();
  const unsave = useUnsaveMentor();
  const count = saved.data?.length;

  return (
    <div>
      <PageHeader
        title="Saved mentors"
        description={count !== undefined ? `${count} saved ${count === 1 ? 'mentor' : 'mentors'}` : 'Mentors you bookmarked to come back to'}
        actions={!!count && <Button asChild variant="secondary"><Link to={paths.student.mentors}><Search /> Find mentors</Link></Button>}
      />

      <AsyncContent query={saved} loading={<ListSkeleton rows={3} />}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved mentors yet"
              description="Use the bookmark on a mentor card to keep them here for later."
              action={<Button asChild><Link to={paths.student.mentors}>Find mentors</Link></Button>}
            />
          ) : (
            <ul className="space-y-3">
              {list.map((mentor) => {
                const busy = unsave.isPending && unsave.variables === mentor.id;
                return (
                  <li key={mentor.id}>
                    <PersonRow
                      className="bg-surface p-4"
                      name={mentor.name}
                      avatarUrl={mentor.avatarUrl}
                      badges={mentor.isVerified && <VerifiedBadge />}
                      detail={
                        <div className="mt-0.5 space-y-1">
                          <p>{mentor.title} · {mentor.organization}</p>
                          <RatingStars rating={mentor.rating} reviewCount={mentor.reviewCount} />
                        </div>
                      }
                      actions={
                        <>
                          <Button asChild size="sm" variant="secondary">
                            <Link to={paths.student.mentor(mentor.id)}>View profile</Link>
                          </Button>
                          <Button size="sm" variant="ghost" loading={busy} onClick={() => unsave.mutate(mentor.id)}>
                            {!busy && <BookmarkX />} Unsave
                          </Button>
                        </>
                      }
                    />
                  </li>
                );
              })}
            </ul>
          )
        }
      </AsyncContent>
    </div>
  );
}
