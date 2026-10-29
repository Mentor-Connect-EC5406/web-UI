import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import type { Goal, GoalInput } from '@/types';
import { Button } from '@/components/ui/Button';
import { AsyncContent } from '@/components/common/AsyncContent';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { GoalCard } from '@/components/goals/GoalCard';
import { GoalDialog } from '@/components/goals/GoalDialog';
import { useCreateGoal, useDeleteGoal, useGoals, useUpdateGoal } from '@/data/goals';

// null when closed, an empty object when adding, the goal when editing
type Editing = { goal?: Goal } | null;

// career goals with progress, add, edit and delete
export default function CareerGoalsPage() {
  const goals = useGoals();
  const create = useCreateGoal();
  const update = useUpdateGoal();
  const remove = useDeleteGoal();
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<Goal | null>(null);
  const saving = create.isPending || (update.isPending && !!editing);

  function openDialog(goal?: Goal) {
    create.reset();
    update.reset();
    setEditing({ goal });
  }

  function save(values: GoalInput) {
    const close = { onSuccess: () => setEditing(null) };
    if (editing?.goal) update.mutate({ id: editing.goal.id, ...values }, close);
    else create.mutate(values, close);
  }

  const addButton = <Button onClick={() => openDialog()}><Plus /> Add goal</Button>;

  return (
    <div>
      <PageHeader title="Career goals" description="Set goals, track progress and share them with your mentors" actions={addButton} />

      <AsyncContent query={goals} loading={<ListSkeleton rows={3} rowClassName="h-40" />}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No goals yet"
              description="Add your first career goal to keep track of what you are working towards."
              action={addButton}
            />
          ) : (
            <div className="space-y-3">
              {list.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  savingProgress={!editing && update.isPending && update.variables?.id === goal.id}
                  onSaveProgress={(progress) => update.mutate({ id: goal.id, progress })}
                  onEdit={() => openDialog(goal)}
                  onDelete={() => setDeleting(goal)}
                />
              ))}
            </div>
          )
        }
      </AsyncContent>

      {editing && (
        <GoalDialog
          goal={editing.goal}
          saving={saving}
          saveError={(create.error ?? update.error)?.message}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        loading={remove.isPending}
        title="Delete this goal?"
        description={`"${deleting?.title ?? ''}" and its progress will be removed. This cannot be undone.`}
        confirmLabel="Delete goal"
        cancelLabel="Keep goal"
        danger
      />
    </div>
  );
}
