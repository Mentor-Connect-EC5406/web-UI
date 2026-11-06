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

const slot: Slot = { id: 's1', startsAt: '2026-12-01T04:30:00.000Z', endsAt: '2026-12-01T05:30:00.000Z', status: 'AVAILABLE' };

describe('BookingPanel', () => {
  it('says when the mentor has no free times', () => {
    render(<BookingPanel mentor={mentor} slots={[]} onBook={vi.fn()} />);
    expect(screen.getByText(/no free times right now/i)).toBeTruthy();
  });

  it('replaces the book button for people who cannot book', () => {
    render(<BookingPanel mentor={mentor} slots={[slot]} onBook={vi.fn()} blocked={<p>Only students can book sessions.</p>} />);
    expect(screen.getByText('Only students can book sessions.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /select a time slot|review booking/i })).toBeNull();
  });

  it('shows why the server refused the booking', async () => {
    const onBook = vi.fn().mockRejectedValue(new Error('Slot is not available'));
    render(<BookingPanel mentor={mentor} slots={[slot]} onBook={onBook} />);
    fireEvent.click(screen.getByRole('button', { pressed: false }));
    fireEvent.click(screen.getByRole('button', { name: /review booking/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }));
    expect(await screen.findByText(/Slot is not available/)).toBeTruthy();
    expect(onBook).toHaveBeenCalledWith(slot);
  });
});
