import { describe, expect, it } from 'vitest';
import { notificationHref, notificationTopic } from './notifications';

describe('notifications', () => {
  it('reads the topic from the api type', () => {
    expect(notificationTopic('BOOKING_CONFIRMED')).toBe('session');
    expect(notificationTopic('MENTORSHIP_REQUESTED')).toBe('mentorship');
    expect(notificationTopic('SOMETHING_NEW')).toBe('other');
  });

  it('links each topic to the page for the role', () => {
    expect(notificationHref('session', 'STUDENT')).toBe('/student/sessions');
    expect(notificationHref('session', 'MENTOR')).toBe('/mentor/sessions');
    expect(notificationHref('verification', 'MENTOR')).toBe('/mentor');
    expect(notificationHref('verification', 'STUDENT')).toBeNull();
    expect(notificationHref('other', 'STUDENT')).toBeNull();
  });
});
