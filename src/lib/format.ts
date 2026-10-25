import { format, parseISO } from 'date-fns';
import { CURRENCY, SESSION_LENGTH_MINUTES } from '@/config/constants';

/** "Mon, 3 Nov 2026" */
export const formatDate = (iso: string) => format(parseISO(iso), 'EEE, d MMM yyyy');

/** "10:00 AM" */
export const formatTime = (iso: string) => format(parseISO(iso), 'h:mm a');

/** "Mon, 3 Nov 2026 · 10:00 AM – 11:00 AM" */
export const formatSessionTime = (startsAt: string, endsAt: string) =>
  `${formatDate(startsAt)} · ${formatTime(startsAt)} – ${formatTime(endsAt)}`;

/** The viewer's IANA timezone, e.g. "Asia/Colombo" */
export const viewerTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** "LKR 2,500" */
export const formatPrice = (amount: number) => `${CURRENCY} ${amount.toLocaleString('en-LK')}`;

/** "1 hour" / "45 minutes" */
export const sessionLengthLabel = () =>
  SESSION_LENGTH_MINUTES % 60 === 0
    ? `${SESSION_LENGTH_MINUTES / 60} hour${SESSION_LENGTH_MINUTES === 60 ? '' : 's'}`
    : `${SESSION_LENGTH_MINUTES} minutes`;

/** "Nimal Silva" → "NS" */
export const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** "Nimal Silva" → "Nimal" */
export const firstName = (name: string) => name.split(' ')[0];
