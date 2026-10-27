import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Link } from 'react-router-dom';
import { Button } from './Button';

describe('Button', () => {
  it('is disabled and marked busy while loading', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('renders a link with button styles when asChild is used', () => {
    render(
      <MemoryRouter>
        <Button asChild><Link to="/mentors">Find a mentor</Link></Button>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: 'Find a mentor' });
    expect(link.getAttribute('href')).toBe('/mentors');
    expect(link.className).toContain('bg-brand');
  });
});
