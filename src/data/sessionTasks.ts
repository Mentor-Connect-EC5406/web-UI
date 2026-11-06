import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SessionTask, SessionTaskInput } from '@/types';
import { isFeatureOn } from '@/config/features';
import { api } from './http';
import { keys } from './keys';

// proposed api, see docs/API_HANDOFF.md "Session plan"

interface SessionTaskResponse extends Omit<SessionTask, 'sessionId' | 'createdByName'> {
  bookingId: string;
  createdByName: string | null;
}

const toTask = (t: SessionTaskResponse): SessionTask => ({
  id: t.id,
  sessionId: t.bookingId,
  type: t.type,
  title: t.title,
  details: t.details ?? '',
  dueDate: t.dueDate,
  done: t.done,
  createdBy: t.createdBy,
  createdByName: t.createdByName ?? (t.createdBy === 'MENTOR' ? 'Mentor' : 'Student'),
  updatedAt: t.updatedAt,
});

const taskBody = (input: Partial<SessionTaskInput>) => ({
  ...input,
  ...(input.title !== undefined && { title: input.title.trim() }),
  ...(input.details !== undefined && { details: input.details.trim() }),
});

export const sessionTasksApi = {
  list: (sessionId: string) => api<SessionTaskResponse[]>(`/api/bookings/${sessionId}/tasks`).then((list) => list.map(toTask)),

  create: ({ sessionId, ...input }: SessionTaskInput & { sessionId: string }) =>
    api<SessionTaskResponse>(`/api/bookings/${sessionId}/tasks`, { method: 'POST', body: taskBody(input) }).then(toTask),

  update: ({ sessionId, id, ...changes }: Partial<SessionTaskInput> & { sessionId: string; id: string; done?: boolean }) =>
    api<SessionTaskResponse>(`/api/bookings/${sessionId}/tasks/${id}`, { method: 'PATCH', body: taskBody(changes) }).then(toTask),

  remove: ({ sessionId, id }: { sessionId: string; id: string }) =>
    api<void>(`/api/bookings/${sessionId}/tasks/${id}`, { method: 'DELETE' }),
};

export const useSessionTasks = (sessionId: string) =>
  useQuery({
    queryKey: keys.sessionTasks(sessionId),
    queryFn: () => sessionTasksApi.list(sessionId),
    enabled: !!sessionId && isFeatureOn('sessionTasks'),
  });

function useTaskMutation<T extends { sessionId: string }, R>(mutationFn: (input: T) => Promise<R>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (_, { sessionId }) => client.invalidateQueries({ queryKey: keys.sessionTasks(sessionId) }),
  });
}

export const useCreateSessionTask = () => useTaskMutation(sessionTasksApi.create);
export const useUpdateSessionTask = () => useTaskMutation(sessionTasksApi.update);
export const useDeleteSessionTask = () => useTaskMutation(sessionTasksApi.remove);
