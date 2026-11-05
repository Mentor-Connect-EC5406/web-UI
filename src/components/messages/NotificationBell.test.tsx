import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ConversationSummary } from '@/types';
import { NotificationBell } from './NotificationBell';

const conversations: ConversationSummary[] = [
  {
    id: 'c1',
    with: { id: 'mentor-1', name: 'Nimal Silva', role: 'MENTOR', avatarUrl: null },
    lastMessage: { id: 'm1', senderId: 'mentor-1', text: 'See you Monday', sentAt: '2026-10-27T18:45:00+05:30' },
    unreadCount: 2,
  },
];

function setup(unread = 2) {
  render(
    <MemoryRouter>
      <NotificationBell conversations={conversations} unread={unread} currentUserId="student-1" conversationHref={(id) => `/inbox?c=${id}`} allHref="/inbox" />
    </MemoryRouter>,
  );
}

describe('NotificationBell', () => {
  it('announces the unread count and opens a panel linking to the conversation', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Notifications, 2 unread' }));
    expect(screen.getByRole('link', { name: /Nimal Silva/ }).getAttribute('href')).toBe('/inbox?c=c1');
    expect(screen.getByText('2 new')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'See all messages' }).getAttribute('href')).toBe('/inbox');
  });

  it('closes on Escape', () => {
    setup(0);
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
