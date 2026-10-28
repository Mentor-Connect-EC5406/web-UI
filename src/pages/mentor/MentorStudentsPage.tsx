import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, SearchX, Users } from 'lucide-react';
import type { MentoredStudent } from '@/types';
import { Button } from '@/components/ui/Button';
import { AsyncContent } from '@/components/common/AsyncContent';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { PersonRow } from '@/components/common/PersonRow';
import { SearchInput } from '@/components/common/SearchInput';
import { useSession } from '@/auth/session';
import { useStartConversation } from '@/data/messages';
import { useMentorSessions } from '@/data/sessions';
import { formatDate } from '@/lib/format';
import { mentoredStudents } from '@/lib/sessions';
import { paths } from '@/app/paths';

// students the mentor has had sessions with, built from the session history
export default function MentorStudentsPage() {
  const user = useSession((s) => s.user);
  const sessions = useMentorSessions();
  const start = useStartConversation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function message(student: MentoredStudent) {
    if (!user || !student.studentId) return;
    start.mutate({ userId: user.id, otherId: student.studentId }, { onSuccess: (id) => navigate(paths.mentorArea.conversation(id)) });
  }

  return (
    <div>
      <PageHeader title="Students" description="Students you have mentored or have sessions booked with" />

      <AsyncContent query={sessions} loading={<ListSkeleton rows={3} rowClassName="h-16" />}>
        {(list) => {
          const students = mentoredStudents(list);
          if (students.length === 0) {
            return <EmptyState icon={Users} title="No students yet" description="Students appear here after their first session with you is booked." />;
          }
          const q = query.trim().toLowerCase();
          const shown = students.filter((s) => s.name.toLowerCase().includes(q));
          return (
            <>
              <SearchInput
                label="Search students"
                placeholder="Search by name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                containerClassName="mb-4 sm:max-w-sm"
              />
              {start.error && <p role="alert" className="mb-3 text-sm text-accent">{start.error.message}</p>}
              {shown.length === 0 ? (
                <EmptyState icon={SearchX} title="No students match your search" description="Check the spelling or clear the search." />
              ) : (
                <ul className="space-y-3">
                  {shown.map((student) => {
                    const busy = start.isPending && start.variables?.otherId === student.studentId;
                    return (
                      <li key={student.key}>
                        <PersonRow
                          className="bg-surface p-4"
                          name={student.name}
                          detail={`${student.sessionCount} ${student.sessionCount === 1 ? 'session' : 'sessions'} · Last session ${formatDate(student.lastSessionAt)}`}
                          actions={student.studentId && (
                            <Button size="sm" variant="secondary" loading={busy} disabled={start.isPending} onClick={() => message(student)}>
                              {!busy && <MessageSquare />} Message
                            </Button>
                          )}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          );
        }}
      </AsyncContent>
    </div>
  );
}
