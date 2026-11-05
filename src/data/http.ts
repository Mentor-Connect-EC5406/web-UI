import { API_BASE_URL } from '@/config/env';

export interface FieldError {
  field: string;
  message: string;
}

// thrown for every failed request, the message is shown to the user as is
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldError[];

  constructor(message: string, status: number, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export const isApiError = (error: unknown, status?: number): error is ApiError =>
  error instanceof ApiError && (status === undefined || error.status === status);

type TokenProvider = () => Promise<string | null>;

let getToken: TokenProvider = async () => null;

// the auth layer registers how to get the current access token
export function setAccessTokenProvider(provider: TokenProvider) {
  getToken = provider;
}

type QueryValue = string | number | boolean | null | undefined | readonly (string | number)[];

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
}

export function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(query ?? {})) {
    // empty values mean any, so they are left out
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, String(v)));
    else url.searchParams.set(key, String(value));
  }
  return url.toString();
}

const FALLBACK_MESSAGES: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have access to this.',
  404: 'We could not find what you were looking for.',
  409: 'This was changed by someone else. Refresh and try again.',
};

// "experience.0.startMonth" + "must be YYYY-MM" reads as "Start month must be YYYY-MM"
export function describeFieldError({ field, message }: FieldError) {
  const name = field.split('.').filter((part) => !/^\d+$/.test(part)).pop() ?? '';
  const words = name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words ? `${words[0].toUpperCase()}${words.slice(1)} ${message}` : message;
}

async function toError(response: Response) {
  let body: { message?: string; fieldErrors?: FieldError[] } = {};
  try {
    body = await response.json();
  } catch {
    // some errors come back without a json body
  }
  const fieldErrors = body.fieldErrors ?? [];
  // validation errors say "Validation failed", the first field message is more useful
  const message =
    (fieldErrors.length > 0 ? describeFieldError(fieldErrors[0]) : body.message) ||
    FALLBACK_MESSAGES[response.status] ||
    'Something went wrong on the server. Please try again.';
  return new ApiError(message, response.status, fieldErrors);
}

export async function api<T>(path: string, { method = 'GET', body, query }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = await getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError('The server could not be reached. Check your connection and try again.', 0);
  }

  if (!response.ok) throw await toError(response);
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// uploads go straight to storage with a short lived signed url, no token is sent
export async function uploadToSignedUrl(uploadUrl: string, file: Blob) {
  let response: Response;
  try {
    response = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
  } catch {
    throw new ApiError('The file could not be uploaded. Check your connection and try again.', 0);
  }
  if (!response.ok) throw new ApiError('The file could not be uploaded. Please try again.', response.status);
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// screens filter and page on the client, so lists ask for the largest page the api allows
const MAX_PAGE_SIZE = 100;

export const listAll = <T>(path: string, query: Record<string, QueryValue> = {}) =>
  api<Page<T>>(path, { query: { size: MAX_PAGE_SIZE, ...query } }).then((p) => p.content);

export interface UploadTarget {
  uploadUrl: string;
  key: string;
  expiresInSeconds: number;
}

// asks the api where to put the file, uploads it and returns the storage key to save
export async function uploadFile(uploadUrlPath: string, file: Blob) {
  const target = await api<UploadTarget>(uploadUrlPath, { method: 'POST', body: { contentType: file.type } });
  await uploadToSignedUrl(target.uploadUrl, file);
  return target.key;
}
