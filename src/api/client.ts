import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

type ApiClient = Omit<AxiosInstance, 'get' | 'post' | 'put' | 'patch' | 'delete'> & {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
};

// Create an Axios instance with base URL and default headers
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as ApiClient;

// Request Interceptor: Attach Auth Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Enhanced Global Error Handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;

    // Handle different HTTP error statuses globally
    switch (status) {
      case 401:
        // Unauthorized: Clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        break;
      case 403:
        console.error('Forbidden: You do not have permission to access this resource.');
        break;
      case 404:
        console.error('Not Found: The requested resource could not be found.');
        break;
      case 500:
        console.error('Internal Server Error: Please try again later.');
        break;
      default:
        if (!error.response) {
          console.error('Network Error: Please check your internet connection.');
        }
        break;
    }

    return Promise.reject(error);
  }
);