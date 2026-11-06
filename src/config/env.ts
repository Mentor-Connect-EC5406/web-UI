// settings from the .env files, see .env.example
const env = import.meta.env;

export const API_BASE_URL = (env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

export const ASGARDEO = {
  baseUrl: env.VITE_ASGARDEO_BASE_URL ?? '',
  clientId: env.VITE_ASGARDEO_CLIENT_ID ?? '',
};

// avatars and other public files are served by the api
export const fileUrl = (key: string | null | undefined) => (key ? `${API_BASE_URL}/api/files/${key}` : null);
