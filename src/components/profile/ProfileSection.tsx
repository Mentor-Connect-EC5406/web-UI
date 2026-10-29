import type { ReactNode } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

interface ProfileSectionProps {
  // anchor the completeness checklist scrolls to
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function ProfileSection({ id, title, description, action, children }: ProfileSectionProps) {
  return (
    <Card id={id} className="scroll-mt-6" aria-labelledby={`${id}-title`}>
      <CardHeader title={<span id={`${id}-title`}>{title}</span>} action={action} />
      <CardBody>
        {description && <p className="-mt-2 mb-4 text-sm text-ink-secondary">{description}</p>}
        {children}
      </CardBody>
    </Card>
  );
}
