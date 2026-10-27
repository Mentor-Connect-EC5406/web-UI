import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { paths } from '@/app/paths';

const sizes = {
  sm: { img: 'size-8', text: 'text-base' },
  md: { img: 'size-9', text: 'text-lg' },
  lg: { img: 'size-11', text: 'text-xl' },
};

interface BrandLogoProps {
  size?: keyof typeof sizes;
  className?: string;
}

/** Logo mark + wordmark, linking home. The only place the brand lock-up is built. */
export function BrandLogo({ size = 'md', className }: BrandLogoProps) {
  return (
    <Link to={paths.home} className={cn('flex items-center gap-2', className)}>
      <img src="/brand/mentorconnect-mark.png" alt="" className={sizes[size].img} />
      <span className={cn('font-bold text-ink', sizes[size].text)}>MentorConnect</span>
    </Link>
  );
}
