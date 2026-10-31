import { apiClient } from './client';

/**
 * Generic Create API Service Function
 * Sends POST request to create a new resource/entity on the server.
 */
export const createItem = async <T, R>(endpoint: string, data: T): Promise<R> => {
  try {
    const response = await apiClient.post<R>(endpoint, data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create resource. Please try again.');
  }
};