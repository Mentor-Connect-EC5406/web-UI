import type { Mentor, User } from '@/types';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { MentorProfileForm } from '@/components/profile/MentorProfileForm';
import { useSession } from '@/auth/session';
import { useMyMentorProfile, useUpdateMyMentorProfile } from '@/data/mentors';
import { paths } from '@/app/paths';
import { emptyExtras } from '@/lib/profile';

// used when onboarding did not create the mentor record, saving creates it
function blankMentor(user: User | null): Mentor {
  return {
    ...emptyExtras(),
    id: '',
    name: user?.name ?? '',
    title: '',
    organization: '',
    industry: '',
    avatarUrl: user?.avatarUrl ?? null,
    bio: '',
    skills: [],
    experienceYears: 0,
    hourlyRate: 0,
    rating: 0,
    reviewCount: 0,
    isVerified: false,
  };
}

export default function EditMentorProfilePage() {
  const user = useSession((s) => s.user);
  const mentor = useMyMentorProfile();
  const update = useUpdateMyMentorProfile();

  return (
    <div className="max-w-6xl">
      <PageHeader title="Profile" description="What students see when they find and book you" />
      <AsyncContent query={mentor} loading={<ListSkeleton rows={4} rowClassName="h-48" />}>
        {(data) => {
          const profile = data ?? blankMentor(user);
          return (
            <MentorProfileForm
              key={profile.id}
              mentor={profile}
              email={user?.email ?? ''}
              publicPath={paths.mentor(profile.id)}
              saving={update.isPending}
              onSave={update.mutateAsync}
            />
          );
        }}
      </AsyncContent>
    </div>
  );
}
