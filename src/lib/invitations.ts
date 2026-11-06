import type { Slot } from '@/types';
import { paths } from '@/app/paths';
import { MESSAGE_MAX_LENGTH } from '@/config/constants';
import { formatSessionTime } from './format';

// the api only lets students create bookings, so a mentor invites by sending a link that opens the booking with the time chosen
export const INVITE_SLOT_PARAM = 'slot';

export const inviteLink = (origin: string, mentorId: string, slotId: string) =>
  `${origin}${paths.student.mentor(mentorId)}?${INVITE_SLOT_PARAM}=${encodeURIComponent(slotId)}`;

export function inviteMessage({ mentorName, slot, note, link }: { mentorName: string; slot: Slot; note: string; link: string }) {
  const lines = [
    `${mentorName} invited you to a mentoring session on ${formatSessionTime(slot.startsAt, slot.endsAt)}.`,
    note.trim(),
    `Book it here: ${link}`,
  ].filter(Boolean);
  return lines.join('\n\n').slice(0, MESSAGE_MAX_LENGTH);
}

export type TextPart = { text: string } | { text: string; href: string; internalPath: string | null };

// splits message text into plain text and links, links to this app become in app paths
export function splitLinks(text: string, origin: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of text.matchAll(/https?:\/\/[^\s<>"]+[^\s<>".,;:!?)]/g)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start) });
    const href = match[0];
    let internalPath: string | null = null;
    try {
      const url = new URL(href);
      if (url.origin === origin) internalPath = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      // keep it as an external link
    }
    parts.push({ text: href, href, internalPath });
    last = start + href.length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
