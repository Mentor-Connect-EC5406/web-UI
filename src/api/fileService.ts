import { apiClient } from './client';

// Upload Response Interface
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  message?: string;
}

/**
 * Upload File or Image API Service Function
 * Sends POST request with FormData and multipart/form-data headers.
 */
export const uploadFile = async (file: File, endpoint: string = '/upload'): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post<UploadResponse>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    throw new Error(message || 'File upload failed. Please try again.', { cause: error });
  }
};