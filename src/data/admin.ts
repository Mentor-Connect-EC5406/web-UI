import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReportDecision } from '@/types';
import { db, mutate, respond } from './mockServer';
import { keys } from './keys';

// replace each function body with a real API call of the same signature
export const adminApi = {
  stats: () => respond(() => db.adminStats),
  applications: () => respond(() => db.applications),
  reports: () => respond(() => db.reports),
  // either decision removes the application from the queue
  decide: ({ applicationId }: { applicationId: string; approve: boolean; reason?: string }) =>
    mutate(() => { db.applications = db.applications.filter((a) => a.id !== applicationId); }),

  decideReport: ({ reportId, outcome, note }: ReportDecision) =>
    mutate(() => {
      if (!note.trim()) throw new Error('Add a note explaining the decision.');
      db.reports = db.reports.map((r) => (r.id === reportId ? { ...r, status: outcome, resolutionNote: note.trim() } : r));
    }),

  users: () => respond(() => db.users),
  setUserSuspended: ({ userId, suspended }: { userId: string; suspended: boolean }) =>
    mutate(() => {
      db.users = db.users.map((u) => (u.id === userId ? { ...u, status: suspended ? 'SUSPENDED' : 'ACTIVE' } : u));
    }),
};

export const useAdminStats = () => useQuery({ queryKey: keys.adminStats, queryFn: adminApi.stats });
export const useMentorApplications = () => useQuery({ queryKey: keys.applications, queryFn: adminApi.applications });
export const useReports = () => useQuery({ queryKey: keys.reports, queryFn: adminApi.reports });
export const useManagedUsers = () => useQuery({ queryKey: keys.users, queryFn: adminApi.users });

export function useDecideApplication() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: adminApi.decide,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.applications }),
  });
}

export function useDecideReport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: adminApi.decideReport,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.reports }),
  });
}

export function useSetUserSuspended() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: adminApi.setUserSuspended,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.users }),
  });
}
