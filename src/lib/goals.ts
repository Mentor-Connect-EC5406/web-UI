import { format } from 'date-fns';
import type { GoalInput } from '@/types';
import { GOAL_TITLE_MAX_LENGTH } from '@/config/constants';

export interface GoalErrors {
  title?: string;
  targetDate?: string;
  progress?: string;
}

// a target date already in the past is allowed only if it was saved before so old goals stay editable
export function validateGoal(values: GoalInput, savedTargetDate: string | null = null, today: Date = new Date()): GoalErrors {
  const errors: GoalErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = 'Give your goal a title.';
  else if (title.length > GOAL_TITLE_MAX_LENGTH) errors.title = `Keep the title under ${GOAL_TITLE_MAX_LENGTH} characters.`;

  if (values.targetDate && values.targetDate !== savedTargetDate && values.targetDate < format(today, 'yyyy-MM-dd')) {
    errors.targetDate = 'Choose a date from today onwards.';
  }

  if (!Number.isInteger(values.progress) || values.progress < 0 || values.progress > 100) {
    errors.progress = 'Progress must be a whole number from 0 to 100.';
  }
  return errors;
}
