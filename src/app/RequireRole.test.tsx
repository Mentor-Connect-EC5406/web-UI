import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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

describe('RequireRole', () => {
  beforeEach(() => useSession.getState().signOut());

  it('sends signed-out visitors to the login page', () => {
    renderAt('/student');
    expect(screen.getByText('Login page')).toBeTruthy();
  });

  it('blocks users with a different role', () => {
    useSession.getState().signInAs('MENTOR');
    renderAt('/student');
    expect(screen.getByText('Forbidden page')).toBeTruthy();
  });

  it('lets the right role in', () => {
    useSession.getState().signInAs('STUDENT');
    renderAt('/student');
    expect(screen.getByText('Student home')).toBeTruthy();
  });
});
