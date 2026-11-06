import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './Combobox';

const suggestions = ['University of Colombo', 'University of Moratuwa', 'SLIIT'];

describe('Combobox', () => {
  it('filters suggestions as the user types and picks one with the keyboard', async () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="University" suggestions={suggestions} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');

    await userEvent.type(input, 'mora');
    expect(screen.getAllByRole('option')).toHaveLength(1);

    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect((input as HTMLInputElement).value).toBe('University of Moratuwa');
    expect(onValueChange).toHaveBeenLastCalledWith('University of Moratuwa');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('keeps a value that is not in the list', async () => {
    render(<Combobox aria-label="University" name="university" suggestions={suggestions} />);
    await userEvent.type(screen.getByRole('combobox'), 'My Campus');
    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('My Campus');
    expect(screen.queryByRole('option')).toBeNull();
  });

  it('picks a suggestion with the mouse', async () => {
    render(<Combobox aria-label="University" suggestions={suggestions} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'SLIIT' }));
    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('SLIIT');
  });
});
