import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Role } from '@/types';
import { useSession } from '@/auth/session';
import { RequireRole } from './RequireRole';

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route path="/403" element={<p>Forbidden page</p>} />
        <Route path="/student" element={<RequireRole role="STUDENT" />}>
          <Route index element={<p>Student home</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

const signInAs = (role: Role) =>
  useSession.setState({ user: { id: 'u1', name: 'Kasun Fernando', email: 'kasun@example.com', avatarUrl: null, role } });

describe('RequireRole', () => {
  beforeEach(() => useSession.setState({ user: null, newAccount: null, status: 'ready' }));

  it('waits while the account is being checked', () => {
    useSession.setState({ status: 'loading' });
    renderAt('/student');
    expect(screen.getByText(/checking your account/i)).toBeTruthy();
  });

  it('sends signed-out visitors to the login page', () => {
    renderAt('/student');
    expect(screen.getByText('Login page')).toBeTruthy();
  });

  it('blocks users with a different role', () => {
    signInAs('MENTOR');
    renderAt('/student');
    expect(screen.getByText('Forbidden page')).toBeTruthy();
  });

  it('lets the right role in', () => {
    signInAs('STUDENT');
    renderAt('/student');
    expect(screen.getByText('Student home')).toBeTruthy();
  });
});
