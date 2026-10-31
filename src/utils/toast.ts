import toast from 'react-hot-toast';

/**
 * Toast Notification Helper Functions
 * Provides clean wrapper methods for success, error, and loading toast alerts.
 */

export const showSuccessToast = (message: string): string => {
  return toast.success(message, {
    duration: 4000,
    position: 'top-right',
  });
};

export const showErrorToast = (message: string): string => {
  return toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};

export const showLoadingToast = (message: string): string => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const dismissToast = (toastId: string): void => {
  toast.dismiss(toastId);
};