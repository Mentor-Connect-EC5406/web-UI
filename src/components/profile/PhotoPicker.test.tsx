import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PhotoPicker } from './PhotoPicker';

const choose = (file: File) => fireEvent.change(screen.getByLabelText('Profile photo'), { target: { files: [file] } });

describe('PhotoPicker', () => {
  it('rejects a file that is too large without changing the photo', () => {
    const onChange = vi.fn();
    render(<PhotoPicker name="Ashan Perera" value={null} onChange={onChange} />);
    choose(new File([new Uint8Array(3 * 1024 * 1024)], 'big.png', { type: 'image/png' }));
    expect(screen.getByRole('alert').textContent).toMatch(/under 2 MB/);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reads a valid image as a data url', async () => {
    const onChange = vi.fn();
    render(<PhotoPicker name="Ashan Perera" value={null} onChange={onChange} />);
    choose(new File(['img'], 'me.png', { type: 'image/png' }));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^data:image\/png/)));
  });

  it('removes the current photo', () => {
    const onChange = vi.fn();
    render(<PhotoPicker name="Ashan Perera" value="data:image/png;base64,AA" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
