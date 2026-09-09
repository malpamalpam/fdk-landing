/** Returns true if value is a non-empty string or number (not null/undefined/"") */
export const isKnown = (v: unknown): v is string | number =>
  v !== null && v !== undefined && v !== '';
