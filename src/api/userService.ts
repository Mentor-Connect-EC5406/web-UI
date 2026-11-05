import { apiClient, getApiErrorMessage, unwrapApiResponse } from './client';
import { type User } from '../types/auth';

// Update Profile Payload Interface
export interface UpdateProfileData {
  name?: string;
  email?: string;
}

/**
 * Get Current User Profile API Service Function
 * Sends GET request to fetch authenticated user's details.
 */
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/users/profile');
    return unwrapApiResponse(response);
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error) ?? 'Failed to fetch user profile.', {
      cause: error,
    });
  }
};

/**
 * Update User Profile API Service Function
 * Sends PUT request to update user details.
 */
export const updateUserProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    const response = await apiClient.put<User>('/users/profile', data);
    return unwrapApiResponse(response);
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error) ?? 'Failed to update user profile.', {
      cause: error,
    });
  }
};