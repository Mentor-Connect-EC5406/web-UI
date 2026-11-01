import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser } from '../authService';
import { apiClient } from '../client';

// Mock apiClient post method
vi.mock('../client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('authService - loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should successfully login user and store tokens in localStorage', async () => {
    const mockResponse = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
    };

    // Mock resolved value for apiClient.post
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const credentials = { email: 'test@example.com', password: 'password123' };
    const result = await loginUser(credentials);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result).toEqual(mockResponse);
    expect(localStorage.getItem('access_token')).toBe('mock-access-token');
    expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token');
  });

  it('should throw an error when login fails', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid email or password',
        },
      },
    };

    vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

    const credentials = { email: 'wrong@example.com', password: 'wrongpassword' };

    await expect(loginUser(credentials)).rejects.toThrow('Invalid email or password');
  });
});