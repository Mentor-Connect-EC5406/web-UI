import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { StarRatingInput } from './StarRatingInput';

describe('StarRatingInput', () => {
  it('is a labelled group of five radios', () => {
    render(<StarRatingInput id="r" label="Your rating" value={0} onChange={() => {}} />);
    expect(screen.getByRole('group', { name: 'Your rating' })).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByText('Not rated')).toBeTruthy();
  });

  it('reports the chosen number of stars', () => {
    const onChange = vi.fn();
    render(<StarRatingInput id="r" label="Your rating" value={0} onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: /4 stars/ }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('marks the current value as checked and describes it in text', () => {
    render(<StarRatingInput id="r" label="Your rating" value={3} onChange={() => {}} />);
    expect((screen.getByRole('radio', { name: /3 stars/ }) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText('3 of 5 · Good')).toBeTruthy();
  });

  it('links the error message to the group', () => {
    render(<StarRatingInput id="r" label="Your rating" value={0} onChange={() => {}} error="Choose a rating" />);
    expect(screen.getByRole('group').getAttribute('aria-describedby')).toBe('r-error');
    expect(screen.getByText('Choose a rating')).toBeTruthy();
  });
});
