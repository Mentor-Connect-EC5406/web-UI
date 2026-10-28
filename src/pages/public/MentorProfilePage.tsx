import { Link, useParams } from 'react-router-dom';
import { Briefcase, MapPin, UserX } from 'lucide-react';
import type { Mentor } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { RatingStars } from '@/components/common/RatingStars';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { BookingPanel } from '@/components/booking/BookingPanel';
import { LinkList } from '@/components/profile/ProfileLists';
import { ProfileExtrasSections } from '@/components/profile/ProfileView';
import { useSession } from '@/auth/session';
import { useMentor, useMentorReviews, useMentorSlots } from '@/data/mentors';
import { useBookSession } from '@/data/sessions';
import { formatPrice } from '@/lib/format';

interface MentorProfilePageProps {
  // where the back to mentors link leads
  backPath: string;
}

function ProfileHeader({ mentor }: { mentor: Mentor }) {
  return (
    <Card className="mb-6 flex flex-col gap-6 p-6 md:flex-row">
      <Avatar name={mentor.name} src={mentor.avatarUrl} size="xl" />
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{mentor.name}</h1>
          {mentor.isVerified && <VerifiedBadge />}
        </div>
        {mentor.headline && <p className="mt-1 text-ink">{mentor.headline}</p>}
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-secondary">
          <span className="flex items-center gap-1.5"><Briefcase className="size-4" aria-hidden /> {mentor.title} · {mentor.organization}</span>
          {mentor.location && <span className="flex items-center gap-1.5 text-sm"><MapPin className="size-4" aria-hidden /> {mentor.location}</span>}
        </p>
        <div className="mt-2"><LinkList links={mentor.links} /></div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <RatingStars rating={mentor.rating} reviewCount={mentor.reviewCount} size="md" />
          <span className="text-ink-secondary">{mentor.experienceYears} years experience</span>
          <span className="font-semibold text-ink">{formatPrice(mentor.hourlyRate)} / hr</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="info">{mentor.industry}</Badge>
          {mentor.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}
        </div>
      </div>
    </Card>
  );
}

// reviews are loaded in a separate query so the profile shows before they arrive
function Reviews({ mentorId }: { mentorId: string }) {
  const reviews = useMentorReviews(mentorId);
  return (
    <AsyncContent query={reviews} loading={<ListSkeleton rows={2} rowClassName="h-24" />}>
      {(list) => (
        <div className="space-y-4">
          {list.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{review.author}</p>
                  <p className="text-xs text-ink-muted">{review.date}</p>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-sm leading-relaxed text-ink">{review.text}</p>
            </Card>
          ))}
        </div>
      )}
    </AsyncContent>
  );
}

// mentor profile with about tab, reviews tab and booking panel
export default function MentorProfilePage({ backPath }: MentorProfilePageProps) {
  const { id = '' } = useParams();
  const user = useSession((s) => s.user);
  const mentorQuery = useMentor(id);
  const slots = useMentorSlots(id);
  const book = useBookSession();

  return (
    <AsyncContent query={mentorQuery}>
      {(mentor) =>
        !mentor ? (
          <EmptyState
            icon={UserX}
            title="Mentor not found"
            description="This profile may have been removed."
            action={<Button asChild variant="secondary"><Link to={backPath}>Back to mentors</Link></Button>}
          />
        ) : (
          <div>
            <ProfileHeader mentor={mentor} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Tabs defaultValue="about">
                  <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="space-y-6">
                    <Card className="p-6">
                      <p className="text-sm leading-relaxed whitespace-pre-line text-ink">{mentor.bio}</p>
                    </Card>
                    <ProfileExtrasSections extras={mentor} />
                  </TabsContent>
                  <TabsContent value="reviews">
                    <Reviews mentorId={mentor.id} />
                  </TabsContent>
                </Tabs>
              </div>

              <AsyncContent query={slots} loading={<ListSkeleton rows={1} rowClassName="h-80" />}>
                {(slotList) => (
                  <BookingPanel
                    mentor={mentor}
                    slots={slotList}
                    onBook={(slot) => book.mutateAsync({ mentor, slot, studentName: user?.name ?? 'Guest' })}
                  />
                )}
              </AsyncContent>
            </div>
          </div>
        )
      }
    </AsyncContent>
  );
}
