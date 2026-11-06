import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Mentor, Slot } from '@/types';
import { emptyExtras } from '@/lib/profile';
import { BookingPanel } from './BookingPanel';

const mentor: Mentor = {
  ...emptyExtras(),
  id: 'm1',
  name: 'Nimal Silva',
  title: 'Engineer',
  organization: 'WSO2',
  industry: '',
  avatarUrl: null,
  bio: '',
  skills: [],
  experienceYears: 5,
  hourlyRate: 0,
  rating: 0,
  reviewCount: 0,
  isVerified: true,
};

const now = new Date('2026-11-20T09:00:00Z');
const slot: Slot = { id: 's1', startsAt: '2026-12-01T04:30:00.000Z', endsAt: '2026-12-01T05:30:00.000Z', status: 'AVAILABLE' };

describe('BookingPanel', () => {
  it('says when the mentor has no free times', () => {
    render(<BookingPanel mentor={mentor} slots={[]} onBook={vi.fn()} now={now} />);
    expect(screen.getByText(/no free times right now/i)).toBeTruthy();
  });

  it('replaces the book button for people who cannot book', () => {
    render(<BookingPanel mentor={mentor} slots={[slot]} onBook={vi.fn()} blocked={<p>Only students can book sessions.</p>} />);
    expect(screen.getByText('Only students can book sessions.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /select a time slot|review booking/i })).toBeNull();
  });

  it('shows why the server refused the booking', async () => {
    const onBook = vi.fn().mockRejectedValue(new Error('Slot is not available'));
    render(<BookingPanel mentor={mentor} slots={[slot]} onBook={onBook} now={now} />);
    fireEvent.click(screen.getByRole('group', { name: 'Choose a time' }).querySelector('button')!);
    fireEvent.click(screen.getByRole('button', { name: /review booking/i }));
    fireEvent.change(screen.getByLabelText(/what would you like to discuss/i), { target: { value: 'CV review' } });
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));
    expect(await screen.findByText(/Slot is not available/)).toBeTruthy();
    expect(onBook).toHaveBeenCalledWith(slot, 'CV review');
  });

  it('opens with the time a mentor invited the student to', () => {
    render(<BookingPanel mentor={mentor} slots={[slot]} onBook={vi.fn()} invitedSlotId="s1" now={now} />);
    expect(screen.getByText(/invited you to the time selected below/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /review booking/i })).toBeTruthy();
  });

  it('says when the invited time is gone', () => {
    render(<BookingPanel mentor={mentor} slots={[{ ...slot, status: 'BOOKED' }]} onBook={vi.fn()} invitedSlotId="s1" now={now} />);
    expect(screen.getByText(/no longer free/)).toBeTruthy();
  });
});
