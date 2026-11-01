import { apiClient, getApiErrorMessage, unwrapApiResponse } from './client';

// Pagination and Filtering Parameters Interface
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
}

// Generic Paginated Response Interface
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Get Paginated and Filtered Table Data API Service Function
 * Sends GET request with query parameters for tables, lists, etc.
 */
export const getTableData = async <T>(
  endpoint: string, 
  params: PaginationParams
): Promise<PaginatedResponse<T>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<T>>(endpoint, { params });
    return unwrapApiResponse(response);
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error) ?? 'Failed to fetch table data.', { cause: error });
  }
};