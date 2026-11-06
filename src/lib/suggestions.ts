import { MAX_SUGGESTIONS } from '@/config/constants';

// options containing every typed word, ones starting with the query first
export function matchSuggestions(options: readonly string[], query: string, limit = MAX_SUGGESTIONS) {
  const q = query.trim().toLowerCase();
  if (!q) return options.slice(0, limit);
  const words = q.split(/\s+/);
  const matches = options.filter((o) => {
    const text = o.toLowerCase();
    return text !== q && words.every((w) => text.includes(w));
  });
  const starts = matches.filter((o) => o.toLowerCase().startsWith(q));
  const rest = matches.filter((o) => !o.toLowerCase().startsWith(q));
  return [...starts, ...rest].slice(0, limit);
}
