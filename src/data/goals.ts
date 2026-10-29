import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GoalInput } from '@/types';
import { db, mutate, respond } from './mockServer';
import { keys } from './keys';

// replace each function body with a real API call of the same signature
export const goalsApi = {
  list: () => respond(() => db.goals),
  create: (goal: GoalInput) =>
    mutate(() => { db.goals = [...db.goals, { id: `g-${Date.now()}`, ...goal, title: goal.title.trim() }]; }),
  update: ({ id, ...changes }: Partial<GoalInput> & { id: string }) =>
    mutate(() => {
      db.goals = db.goals.map((g) => (g.id === id ? { ...g, ...changes, title: (changes.title ?? g.title).trim() } : g));
    }),
  remove: (id: string) => mutate(() => { db.goals = db.goals.filter((g) => g.id !== id); }),
};

export const useGoals = () => useQuery({ queryKey: keys.goals, queryFn: goalsApi.list });

function useGoalMutation<T>(mutationFn: (input: T) => Promise<void>) {
  const client = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => client.invalidateQueries({ queryKey: keys.goals }) });
}

export const useCreateGoal = () => useGoalMutation(goalsApi.create);
export const useUpdateGoal = () => useGoalMutation(goalsApi.update);
export const useDeleteGoal = () => useGoalMutation(goalsApi.remove);
