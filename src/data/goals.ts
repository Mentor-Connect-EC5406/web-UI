import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Goal, GoalInput } from '@/types';
import { api, listAll } from './http';
import { keys } from './keys';

export const goalsApi = {
  list: () => listAll<Goal>('/api/goals'),
  create: (goal: GoalInput) => api<Goal>('/api/goals', { method: 'POST', body: { ...goal, title: goal.title.trim() } }),
  update: ({ id, ...changes }: Partial<GoalInput> & { id: string }) =>
    api<Goal>(`/api/goals/${id}`, { method: 'PATCH', body: changes.title === undefined ? changes : { ...changes, title: changes.title.trim() } }),
  remove: (id: string) => api<void>(`/api/goals/${id}`, { method: 'DELETE' }),
};

export const useGoals = () => useQuery({ queryKey: keys.goals, queryFn: goalsApi.list });

function useGoalMutation<T, R>(mutationFn: (input: T) => Promise<R>) {
  const client = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => client.invalidateQueries({ queryKey: keys.goals }) });
}

export const useCreateGoal = () => useGoalMutation(goalsApi.create);
export const useUpdateGoal = () => useGoalMutation(goalsApi.update);
export const useDeleteGoal = () => useGoalMutation(goalsApi.remove);
