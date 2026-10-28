import { UserX } from 'lucide-react';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { MentorProfileForm } from '@/components/profile/MentorProfileForm';
import { useSession } from '@/auth/session';
import { useMyMentorProfile, useUpdateMyMentorProfile } from '@/data/mentors';
import { paths } from '@/app/paths';

export default function EditMentorProfilePage() {
  const user = useSession((s) => s.user);
  const mentor = useMyMentorProfile();
  const update = useUpdateMyMentorProfile();

  return (
    <div className="max-w-3xl">
      <PageHeader title="Profile" description="What students see when they find and book you" />
      <AsyncContent query={mentor} loading={<ListSkeleton rows={4} rowClassName="h-48" />}>
        {(data) =>
          data ? (
            <MentorProfileForm
              mentor={data}
              email={user?.email ?? ''}
              publicPath={paths.mentor(data.id)}
              saving={update.isPending}
              onSave={update.mutateAsync}
            />
          ) : (
            <EmptyState
              icon={UserX}
              title="Your mentor profile is not set up yet"
              description="It is created when your mentor application is submitted. Check back once onboarding is complete."
            />
          )
        }
      </AsyncContent>
    </div>
  );
}
