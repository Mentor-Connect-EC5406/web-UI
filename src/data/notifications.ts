import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppNotification } from '@/types';
import { NOTIFICATION_PAGE_SIZE, NOTIFICATION_POLL_MS } from '@/config/constants';
import { notificationTopic } from '@/lib/notifications';
import { api, type Page } from './http';
import { keys } from './keys';

interface NotificationResponse {
  id: string;
  type: string;
  title: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'READ';
  createdAt: string;
  readAt: string | null;
}

const toNotification = (n: NotificationResponse): AppNotification => ({
  id: n.id,
  type: n.type,
  topic: notificationTopic(n.type),
  title: n.title,
  message: n.message,
  createdAt: n.createdAt,
  read: n.status === 'READ' || n.readAt !== null,
});

export const notificationsApi = {
  // newest first
  recent: () =>
    api<Page<NotificationResponse>>('/api/notifications', { query: { size: NOTIFICATION_PAGE_SIZE } }).then((page) =>
      page.content.map(toNotification).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    ),
  markRead: (id: string) => api<unknown>(`/api/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => api<void>('/api/notifications/read-all', { method: 'PUT' }),
};

export const useNotifications = (enabled = true) =>
  useQuery({ queryKey: keys.notifications, queryFn: notificationsApi.recent, enabled, refetchInterval: NOTIFICATION_POLL_MS });

function useNotificationMutation<T>(mutationFn: (input: T) => Promise<unknown>) {
  const client = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => client.invalidateQueries({ queryKey: keys.notifications }) });
}

export const useMarkNotificationRead = () => useNotificationMutation(notificationsApi.markRead);
export const useMarkAllNotificationsRead = () => useNotificationMutation(notificationsApi.markAllRead);
