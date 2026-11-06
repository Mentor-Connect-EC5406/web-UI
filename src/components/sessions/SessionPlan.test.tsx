import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { SessionTask } from '@/types';
import { SessionPlan } from './SessionPlan';

const task = (patch: Partial<SessionTask>): SessionTask => ({
  id: 't1', sessionId: 'b1', type: 'HOMEWORK', title: 'Update CV', details: '', dueDate: null, done: false,
  createdBy: 'MENTOR', createdByName: 'Nimal Silva', updatedAt: '2026-11-01T00:00:00Z', ...patch,
});

function setup(tasks: SessionTask[], editable = true) {
  const handlers = { onAdd: vi.fn(), onEdit: vi.fn(), onToggle: vi.fn(), onDelete: vi.fn() };
  render(<SessionPlan tasks={tasks} viewerRole="STUDENT" editable={editable} {...handlers} />);
  return handlers;
}

describe('SessionPlan', () => {
  it('lets either side tick an item but only the author edit it', () => {
    const handlers = setup([task({}), task({ id: 't2', type: 'GOAL', title: 'Land an internship', createdBy: 'STUDENT', createdByName: 'Kasun' })]);
    fireEvent.click(screen.getByRole('checkbox', { name: /Update CV/ }));
    expect(handlers.onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: 't1' }));
    expect(screen.queryByRole('button', { name: 'Edit "Update CV"' })).toBeNull();
    expect(screen.getByText('Added by Nimal Silva')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Edit "Land an internship"' }));
    expect(handlers.onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 't2' }));
  });

  it('adds by type and hides changes once the session cannot change', () => {
    const handlers = setup([]);
    fireEvent.click(screen.getByRole('button', { name: 'Add target' }));
    expect(handlers.onAdd).toHaveBeenCalledWith('TARGET');
  });

  it('is read only when not editable', () => {
    setup([task({})], false);
    expect(screen.queryByRole('button', { name: /^Add/ })).toBeNull();
    expect((screen.getByRole('checkbox') as HTMLButtonElement).disabled).toBe(true);
  });
});
