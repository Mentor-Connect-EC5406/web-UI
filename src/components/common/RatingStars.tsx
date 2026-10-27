import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

/** Five stars plus the numeric rating (and review count when given) */
export function RatingStars({ rating, reviewCount, size = 'sm' }: RatingStarsProps) {
  const starSize = size === 'sm' ? 'size-3.5' : 'size-5';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={cn(starSize, i < Math.round(rating) ? 'fill-brand text-brand' : 'text-line-strong')} />
        ))}
      </span>
      <span className="text-xs text-ink-secondary">
        <span className="sr-only">Rated </span>
        {rating.toFixed(1)}
        {reviewCount !== undefined && ` (${reviewCount} reviews)`}
      </span>
    </span>
  );
}
