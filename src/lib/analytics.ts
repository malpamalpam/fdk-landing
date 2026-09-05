export const EVENTS = {
  pageView: 'page_view',
  formStart: 'form_start',
  formSubmit: 'lead',
  faqOpen: 'faq_open',
} as const;

type EventParams = Record<string, string | number | boolean | undefined>;

export function pushEvent(event: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
