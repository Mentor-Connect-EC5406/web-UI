import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ChevronDown } from 'lucide-react';
import type { Mentor } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/format';

interface MentorCardProps {
  mentor: Mentor;
  // differs between the public site and the student area
  profilePath: string;
  // save toggle is shown only when onToggleSave is given e.g. in the student area
  saved?: boolean;
  savePending?: boolean;
  onToggleSave?: (mentor: Mentor) => void;
}

// mentor summary card for discovery grids
export function MentorCard({ mentor, profilePath, saved = false, savePending, onToggleSave }: MentorCardProps) {
  const [showSkills, setShowSkills] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSkills(false);
      }
    }
    if (showSkills) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSkills]);

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

        </div>
        {onToggleSave && (
          <Button
            variant="ghost"
            size="icon"
            className="-mt-1 -mr-2 size-9"
            aria-label={`Save ${mentor.name}`}
            aria-pressed={saved}
            title={saved ? 'Remove from saved mentors' : 'Save mentor'}
            loading={savePending}
            onClick={() => onToggleSave(mentor)}
          >
            {!savePending && <Bookmark className={cn(saved && 'fill-brand text-ink')} aria-hidden />}
          </Button>
        )}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-1.5" ref={dropdownRef}>
        <Badge tone="info">{mentor.industry}</Badge>
        {mentor.skills.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowSkills((prev) => !prev);
              }}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-line bg-surface-subtle px-2.5 py-0.5 text-xs font-medium text-ink transition-colors hover:bg-line/40 focus:outline-none"
              aria-expanded={showSkills}
            >
              <span>Skills ({mentor.skills.length})</span>
              <ChevronDown className={cn("size-3 text-ink-secondary transition-transform duration-200", showSkills && "rotate-180")} />
            </button>

            {showSkills && (
              <div 
                className="absolute left-0 top-full z-30 mt-1.5 w-max max-w-xs rounded-xl border border-line bg-surface p-3 shadow-lg ring-1 ring-black/5"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="mb-2 text-xs font-semibold text-ink-secondary">Skills & Expertise</p>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
