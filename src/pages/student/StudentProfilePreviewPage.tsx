import { Link } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AsyncContent } from '@/components/common/AsyncContent';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { StudentProfileView } from '@/components/profile/ProfileView';
import { useStudentProfile } from '@/data/users';
import { paths } from '@/app/paths';

// read only view of the saved profile, unsaved edits on the profile page are not shown here
export default function StudentProfilePreviewPage() {
  const profile = useStudentProfile();

  return (
    <div className="max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="mb-2">
        <Link to={paths.student.profile}><ArrowLeft aria-hidden /> Back to edit profile</Link>
      </Button>
      <PageHeader
        title="Your profile"
        description="This is how mentors see your saved profile."
        actions={
          <>
            <CopyLinkButton url={`${window.location.origin}${paths.student.profilePreview}`} />
            <Button asChild size="sm"><Link to={paths.student.profile}><Pencil aria-hidden /> Edit profile</Link></Button>
          </>
        }
      />
      <AsyncContent query={profile} loading={<ListSkeleton rows={3} rowClassName="h-40" />}>
        {(data) => <StudentProfileView profile={data} />}
      </AsyncContent>
    </div>
  );
}
