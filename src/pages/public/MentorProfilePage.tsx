import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Briefcase, CheckCircle2, Handshake, MapPin, UserX } from 'lucide-react';
import type { Mentor, Role } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { RatingStars } from '@/components/common/RatingStars';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { BookingPanel } from '@/components/booking/BookingPanel';
import { MentorshipRequestDialog } from '@/components/mentorship/MentorshipRequestDialog';
import { LinkList } from '@/components/profile/ProfileLists';
import { ProfileExtrasSections } from '@/components/profile/ProfileView';
import { useSession } from '@/auth/session';
import { useMentor, useMentorReviews, useMentorSlots } from '@/data/mentors';
import { useRequestMentorship } from '@/data/mentorships';
import { useBookSession } from '@/data/sessions';
import { isFeatureOn } from '@/config/features';
import { paths } from '@/app/paths';
import { formatPrice } from '@/lib/format';
import { useAuthRedirect } from '@/auth/useAuthRedirect';

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

// the api lets only signed in students book
function bookingBlocked(role: Role | undefined, onLogIn: () => void) {
  if (role === 'STUDENT') return undefined;
  if (!role) {
    return (
      <Button className="mt-4 w-full" onClick={onLogIn}>
        Log in as a student to book
      </Button>
    );
  }
  return <p className="mt-4 text-sm text-ink-secondary">Only students can book sessions.</p>;
}

// regular sessions over months, the mentor approves and sets the schedule
function MentorshipRequestCard({ mentor }: { mentor: Mentor }) {
  const request = useRequestMentorship();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader title={<><Handshake className="size-4 text-ink-secondary" aria-hidden /> Long term mentorship</>} />
      <CardBody className="space-y-3">
        {request.isSuccess ? (
          <p role="status" className="flex items-start gap-2 rounded-xl bg-success-soft p-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>Request sent to {mentor.name}. <Link to={paths.student.mentorships} className="font-semibold underline">Follow it in Mentorships</Link>.</span>
          </p>
        ) : (
          <p className="text-sm text-ink-secondary">Meet {mentor.name} every week, every two weeks or every month to work towards a bigger goal.</p>
        )}
        <Button variant="secondary" className="w-full" onClick={() => { request.reset(); setOpen(true); }}>Request mentorship</Button>
      </CardBody>
      {open && (
        <MentorshipRequestDialog
          mentorName={mentor.name}
          saving={request.isPending}
          saveError={request.error?.message}
          onClose={() => setOpen(false)}
          onSubmit={(input) => request.mutate({ ...input, mentorId: mentor.id }, { onSuccess: () => setOpen(false) })}
        />
      )}
    </Card>
  );
}

// mentor profile with about tab, reviews tab and booking panel
export default function MentorProfilePage({ backPath }: MentorProfilePageProps) {
  const { id = '' } = useParams();
  const user = useSession((s) => s.user);
  const mentorQuery = useMentor(id);
  const slots = useMentorSlots(id);
  const book = useBookSession();
  const { logIn } = useAuthRedirect();

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

              <div className="space-y-6">
                <AsyncContent query={slots} loading={<ListSkeleton rows={1} rowClassName="h-80" />}>
                  {(slotList) => (
                    <BookingPanel
                      mentor={mentor}
                      slots={slotList}
                      onBook={(slot, topic) => book.mutateAsync({ slotId: slot.id, topic })}
                      blocked={bookingBlocked(user?.role, logIn)}
                      sessionsHref={user?.role === 'STUDENT' ? paths.student.sessions : undefined}
                    />
                  )}
                </AsyncContent>
                {isFeatureOn('mentorships') && user?.role === 'STUDENT' && <MentorshipRequestCard mentor={mentor} />}
              </div>
            </div>
          </div>
        )
      }
    </AsyncContent>
  );
}
