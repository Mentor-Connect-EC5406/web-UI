import { http, HttpResponse } from 'msw';

interface LoginRequestBody {
  email?: string;
  password?: string;
}

/**
 * MSW Request Handlers for Mocking API Responses
 */
export const handlers = [
  // Mock POST /auth/login endpoint
  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequestBody;
    
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        accessToken: 'mock-access-token-12345',
        refreshToken: 'mock-refresh-token-67890',
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      });
    }

    return HttpResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }),

  // Mock GET /users/profile endpoint
  http.get('/api/v1/users/profile', () => {
    return HttpResponse.json({
      id: '1',
      name: 'Tharukara Chalindu',
      email: 'chalindu@example.com',
      role: 'Computer Engineering Undergraduate',
    });
  }),
];