import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useSession } from '@/auth/session';
import OnboardingPage from './OnboardingPage';

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/onboarding']}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<p>Login page</p>} />
        <Route path="/mentor" element={<p>Mentor home</p>} />
        <Route path="/student" element={<p>Student home</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('OnboardingPage', () => {
  beforeEach(() => useSession.getState().signOut());

  it('sends people without a new account to log in', () => {
    renderPage();
    expect(screen.getByText('Login page')).toBeTruthy();
  });

  it('offers only student and mentor', () => {
    useSession.getState().signUp();
    renderPage();
    expect(screen.getAllByRole('radio').map((r) => r.textContent)).toEqual([
      expect.stringContaining('student'),
      expect.stringContaining('mentor'),
    ]);
    expect(screen.queryByText(/admin/i)).toBeNull();
  });

  it('a mentor chooses a role, fills the details and lands on the mentor area', () => {
    useSession.getState().signUp();
    renderPage();
    fireEvent.click(screen.getByRole('radio', { name: /i'm a mentor/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    fireEvent.change(screen.getByLabelText(/job title/i), { target: { value: 'Engineer' } });
    fireEvent.change(screen.getByLabelText(/organisation/i), { target: { value: 'WSO2' } });
    fireEvent.change(screen.getByLabelText(/years of experience/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /set up my mentor profile/i }));
    expect(screen.getByText('Mentor home')).toBeTruthy();
    expect(useSession.getState().user?.role).toBe('MENTOR');
  });
});
