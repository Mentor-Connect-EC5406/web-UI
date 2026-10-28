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
