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
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics.');
  }
};