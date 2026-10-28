import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { STUDENT_PROFILE } from '@/mocks/users';
import { StudentProfileForm } from './StudentProfileForm';

function setup(onSave = vi.fn().mockResolvedValue(undefined)) {
  render(<StudentProfileForm profile={STUDENT_PROFILE} avatarUrl={null} saving={false} onSave={onSave} />);
  return onSave;
}

const saveButton = () => screen.getByRole('button', { name: /save changes/i }) as HTMLButtonElement;

describe('StudentProfileForm', () => {
  it('only enables saving once something changes', () => {
    setup();
    expect(saveButton().disabled).toBe(true);
    fireEvent.change(screen.getByLabelText(/degree/i), { target: { value: 'BSc IT' } });
    expect(saveButton().disabled).toBe(false);
  });

  it('shows errors and does not save an invalid form', () => {
    const onSave = setup();
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: '' } });
    fireEvent.click(saveButton());
    expect(screen.getByText('Enter your first name')).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves the edits and confirms only after the save resolves', async () => {
    const onSave = setup();
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '+94 77 123 4567' } });
    fireEvent.click(screen.getByRole('button', { name: /data science/i }));
    fireEvent.click(saveButton());
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '+94 77 123 4567', interests: [...STUDENT_PROFILE.interests, 'Data Science & AI'] }),
    );
    expect(await screen.findByText('Changes saved')).toBeTruthy();
    expect(saveButton().disabled).toBe(true);
  });

  it('tells the user when saving fails', async () => {
    setup(vi.fn().mockRejectedValue(new Error('offline')));
    fireEvent.change(screen.getByLabelText(/degree/i), { target: { value: 'BSc IT' } });
    fireEvent.click(saveButton());
    expect(await screen.findByText(/could not be saved/i)).toBeTruthy();
  });

  it('discard puts the saved values back', () => {
    setup();
    const degree = screen.getByLabelText(/degree/i) as HTMLInputElement;
    fireEvent.change(degree, { target: { value: 'BSc IT' } });
    fireEvent.click(screen.getByRole('button', { name: /discard/i }));
    expect(degree.value).toBe(STUDENT_PROFILE.degree);
  });
});
