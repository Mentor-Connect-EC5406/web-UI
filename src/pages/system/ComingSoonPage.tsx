import { Construction } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

/** Placeholder for navigation items whose page has not been designed yet */
export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState icon={Construction} title="Coming soon" description="This page is being designed and will be available in a later release." />
    </>
  );
}
