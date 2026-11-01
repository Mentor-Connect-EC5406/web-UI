import { apiClient } from './client';
import axios from 'axios'; // axios import කරගන්න

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.accessToken) {
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    return response;
  } catch (error: unknown) {
    let errorMessage = 'Login failed. Please check your credentials.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    // preserve-caught-error rule එක සඳහා { cause: error } එකතු කරන්න
    throw new Error(errorMessage, { cause: error });
  }
};