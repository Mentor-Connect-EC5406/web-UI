import { Link } from 'react-router-dom';
import type { Mentor } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RatingStars } from '@/components/common/RatingStars';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { formatPrice } from '@/lib/format';

interface MentorCardProps {
  mentor: Mentor;
  // differs between the public site and the student area
  profilePath: string;
}

// mentor summary card for discovery grids
export function MentorCard({ mentor, profilePath }: MentorCardProps) {
  return (
    <Card className="flex flex-col p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar name={mentor.name} src={mentor.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-ink">{mentor.name}</h3>
            {mentor.isVerified && <VerifiedBadge />}
          </div>
          <p className="mt-0.5 text-sm text-ink-secondary">
            {mentor.title} · {mentor.organization}
          </p>
          <div className="mt-1.5">
            <RatingStars rating={mentor.rating} reviewCount={mentor.reviewCount} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge tone="info">{mentor.industry}</Badge>
        {mentor.skills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-ink-secondary">{mentor.experienceYears} years experience</span>
        <span className="font-semibold text-ink">{formatPrice(mentor.hourlyRate)} / hr</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button asChild variant="secondary" size="sm" className="flex-1">
          <Link to={profilePath}>View profile</Link>
        </Button>
        <Button asChild size="sm" className="flex-1">
          <Link to={`${profilePath}#book`}>Book a session</Link>
        </Button>
      </div>
    </Card>
  );
}
