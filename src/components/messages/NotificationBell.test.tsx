import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { AppNotification, ConversationSummary } from '@/types';
import { NotificationBell } from './NotificationBell';

const conversations: ConversationSummary[] = [
  {
    id: 'c1',
    with: { id: 'mentor-1', name: 'Nimal Silva', role: 'MENTOR', avatarUrl: null },
    lastMessage: { id: 'm1', senderId: 'mentor-1', text: 'See you Monday', sentAt: '2026-10-27T18:45:00+05:30' },
    unreadCount: 2,
  },
];

const notifications: AppNotification[] = [
  { id: 'n1', type: 'BOOKING_CONFIRMED', topic: 'session', title: 'Booking confirmed', message: 'Nimal accepted your request', createdAt: '2026-10-28T08:00:00Z', read: false },
  { id: 'n2', type: 'SYSTEM', topic: 'other', title: 'Welcome', message: 'Glad you are here', createdAt: '2026-10-20T08:00:00Z', read: true },
];

function setup({ updates = notifications, unreadMessages = 2 } = {}) {
  const onOpenNotification = vi.fn();
  const onMarkAllRead = vi.fn();
  render(
    <MemoryRouter>
      <NotificationBell
        notifications={updates}
        conversations={conversations}
        unreadMessages={unreadMessages}
        currentUserId="student-1"
        notificationHref={(n) => (n.topic === 'session' ? '/student/sessions' : null)}
        conversationHref={(id) => `/inbox?c=${id}`}
        allMessagesHref="/inbox"
        onOpenNotification={onOpenNotification}
        onMarkAllRead={onMarkAllRead}
      />
    </MemoryRouter>,
  );
  return { onOpenNotification, onMarkAllRead };
}

describe('NotificationBell', () => {
  it('counts unread updates and messages together', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Notifications, 3 unread' })).toBeTruthy();
  });

  it('links an update to its page and marks it read', () => {
    const { onOpenNotification, onMarkAllRead } = setup();
    fireEvent.click(screen.getByRole('button', { name: /Notifications/ }));
    const link = screen.getByRole('link', { name: /Booking confirmed/ });
    expect(link.getAttribute('href')).toBe('/student/sessions');
    fireEvent.click(link);
    expect(onOpenNotification).toHaveBeenCalledWith(expect.objectContaining({ id: 'n1' }));
    fireEvent.click(screen.getByRole('button', { name: /Notifications/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Mark all as read' }));
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it('opens on messages when only messages are unread', () => {
    setup({ updates: [notifications[1]] });
    fireEvent.click(screen.getByRole('button', { name: 'Notifications, 2 unread' }));
    expect(screen.getByRole('link', { name: /Nimal Silva/ }).getAttribute('href')).toBe('/inbox?c=c1');
    expect(screen.getByText('2 new')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'See all messages' }).getAttribute('href')).toBe('/inbox');
  });

  it('closes on Escape', () => {
    setup({ updates: [], unreadMessages: 0 });
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
