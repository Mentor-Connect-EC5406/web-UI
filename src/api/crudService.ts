import { apiClient } from './client';

/**
 * Generic Create API Service Function
 * Sends POST request to create a new resource/entity on the server.
 */
export const createItem = async <T, R>(endpoint: string, data: T): Promise<R> => {
  try {
    const response = await apiClient.post<R>(endpoint, data);
    return response;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    throw new Error(message || 'Failed to create resource. Please try again.', { cause: error });
  }
};

/**
 * Generic Update (PUT) API Service Function
 * Sends PUT request to fully update an existing resource on the server.
 */
export const updateItem = async <T, R>(endpoint: string, data: T): Promise<R> => {
  try {
    const response = await apiClient.put<R>(endpoint, data);
    return response;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    throw new Error(message || 'Failed to update resource. Please try again.', { cause: error });
  }
};

/**
 * Generic Partial Update (PATCH) API Service Function
 * Sends PATCH request to partially update an existing resource on the server.
 */
export const patchItem = async <T, R>(endpoint: string, data: T): Promise<R> => {
  try {
    const response = await apiClient.patch<R>(endpoint, data);
    return response;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    throw new Error(message || 'Failed to partially update resource. Please try again.', { cause: error });
  }
};

/**
 * Generic Delete API Service Function
 * Sends DELETE request to remove a resource from the server.
 */
export const deleteItem = async <R>(endpoint: string): Promise<R> => {
  try {
    const response = await apiClient.delete<R>(endpoint);
    return response;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    throw new Error(message || 'Failed to delete resource. Please try again.', { cause: error });
  }
};