export const LEAD_SOURCES = {
  landing1: 'Kontrakt B2B',       // /lp/landing1
  landing2: 'Faktura bez firmy',  // /lp/landing2
  landing3: 'Współpraca B2B',     // /lp/landing3
  // Dodaj nowe landingi tutaj — zakładka w Sheets powstanie automatycznie
} as const;

export type LeadSource = keyof typeof LEAD_SOURCES;

export function isValidSource(source: string): source is LeadSource {
  return source in LEAD_SOURCES;
}
