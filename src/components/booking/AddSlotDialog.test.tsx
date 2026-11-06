import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Slot } from '@/types';
import { AddSlotDialog } from './AddSlotDialog';

const now = new Date('2026-11-01T09:00');
const at = (time: string) => new Date(`2026-11-10T${time}`).toISOString();
const existing: Slot[] = [{ id: 's1', startsAt: at('10:00'), endsAt: at('11:00'), status: 'BOOKED' }];

function setup() {
  const onSave = vi.fn();
  render(<AddSlotDialog open existing={existing} saving={false} onClose={() => {}} onSave={onSave} now={now} />);
  const fill = (date: string, from: string, to: string) => {
    fireEvent.change(screen.getByLabelText(/^Date/), { target: { value: date } });
    fireEvent.change(screen.getByLabelText(/^From/), { target: { value: from } });
    fireEvent.change(screen.getByLabelText(/^To/), { target: { value: to } });
  };
  const save = () => fireEvent.click(screen.getByRole('button', { name: /^Add/ }));
  return { onSave, fill, save };
}

describe('AddSlotDialog', () => {
  it('shows required errors when nothing is chosen', () => {
    const { onSave, save } = setup();
    save();
    expect(screen.getByText('Choose a date.')).toBeTruthy();
    expect(screen.getByText('Choose a start time.')).toBeTruthy();
    expect(screen.getByText('Choose an end time.')).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('rejects a past time inline', () => {
    const { onSave, fill, save } = setup();
    fill('2026-11-01', '08:00', '09:00');
    save();
    expect(screen.getByText(/already passed/)).toBeTruthy();
    expect(screen.getByLabelText(/^From/).getAttribute('aria-invalid')).toBe('true');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('previews and saves a range split into sessions, skipping a taken time', () => {
    const { onSave, fill, save } = setup();
    fill('2026-11-10', '09:00', '12:00');
    expect(screen.getByRole('status').textContent).toMatch(/Creates 2 1 hour slots.*1 already taken/);
    save();
    expect(onSave).toHaveBeenCalledWith([
      { startsAt: at('09:00'), endsAt: at('10:00') },
      { startsAt: at('11:00'), endsAt: at('12:00') },
    ]);
  });
});
