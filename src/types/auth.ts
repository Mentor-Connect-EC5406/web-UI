// User Profile Interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'mentor';
  createdAt?: string;
}

// Login Request Payload Interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register Request Payload Interface
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// API Authentication Response Interface
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}