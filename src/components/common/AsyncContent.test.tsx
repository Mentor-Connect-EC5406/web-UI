import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AsyncContent } from './AsyncContent';

const query = <T,>(overrides: Partial<{ data: T; isPending: boolean; error: Error | null }>) => ({
  data: undefined as T | undefined,
  isPending: false,
  error: null,
  refetch: vi.fn(),
  ...overrides,
});

describe('AsyncContent', () => {
  it('shows the loading fallback while pending', () => {
    render(<AsyncContent query={query<string>({ isPending: true })} loading={<p>Loading mentors</p>}>{(d) => d}</AsyncContent>);
    expect(screen.getByText('Loading mentors')).toBeTruthy();
  });

  it('shows the error with a working retry button', () => {
    const q = query<string>({ error: new Error('Server down') });
    render(<AsyncContent query={q}>{(d) => d}</AsyncContent>);
    expect(screen.getByText('Server down')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(q.refetch).toHaveBeenCalledOnce();
  });

  it('renders children with the data once loaded', () => {
    render(<AsyncContent query={query({ data: ['a', 'b'] })}>{(list) => <p>{list.length} items</p>}</AsyncContent>);
    expect(screen.getByText('2 items')).toBeTruthy();
  });
});
