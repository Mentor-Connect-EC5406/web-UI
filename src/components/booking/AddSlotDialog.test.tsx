import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Slot } from '@/types';
import { AddSlotDialog } from './AddSlotDialog';

const now = new Date('2026-11-01T09:00');
const existing: Slot[] = [
  { id: 's1', startsAt: new Date('2026-11-10T10:00').toISOString(), endsAt: new Date('2026-11-10T11:00').toISOString(), status: 'BOOKED' },
];

function setup() {
  const onSave = vi.fn();
  render(<AddSlotDialog open existing={existing} saving={false} onClose={() => {}} onSave={onSave} now={now} />);
  const fill = (date: string, time: string) => {
    fireEvent.change(screen.getByLabelText(/^Date/), { target: { value: date } });
    fireEvent.change(screen.getByLabelText(/^Start time/), { target: { value: time } });
    fireEvent.click(screen.getByRole('button', { name: 'Add slot' }));
  };
  return { onSave, fill };
}

describe('AddSlotDialog', () => {
  it('shows required errors when nothing is chosen', () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Add slot' }));
    expect(screen.getByText('Choose a date.')).toBeTruthy();
    expect(screen.getByText('Choose a start time.')).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('rejects a past time inline', () => {
    const { onSave, fill } = setup();
    fill('2026-11-01', '08:00');
    expect(screen.getByText(/already passed/)).toBeTruthy();
    expect(screen.getByLabelText(/^Start time/).getAttribute('aria-invalid')).toBe('true');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('rejects an overlapping time inline', () => {
    const { onSave, fill } = setup();
    fill('2026-11-10', '10:30');
    expect(screen.getByText(/overlaps one of your existing slots/)).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves a free future slot', () => {
    const { onSave, fill } = setup();
    fill('2026-11-10', '14:00');
    expect(onSave).toHaveBeenCalledWith({
      startsAt: new Date('2026-11-10T14:00').toISOString(),
      endsAt: new Date('2026-11-10T15:00').toISOString(),
    });
  });
});
