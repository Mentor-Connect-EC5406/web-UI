import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useSession } from './session';
import { useAuthRedirect } from './useAuthRedirect';

function Buttons() {
  const { logIn, signUp } = useAuthRedirect();
  return (
    <>
      <button onClick={logIn}>Log in</button>
      <button onClick={() => signUp('MENTOR')}>Become a mentor</button>
    </>
  );
}

function renderButtons() {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Buttons />} />
        <Route path="/mentor" element={<p>Mentor home</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('useAuthRedirect', () => {
  const signIn = vi.fn();
  const signUp = vi.fn();

  beforeEach(() => {
    signIn.mockClear();
    signUp.mockClear();
    useSession.setState({ user: null, signIn, signUp });
  });

  it('sends signed out visitors straight to asgardeo', () => {
    renderButtons();
    fireEvent.click(screen.getByText('Log in'));
    fireEvent.click(screen.getByText('Become a mentor'));
    expect(signIn).toHaveBeenCalledOnce();
    expect(signUp).toHaveBeenCalledWith('MENTOR');
  });

  it('opens the dashboard for someone already signed in', () => {
    useSession.setState({ user: { id: 'u1', name: 'Nimal Silva', email: 'nimal@example.com', avatarUrl: null, role: 'MENTOR' } });
    renderButtons();
    fireEvent.click(screen.getByText('Log in'));
    expect(screen.getByText('Mentor home')).toBeTruthy();
    expect(signIn).not.toHaveBeenCalled();
  });
});
