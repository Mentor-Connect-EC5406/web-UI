import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TagInput } from './TagInput';

function setup(value: string[], max?: number) {
  const onChange = vi.fn();
  render(<TagInput id="skills" value={value} onChange={onChange} max={max} />);
  return { onChange, input: screen.getByRole('textbox') };
}

describe('TagInput', () => {
  it('adds a trimmed tag on Enter', () => {
    const { onChange, input } = setup(['React']);
    fireEvent.change(input, { target: { value: '  Node.js ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['React', 'Node.js']);
  });

  it('ignores a tag that is already there in any case', () => {
    const { onChange, input } = setup(['React']);
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes a tag with its remove button', () => {
    const { onChange } = setup(['React', 'AWS']);
    fireEvent.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(onChange).toHaveBeenCalledWith(['AWS']);
  });

  it('stops accepting tags at the limit', () => {
    const { input } = setup(['React', 'AWS'], 2);
    expect((input as HTMLInputElement).disabled).toBe(true);
  });
});
