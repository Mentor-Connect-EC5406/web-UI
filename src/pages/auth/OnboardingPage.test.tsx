import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { OnboardingDetails } from '@/types';
import { useSession } from '@/auth/session';
import OnboardingPage from './OnboardingPage';

const newAccount = { name: 'Kasun Fernando', firstName: 'Kasun', lastName: 'Fernando', email: 'kasun@example.com' };

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

// stands in for the register call, the store then holds the new user
const register = vi.fn(async (details: OnboardingDetails) => {
  useSession.setState({
    newAccount: null,
    user: { id: 'u1', name: `${details.firstName} ${details.lastName}`, email: newAccount.email, avatarUrl: null, role: details.role },
  });
});

describe('OnboardingPage', () => {
  beforeEach(() => {
    register.mockClear();
    useSession.setState({ user: null, newAccount: null, status: 'ready', completeOnboarding: register });
  });

  it('sends people without a new account to log in', () => {
    renderPage();
    expect(screen.getByText('Login page')).toBeTruthy();
  });

  it('offers only student and mentor', () => {
    useSession.setState({ newAccount });
    renderPage();
    expect(screen.getAllByRole('radio').map((r) => r.textContent)).toEqual([
      expect.stringContaining('student'),
      expect.stringContaining('mentor'),
    ]);
    expect(screen.queryByText(/admin/i)).toBeNull();
  });

  it('a mentor chooses a role, fills the details and lands on the mentor area', async () => {
    useSession.setState({ newAccount });
    renderPage();
    fireEvent.click(screen.getByRole('radio', { name: /i'm a mentor/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    fireEvent.change(screen.getByLabelText(/job title/i), { target: { value: 'Engineer' } });
    fireEvent.change(screen.getByLabelText(/organisation/i), { target: { value: 'WSO2' } });
    fireEvent.change(screen.getByLabelText(/years of experience/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/about you/i), { target: { value: 'I help students into tech.' } });
    fireEvent.click(screen.getByRole('button', { name: /set up my mentor profile/i }));
    expect(await screen.findByText('Mentor home')).toBeTruthy();
    expect(register).toHaveBeenCalledWith(expect.objectContaining({ role: 'MENTOR', title: 'Engineer', experienceYears: 5 }));
  });

  it('shows the failure and stays on the form', async () => {
    register.mockRejectedValueOnce(new Error('The server could not be reached.'));
    useSession.setState({ newAccount });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    fireEvent.change(screen.getByLabelText(/faculty/i), { target: { value: 'Computer Science' } });
    fireEvent.click(screen.getByRole('button', { name: /start finding mentors/i }));
    expect(await screen.findByText('The server could not be reached.')).toBeTruthy();
  });
});
