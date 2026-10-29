import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { paths } from '@/app/paths';

const sizes = {
  sm: 'h-7 w-auto',
  md: 'h-9 w-auto',
  lg: 'h-11 w-auto',
};

interface BrandLogoProps {
  size?: keyof typeof sizes;
  className?: string;
}

/** Logo mark + wordmark, linking home. Uses the user's logo from the public directory. */
export function BrandLogo({ size = 'md', className }: BrandLogoProps) {
  return (
    <Link to={paths.home} className={cn('inline-flex items-center', className)}>
      <img
        src="/MentorConnect-logo-wordmark-transparent.png"
        alt="MentorConnect"
        className={cn('object-contain', sizes[size])}
      />
    </Link>
  );
}
