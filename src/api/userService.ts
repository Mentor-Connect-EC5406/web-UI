import { apiClient } from './client';
import { User } from '../types/auth';

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
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile.');
  }
};

/**
 * Update User Profile API Service Function
 * Sends PUT request to update user details.
 */
export const updateUserProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    const response = await apiClient.put<User>('/users/profile', data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update user profile.');
  }
};