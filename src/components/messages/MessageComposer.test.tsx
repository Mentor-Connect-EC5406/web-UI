import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MessageComposer } from './MessageComposer';

function setup(onSend = vi.fn(() => Promise.resolve())) {
  render(<MessageComposer recipientName="Nimal" onSend={onSend} />);
  return { onSend, box: screen.getByLabelText('Message Nimal') as HTMLTextAreaElement, button: screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement };
}

describe('MessageComposer', () => {
  it('blocks sending an empty or blank message', () => {
    const { onSend, box, button } = setup();
    expect(button.disabled).toBe(true);
    fireEvent.change(box, { target: { value: '   ' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(button.disabled).toBe(true);
    expect(onSend).not.toHaveBeenCalled();
  });

  it('sends trimmed text on Enter, shows progress, then clears once sent', async () => {
    let resolve!: () => void;
    const { onSend, box } = setup(vi.fn(() => new Promise<void>((r) => { resolve = r; })));
    fireEvent.change(box, { target: { value: '  Hello there ' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('Hello there');
    expect(screen.getByRole('button', { name: 'Send message' }).getAttribute('aria-busy')).toBe('true');
    expect(box.value).toBe('  Hello there ');
    await act(async () => resolve());
    expect(box.value).toBe('');
  });

  it('keeps the draft and shows an error when sending fails', async () => {
    const { box } = setup(vi.fn(() => Promise.reject(new Error('down'))));
    fireEvent.change(box, { target: { value: 'Hi' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Send message' })); });
    expect(screen.getByRole('alert').textContent).toMatch(/could not be sent/);
    expect(box.value).toBe('Hi');
  });

  it('adds a new line with Shift and Enter instead of sending', () => {
    const { onSend, box } = setup();
    fireEvent.change(box, { target: { value: 'Line one' } });
    fireEvent.keyDown(box, { key: 'Enter', shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });
});
