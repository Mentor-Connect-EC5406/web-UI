// what a notification is about decides where clicking it leads
export type NotificationTopic = 'session' | 'mentorship' | 'verification' | 'message' | 'other';

export interface AppNotification {
  id: string;
  // api type such as BOOKING_CONFIRMED
  type: string;
  topic: NotificationTopic;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}
