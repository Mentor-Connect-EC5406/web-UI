import { useState } from 'react';
import { RotateCcw, SearchX, Ban, Users } from 'lucide-react';
import type { ManagedUser, Role } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { PersonRow } from '@/components/common/PersonRow';
import { SearchInput } from '@/components/common/SearchInput';
import { useManagedUsers, useSetUserSuspended } from '@/data/admin';
import { ROLE_LABELS } from '@/config/options';
import { accountStatusMeta } from '@/lib/status';

const ALL = 'ALL';
const ROLE_FILTERS = [
  { value: ALL, label: 'All roles' },
  { value: 'STUDENT', label: 'Students' },
  { value: 'MENTOR', label: 'Mentors' },
];

// student and mentor accounts with suspend and reactivate
export default function UsersPage() {
  const users = useManagedUsers();
  const setSuspended = useSetUserSuspended();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<Role | typeof ALL>(ALL);
  const [changing, setChanging] = useState<ManagedUser | null>(null);
  const suspending = changing?.status === 'ACTIVE';

  function confirm() {
    if (!changing) return;
    setSuspended.mutate({ userId: changing.id, suspended: suspending }, { onSuccess: () => setChanging(null) });
  }

  return (
    <div>
      <PageHeader title="Users" description="Find accounts and manage their access" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          label="Search users"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          containerClassName="flex-1"
        />
        <Select
          aria-label="Filter by role"
          placeholder="Role"
          options={ROLE_FILTERS}
          value={role}
          onValueChange={(v) => setRole(v as Role | typeof ALL)}
          className="sm:w-44"
        />
      </div>

      <AsyncContent query={users} loading={<ListSkeleton rows={5} rowClassName="h-16" />}>
        {(list) => {
          if (list.length === 0) return <EmptyState icon={Users} title="No users yet" description="Accounts appear here once people sign up." />;
          const q = query.trim().toLowerCase();
          const shown = list
            .filter((u) => role === ALL || u.role === role)
            .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
          return shown.length === 0 ? (
            <EmptyState icon={SearchX} title="No users match" description="Try a different name, email or role." />
          ) : (
            <>
              <p className="mb-3 text-sm text-ink-secondary">Showing {shown.length} of {list.length} users</p>
              <ul className="space-y-3">
                {shown.map((u) => {
                  const status = accountStatusMeta[u.status];
                  return (
                    <li key={u.id}>
                      <PersonRow
                        className="bg-surface p-4"
                        name={u.name}
                        badges={
                          <>
                            <Badge>{ROLE_LABELS[u.role]}</Badge>
                            <Badge tone={status.tone}>{status.label}</Badge>
                          </>
                        }
                        detail={<span className="break-all">{u.email}</span>}
                        actions={
                          u.status === 'ACTIVE' ? (
                            <Button size="sm" variant="secondary" onClick={() => setChanging(u)}><Ban /> Suspend</Button>
                          ) : (
                            <Button size="sm" variant="secondary" onClick={() => setChanging(u)}><RotateCcw /> Reactivate</Button>
                          )
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </>
          );
        }}
      </AsyncContent>

      <ConfirmDialog
        open={!!changing}
        onClose={() => setChanging(null)}
        onConfirm={confirm}
        loading={setSuspended.isPending}
        title={suspending ? `Suspend ${changing?.name ?? 'this user'}?` : `Reactivate ${changing?.name ?? 'this user'}?`}
        description={
          suspending
            ? 'They will be signed out and cannot sign in, book or take sessions until reactivated.'
            : 'They will be able to sign in and use MentorConnect again.'
        }
        confirmLabel={suspending ? 'Suspend account' : 'Reactivate account'}
        cancelLabel="Cancel"
        danger={suspending}
      />
    </div>
  );
}
