import { useMemo } from 'react';
import type { Mentor } from '@/types';
import { useSaveMentor, useSavedMentors, useUnsaveMentor } from '@/data/mentors';
import { paths } from '@/app/paths';
import MentorsPage from '@/pages/public/MentorsPage';

// find mentors inside the student area with the save toggle on each card
export default function StudentMentorsPage() {
  const saved = useSavedMentors();
  const save = useSaveMentor();
  const unsave = useUnsaveMentor();
  const savedIds = useMemo(() => new Set(saved.data?.map((m) => m.id)), [saved.data]);
  const pendingSaveId = save.isPending ? save.variables : unsave.isPending ? unsave.variables : null;

  function toggle(mentor: Mentor) {
    if (savedIds.has(mentor.id)) unsave.mutate(mentor.id);
    else save.mutate(mentor.id);
  }

  // the toggle waits for the saved list so it never shows the wrong state
  const onToggleSave = saved.data ? toggle : undefined;

  return (
    <MentorsPage
      profilePath={paths.student.mentor}
      savedIds={savedIds}
      pendingSaveId={pendingSaveId}
      onToggleSave={onToggleSave}
    />
  );
}
