type ApiErrorPayload = {
  message?: string;
};

type ApiErrorLike = {
  response?: {
    data?: ApiErrorPayload;
  };
};

const isApiErrorLike = (error: unknown): error is ApiErrorLike => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isApiErrorLike(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};
