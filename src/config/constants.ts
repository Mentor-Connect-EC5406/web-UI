// business rules shared across the app, change here not inline

// free cancellation is allowed up to this many hours before session start
export const CANCELLATION_WINDOW_HOURS = 12;

// the api accepts slots of exactly this length, longer ranges are split into several slots
export const SESSION_LENGTH_MINUTES = 60;

// keeps one save to a reasonable number of api calls
export const MAX_SLOT_REPEAT_WEEKS = 8;
export const MAX_SLOTS_PER_SAVE = 40;

// matches the api, which lets a session start this many minutes early
export const JOIN_EARLY_MINUTES = 15;

// matches the api, a request not answered by then is released
export const MENTOR_RESPONSE_HOURS = 24;

export const BOOKING_TOPIC_MAX_LENGTH = 200;
export const CANCEL_REASON_MAX_LENGTH = 500;

// long term mentorship, durations match the mentorship_programs table
export const MENTORSHIP_DURATIONS_MONTHS = [6, 12, 24, 48] as const;
export const MENTORSHIP_TITLE_MAX_LENGTH = 100;
export const MENTORSHIP_GOALS_MAX_LENGTH = 1000;

// homework, targets and goals attached to a session
export const TASK_TITLE_MAX_LENGTH = 120;
export const TASK_DETAILS_MAX_LENGTH = 1000;

export const CURRENCY = 'LKR';

// limits that keep profiles readable on cards and in search results
export const MAX_BIO_LENGTH = 600;
export const MAX_SKILLS = 10;
export const MAX_INTERESTS = 5;
export const MAX_EXPERIENCE_YEARS = 50;

// profile sections
export const MAX_HEADLINE_LENGTH = 120;
export const MAX_ENTRY_DESCRIPTION_LENGTH = 400;
export const MAX_PROFILE_ENTRIES = 10;
export const MAX_LANGUAGES = 6;
export const MAX_DESIRED_ROLES = 5;
// how many matches a typeahead field lists at once
export const MAX_SUGGESTIONS = 8;
// how far back and ahead the month and year pickers go, ahead covers expected graduation
export const PROFILE_YEARS_BACK = 60;
export const PROFILE_YEARS_AHEAD = 6;

// kept under the api limit of 5 MB so photos stay quick to load
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// mentor verification documents, checked again by the api
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// reviews must say something useful but stay short enough to read on a profile
export const REVIEW_MIN_LENGTH = 20;
export const REVIEW_MAX_LENGTH = 1000;

export const MESSAGE_MAX_LENGTH = 1000;
// conversations listed in the header notifications panel
export const NOTIFICATION_PREVIEW_COUNT = 5;
export const NOTIFICATION_PAGE_SIZE = 20;
// the api has no push channel yet, so the bell polls
export const NOTIFICATION_POLL_MS = 60_000;
export const GOAL_TITLE_MAX_LENGTH = 100;
