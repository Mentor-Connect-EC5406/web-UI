import { apiClient } from './client';
import { LoginCredentials, AuthResponse } from '../types/auth';

/**
 * Login API Service Function
 * Sends POST request with user credentials and returns user profile and tokens.
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // If token is received, save it to localStorage
    if (response.accessToken) {
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};