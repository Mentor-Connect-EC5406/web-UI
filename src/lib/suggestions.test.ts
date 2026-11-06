import { describe, expect, it } from 'vitest';
import { matchSuggestions } from './suggestions';

const options = ['University of Colombo', 'University of Moratuwa', 'SLIIT', 'Open University of Sri Lanka'];

describe('matchSuggestions', () => {
  it('lists options when nothing is typed', () => {
    expect(matchSuggestions(options, '', 2)).toEqual(['University of Colombo', 'University of Moratuwa']);
  });

  it('matches every word in any order, ignoring case', () => {
    expect(matchSuggestions(options, 'colombo univ')).toEqual(['University of Colombo']);
  });

  it('puts options that start with the query first', () => {
    expect(matchSuggestions(options, 'univ')[0]).toBe('University of Colombo');
    expect(matchSuggestions(options, 'univ')).toContain('Open University of Sri Lanka');
  });

  it('hides the list once the value is an exact match', () => {
    expect(matchSuggestions(options, 'sliit')).toEqual([]);
  });
});
