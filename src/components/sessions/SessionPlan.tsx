import { Check, ListChecks, Pencil, Plus, Trash2 } from 'lucide-react';
import type { SessionTask, SessionTaskType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { SESSION_TASK_LABELS } from '@/config/options';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format';

interface SessionPlanProps {
  tasks: SessionTask[];
  viewerRole: 'STUDENT' | 'MENTOR';
  // id of the task being saved, its controls show progress
  busyId?: string | null;
  // false once the session is cancelled
  editable: boolean;
  onAdd: (type: SessionTaskType) => void;
  onEdit: (task: SessionTask) => void;
  onToggle: (task: SessionTask) => void;
  onDelete: (task: SessionTask) => void;
}

const TYPES = Object.keys(SESSION_TASK_LABELS) as SessionTaskType[];

// both sides add items and tick them off, only the author edits or removes an item
export function SessionPlan({ tasks, viewerRole, busyId, editable, onAdd, onEdit, onToggle, onDelete }: SessionPlanProps) {
  return (
    <Card>
      <CardHeader title={<><ListChecks className="size-4 text-ink-secondary" aria-hidden /> Session plan</>} />
      <CardBody className="space-y-6">
        {TYPES.map((type) => {
          const items = tasks.filter((t) => t.type === type);
          const done = items.filter((t) => t.done).length;
          return (
            <section key={type} aria-labelledby={`plan-${type}`}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 id={`plan-${type}`} className="text-sm font-semibold text-ink">
                  {SESSION_TASK_LABELS[type].plural}
                  {items.length > 0 && <span className="ml-2 font-normal text-ink-secondary">{done} of {items.length} done</span>}
                </h3>
                {editable && (
                  <Button variant="ghost" size="sm" onClick={() => onAdd(type)} aria-label={`Add ${SESSION_TASK_LABELS[type].label.toLowerCase()}`}>
                    <Plus /> Add
                  </Button>
                )}
              </div>
              {items.length === 0 ? (
                <p className="text-sm text-ink-muted">{SESSION_TASK_LABELS[type].hint}. Nothing added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((task) => {
                    const own = task.createdBy === viewerRole;
                    const busy = busyId === task.id;
                    return (
                      <li key={task.id} className="flex items-start gap-3 rounded-xl border border-line p-3">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={task.done}
                          aria-label={`Mark "${task.title}" as ${task.done ? 'not done' : 'done'}`}
                          disabled={!editable || busy}
                          onClick={() => onToggle(task)}
                          className={cn(
                            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                            task.done ? 'border-success bg-success text-white' : 'border-line-strong bg-surface hover:border-ink',
                          )}
                        >
                          {task.done && <Check className="size-3.5" aria-hidden />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={cn('text-sm font-medium text-ink', task.done && 'text-ink-secondary line-through')}>{task.title}</p>
                          {task.details && <p className="mt-0.5 text-sm whitespace-pre-line text-ink-secondary">{task.details}</p>}
                          <p className="mt-1 text-xs text-ink-muted">
                            {task.dueDate && <>Due {formatDate(task.dueDate)} · </>}
                            Added by {own ? 'you' : task.createdByName}
                          </p>
                        </div>
                        {own && editable && (
                          <div className="flex shrink-0 gap-1">
                            <Button variant="ghost" size="icon" className="size-8" aria-label={`Edit "${task.title}"`} disabled={busy} onClick={() => onEdit(task)}>
                              <Pencil />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-8" aria-label={`Remove "${task.title}"`} disabled={busy} onClick={() => onDelete(task)}>
                              <Trash2 />
                            </Button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </CardBody>
    </Card>
  );
}
