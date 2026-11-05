import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import type { AccountStatus, AdminStats, ManagedUser, MentorApplication, Report, ReportDecision, ReportStatus } from '@/types';
import { REPORT_CATEGORY_LABELS } from '@/config/options';
import { formatPrice, fromCents } from '@/lib/format';
import type { UserResponse } from './account';
import { api, listAll } from './http';
import { keys } from './keys';

interface AdminStatsResponse {
  users: number;
  mentors: number;
  bookings: number;
  revenueCents: number;
}

interface VerificationResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string | null;
  organization: string | null;
  industry: string | null;
  experienceYears: number;
  submittedAt: string;
  documentUrl: string | null;
}

interface ReportResponse {
  id: string;
  reporterName: string | null;
  reportedUserName: string | null;
  category: string;
  description: string;
  status: ReportStatus;
  resolution: string | null;
  createdAt: string;
}

const shortDate = (iso: string) => format(parseISO(iso), 'd MMM yyyy');

const toApplication = (v: VerificationResponse): MentorApplication => ({
  id: v.id,
  name: `${v.firstName} ${v.lastName}`.trim(),
  email: v.email,
  title: v.title ?? '',
  organization: v.organization ?? '',
  industry: v.industry ?? '',
  experienceYears: v.experienceYears,
  submittedAt: shortDate(v.submittedAt),
  documents: [{ name: 'Verification document', type: 'PDF or image', url: v.documentUrl }],
});

const toReport = (r: ReportResponse): Report => ({
  id: r.id,
  type: REPORT_CATEGORY_LABELS[r.category] ?? r.category,
  reporter: r.reporterName ?? 'Unknown user',
  reportedUser: r.reportedUserName ?? 'Not given',
  status: r.status,
  details: r.description,
  createdAt: r.createdAt,
  resolutionNote: r.resolution,
});

// a deactivated account cannot sign in either, so it is shown as suspended
const toManagedUser = (u: UserResponse): ManagedUser => ({
  id: u.id,
  name: `${u.firstName} ${u.lastName}`.trim(),
  email: u.email,
  role: u.role,
  status: (u.accountStatus === 'ACTIVE' ? 'ACTIVE' : 'SUSPENDED') satisfies AccountStatus,
  joinedAt: u.createdAt.slice(0, 10),
});

export const adminApi = {
  stats: () =>
    api<AdminStatsResponse>('/api/admin/stats').then(
      (s): AdminStats => ({
        users: s.users.toLocaleString('en-LK'),
        mentors: s.mentors.toLocaleString('en-LK'),
        bookings: s.bookings.toLocaleString('en-LK'),
        revenue: formatPrice(fromCents(s.revenueCents)),
      }),
    ),

  applications: () => listAll<VerificationResponse>('/api/verifications', { status: 'PENDING' }).then((list) => list.map(toApplication)),

  decide: ({ applicationId, approve, reason }: { applicationId: string; approve: boolean; reason?: string }) =>
    api<unknown>(`/api/verifications/${applicationId}`, {
      method: 'PUT',
      body: { status: approve ? 'APPROVED' : 'REJECTED', reviewNote: reason?.trim() || null },
    }),

  reports: () => listAll<ReportResponse>('/api/reports').then((list) => list.map(toReport)),

  decideReport: ({ reportId, outcome, note }: ReportDecision) =>
    api<unknown>(`/api/reports/${reportId}`, { method: 'PUT', body: { status: outcome, resolution: note.trim() } }),

  // admins manage students and mentors, not each other
  users: () =>
    listAll<UserResponse>('/api/users').then((list) => list.filter((u) => u.role !== 'ADMIN').map(toManagedUser)),

  setUserSuspended: ({ userId, suspended }: { userId: string; suspended: boolean }) =>
    api<unknown>(`/api/users/${userId}/status`, { method: 'PUT', body: { accountStatus: suspended ? 'SUSPENDED' : 'ACTIVE' } }),
};

export const useAdminStats = () => useQuery({ queryKey: keys.adminStats, queryFn: adminApi.stats });
export const useMentorApplications = () => useQuery({ queryKey: keys.applications, queryFn: adminApi.applications });
export const useReports = () => useQuery({ queryKey: keys.reports, queryFn: adminApi.reports });
export const useManagedUsers = () => useQuery({ queryKey: keys.users, queryFn: adminApi.users });

// stats count users and mentors, so every admin change refreshes them too
function useAdminMutation<T, R>(mutationFn: (input: T) => Promise<R>, key: readonly unknown[]) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([client.invalidateQueries({ queryKey: key }), client.invalidateQueries({ queryKey: keys.adminStats })]),
  });
}

export const useDecideApplication = () => useAdminMutation(adminApi.decide, keys.applications);
export const useDecideReport = () => useAdminMutation(adminApi.decideReport, keys.reports);
export const useSetUserSuspended = () => useAdminMutation(adminApi.setUserSuspended, keys.users);
