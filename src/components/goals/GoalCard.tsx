import { useState } from 'react';
import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Goal } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface GoalCardProps {
  goal: Goal;
  savingProgress: boolean;
  onSaveProgress: (progress: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

// one goal with a slider to update progress in place
export function GoalCard({ goal, savingProgress, onSaveProgress, onEdit, onDelete }: GoalCardProps) {
  // the draft resets when the saved value changes after a successful save
  const [draft, setDraft] = useState({ base: goal.progress, value: goal.progress });
  const value = draft.base === goal.progress ? draft.value : goal.progress;
  const changed = value !== goal.progress;
  const sliderId = `goal-${goal.id}-progress`;

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-ink">{goal.title}</h2>
            {goal.progress === 100 && <Badge tone="success">Achieved</Badge>}
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-secondary">
            <CalendarDays className="size-3.5" aria-hidden />
            {goal.targetDate ? `Target ${format(parseISO(goal.targetDate), 'd MMM yyyy')}` : 'No target date'}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="secondary" onClick={onEdit}><Pencil /> Edit</Button>
          <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 /> Delete</Button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-ink-secondary">Progress</span>
          <span className="font-medium text-ink">{goal.progress}%</span>
        </div>
        <Progress value={goal.progress} label={`${goal.title} progress`} />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor={sliderId} className="text-sm text-ink-secondary sm:w-36">Update to {value}%</label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={(e) => setDraft({ base: goal.progress, value: Number(e.target.value) })}
          disabled={savingProgress}
          className="h-2 flex-1 cursor-pointer accent-brand"
        />
        <Button size="sm" disabled={!changed} loading={savingProgress} onClick={() => onSaveProgress(value)}>
          Save progress
        </Button>
      </div>
    </Card>
  );
}
