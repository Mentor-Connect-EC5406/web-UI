// business rules shared across the app, change here not inline

// free cancellation is allowed up to this many hours before session start
export const CANCELLATION_WINDOW_HOURS = 12;

export const SESSION_LENGTH_MINUTES = 60;

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
// how far back and ahead the month and year pickers go, ahead covers expected graduation
export const PROFILE_YEARS_BACK = 60;
export const PROFILE_YEARS_AHEAD = 6;

// profile photos are kept small because they are stored inline until uploads exist
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// reviews must say something useful but stay short enough to read on a profile
export const REVIEW_MIN_LENGTH = 20;
export const REVIEW_MAX_LENGTH = 1000;

export const MESSAGE_MAX_LENGTH = 1000;
export const GOAL_TITLE_MAX_LENGTH = 100;
