import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
};

export const useAdminStats = () => useQuery({ queryKey: keys.adminStats, queryFn: adminApi.stats });
export const useMentorApplications = () => useQuery({ queryKey: keys.applications, queryFn: adminApi.applications });
export const useReports = () => useQuery({ queryKey: keys.reports, queryFn: adminApi.reports });

export function useDecideApplication() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: adminApi.decide,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.applications }),
  });
}
