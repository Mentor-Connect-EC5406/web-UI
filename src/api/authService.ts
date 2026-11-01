import { apiClient, getApiErrorMessage, unwrapApiResponse } from './client';
import { type LoginCredentials, type RegisterData, type AuthResponse } from '../types/auth';

/**
 * Login API Service Function
 * Sends POST request with user credentials and returns user profile and tokens.
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = unwrapApiResponse<AuthResponse>(
      await apiClient.post<AuthResponse>('/auth/login', credentials)
    );
    
    if (response.accessToken) {
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    
    return response;
  } catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error) ?? 'Login failed. Please check your credentials.',
      { cause: error }
    );
  }
};

/**
 * Register API Service Function
 * Sends POST request to register a new user and saves tokens.
 */
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = unwrapApiResponse<AuthResponse>(
      await apiClient.post<AuthResponse>('/auth/register', data)
    );
    
    if (response.accessToken) {
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    
    return response;
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error) ?? 'Registration failed. Please try again.', {
      cause: error,
    });
  }
};