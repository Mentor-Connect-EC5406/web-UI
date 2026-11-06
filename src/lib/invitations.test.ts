import { describe, expect, it } from 'vitest';
import type { Slot } from '@/types';
import { inviteLink, inviteMessage, splitLinks } from './invitations';

const origin = 'https://mentorconnect.example';
const slot: Slot = { id: 'slot-1', startsAt: new Date('2026-11-10T10:00').toISOString(), endsAt: new Date('2026-11-10T11:00').toISOString(), status: 'AVAILABLE' };

describe('session invitations', () => {
  it('links to the mentor profile with the time chosen', () => {
    expect(inviteLink(origin, 'm1', 'slot-1')).toBe('https://mentorconnect.example/student/mentors/m1?slot=slot-1');
  });

  it('writes the time, the note and the link', () => {
    const text = inviteMessage({ mentorName: 'Nimal Silva', slot, note: ' Bring your CV ', link: 'L' });
    expect(text).toBe('Nimal Silva invited you to a mentoring session on Tue, 10 Nov 2026 · 10:00 AM – 11:00 AM.\n\nBring your CV\n\nBook it here: L');
  });

  it('turns links into in app paths or external links', () => {
    const parts = splitLinks(`Book it here: ${origin}/student/mentors/m1?slot=s1. Notes: https://docs.example/x`, origin);
    expect(parts).toEqual([
      { text: 'Book it here: ' },
      { text: `${origin}/student/mentors/m1?slot=s1`, href: `${origin}/student/mentors/m1?slot=s1`, internalPath: '/student/mentors/m1?slot=s1' },
      { text: '. Notes: ' },
      { text: 'https://docs.example/x', href: 'https://docs.example/x', internalPath: null },
    ]);
    expect(splitLinks('no links here', origin)).toEqual([{ text: 'no links here' }]);
  });
});
