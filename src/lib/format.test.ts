import { describe, expect, it } from 'vitest';
import { firstName, formatPrice, initials, sessionLengthLabel } from './format';

describe('format helpers', () => {
  it('formats prices with the configured currency and separators', () => {
    expect(formatPrice(2500)).toBe('LKR 2,500');
  });

  it('builds two-letter initials', () => {
    expect(initials('Nimal Silva')).toBe('NS');
    expect(initials('Chamari Wickramasinghe Perera')).toBe('CW');
  });

  it('returns the first name', () => {
    expect(firstName('Ashan Perera')).toBe('Ashan');
  });

  it('describes the session length in words', () => {
    expect(sessionLengthLabel()).toBe('1 hour');
  });
});
