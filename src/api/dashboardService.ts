import { apiClient, getApiErrorMessage, unwrapApiResponse } from './client';

// Dashboard Stats Interface
export interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  totalRevenue: number;
  growthRate: number;
  recentActivityCount: number;
}

/**
 * Get Dashboard Stats API Service Function
 * Sends GET request to fetch analytics and statistics for the dashboard.
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return unwrapApiResponse(response);
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error) ?? 'Failed to fetch dashboard statistics.', { cause: error });
  }
};