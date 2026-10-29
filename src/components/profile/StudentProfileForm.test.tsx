import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { STUDENT_PROFILE } from '@/mocks/users';
import { StudentProfileForm } from './StudentProfileForm';

function setup(onSave = vi.fn().mockResolvedValue(undefined)) {
  render(
    <MemoryRouter>
      <StudentProfileForm profile={STUDENT_PROFILE} previewPath="/student/profile/preview" saving={false} onSave={onSave} />
    </MemoryRouter>,
  );
  return onSave;
}

const saveButton = () => screen.getByRole('button', { name: /save changes/i }) as HTMLButtonElement;
const experience = () => document.getElementById('experience')!;

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
    fireEvent.change(screen.getByLabelText(/linkedin/i), { target: { value: 'linkedin.com/in/me' } });
    fireEvent.click(saveButton());
    expect(screen.getByText('Enter your first name')).toBeTruthy();
    expect(screen.getByText(/full link starting with https/i)).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves the edits and confirms only after the save resolves', async () => {
    const onSave = setup();
    fireEvent.change(screen.getByLabelText(/^phone/i), { target: { value: '+94 77 123 4567' } });
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

  it('edits an experience in a dialog without saving the whole profile', () => {
    const onSave = setup();
    fireEvent.click(within(experience()).getByRole('button', { name: 'Edit experience' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/role/i), { target: { value: '' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Done' }));
    expect(within(dialog).getByText('Enter your role')).toBeTruthy();

    fireEvent.change(within(dialog).getByLabelText(/role/i), { target: { value: 'Frontend Intern' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(within(experience()).getByText('Frontend Intern')).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
    expect(saveButton().disabled).toBe(false);
  });

  it('removes an entry and discard brings it back', () => {
    setup();
    fireEvent.click(within(experience()).getByRole('button', { name: 'Remove experience' }));
    expect(within(experience()).queryByText('Software Engineering Intern')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /discard/i }));
    expect(within(experience()).getByText('Software Engineering Intern')).toBeTruthy();
  });

  it('adds a language with its level guarded against duplicates', () => {
    setup();
    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'sinhala' } });
    fireEvent.click(within(document.getElementById('languages')!).getByRole('button', { name: 'Add' }));
    expect(screen.getByText(/enter a language and choose your level/i)).toBeTruthy();
  });

  it('lists what is missing and toggles open to opportunities', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Add a photo' })).toBeTruthy();
    const toggle = screen.getByRole('switch', { name: /open to opportunities/i });
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-checked')).toBe('false');
  });
});
