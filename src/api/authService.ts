import axios, { type AxiosResponse } from 'axios';
import { apiClient } from './client';
import { type AuthResponse, type LoginCredentials } from '../types/auth';

const isAxiosResponse = <T>(response: T | AxiosResponse<T>): response is AxiosResponse<T> =>
  typeof response === 'object' &&
  response !== null &&
  'status' in response &&
  'headers' in response &&
  'data' in response;

const getResponseData = <T>(response: T | AxiosResponse<T>): T => {
  if (isAxiosResponse(response)) {
    return response.data;
  }

  return response;
};

const getErrorMessage = (error: unknown): string | undefined => {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = data.message;
      return typeof message === 'string' ? message : undefined;
    }
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response;
    if (typeof response === 'object' && response !== null && 'data' in response) {
      const data = response.data;
      if (typeof data === 'object' && data !== null && 'message' in data) {
        const message = data.message;
        return typeof message === 'string' ? message : undefined;
      }
    }
  }

  return undefined;
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    const data = getResponseData(response);
    if (data.accessToken) {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
    }
    return data;
  } catch (error: unknown) {
    throw new Error(
      getErrorMessage(error) ?? 'Login failed. Please check your credentials.',
      { cause: error }
    );
  }
};