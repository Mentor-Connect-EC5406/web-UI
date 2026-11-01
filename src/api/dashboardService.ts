import { apiClient } from './client';

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
    return response;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    throw new Error(message || 'Failed to fetch dashboard statistics.', { cause: error });
  }
};