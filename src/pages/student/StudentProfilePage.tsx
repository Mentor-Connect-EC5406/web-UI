import { AsyncContent } from '@/components/common/AsyncContent';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { StudentProfileForm } from '@/components/profile/StudentProfileForm';
import { useStudentProfile, useUpdateStudentProfile } from '@/data/users';
import { paths } from '@/app/paths';

export default function StudentProfilePage() {
  const profile = useStudentProfile();
  const update = useUpdateStudentProfile();

  return (
    <div className="max-w-6xl">
      <PageHeader title="Profile" description="Build a profile mentors can learn from before you meet" />
      <AsyncContent query={profile} loading={<ListSkeleton rows={3} rowClassName="h-48" />}>
        {(data) => (
          <StudentProfileForm
            profile={data}
            previewPath={paths.student.profilePreview}
            saving={update.isPending}
            onSave={update.mutateAsync}
          />
        )}
      </AsyncContent>
    </div>
  );
}
