import { apiClient } from './client';
import axios from 'axios';

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
    const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
    throw new Error(message || 'Failed to fetch dashboard statistics.', { cause: error });
  }
};