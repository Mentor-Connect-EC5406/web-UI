import { AsyncContent } from '@/components/common/AsyncContent';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { StudentProfileForm } from '@/components/profile/StudentProfileForm';
import { useSession } from '@/auth/session';
import { useStudentProfile, useUpdateStudentProfile } from '@/data/users';

export default function StudentProfilePage() {
  const user = useSession((s) => s.user);
  const profile = useStudentProfile();
  const update = useUpdateStudentProfile();

  return (
    <div className="max-w-3xl">
      <PageHeader title="Profile" description="Information mentors see when you book a session" />
      <AsyncContent query={profile} loading={<ListSkeleton rows={3} rowClassName="h-48" />}>
        {(data) => (
          <StudentProfileForm
            profile={data}
            avatarUrl={user?.avatarUrl ?? null}
            saving={update.isPending}
            onSave={update.mutateAsync}
          />
        )}
      </AsyncContent>
    </div>
  );
}
