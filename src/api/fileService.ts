import { apiClient, getApiErrorMessage, unwrapApiResponse } from './client';

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
    return unwrapApiResponse(response);
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error) ?? 'File upload failed. Please try again.', { cause: error });
  }
};