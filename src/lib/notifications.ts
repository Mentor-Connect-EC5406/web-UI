import type { NotificationTopic, Role } from '@/types';
import { isFeatureOn } from '@/config/features';
import { paths } from '@/app/paths';

// the api type prefix tells what a notification is about, e.g. BOOKING_CONFIRMED
const TOPIC_BY_PREFIX: [string, NotificationTopic][] = [
  ['BOOKING_', 'session'],
  ['SESSION_', 'session'],
  ['MENTORSHIP_', 'mentorship'],
  ['VERIFICATION_', 'verification'],
  ['MESSAGE_', 'message'],
];

export const notificationTopic = (type: string): NotificationTopic =>
  TOPIC_BY_PREFIX.find(([prefix]) => type.startsWith(prefix))?.[1] ?? 'other';

// where clicking a notification leads, null when it has no page
export function notificationHref(topic: NotificationTopic, role: Role): string | null {
  if (role === 'ADMIN') return null;
  const area = role === 'STUDENT' ? paths.student : paths.mentorArea;
  switch (topic) {
    case 'session':
      return area.sessions;
    case 'mentorship':
      return isFeatureOn('mentorships') ? area.mentorships : area.sessions;
    case 'message':
      return area.messages;
    case 'verification':
      return role === 'MENTOR' ? paths.mentorArea.home : null;
    default:
      return null;
  }
}
