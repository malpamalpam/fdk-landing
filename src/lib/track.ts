type TrackParams = Record<string, string | number | boolean | undefined>;

/** Push event to dataLayer (for GTM) and fire pixel events directly */
export function track(event: string, params: TrackParams = {}) {
  if (typeof window === 'undefined') return;

  // Always push to dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  // Meta Pixel (direct, for event_id dedup with CAPI)
  if (typeof window.fbq === 'function') {
    const metaEvents: Record<string, string> = {
      cta_click: 'CTAClick',
      phone_click: 'Contact',
      lead: 'Lead',
    };
    const metaEvent = metaEvents[event];
    if (metaEvent) {
      const eventId = params.event_id as string | undefined;
      if (metaEvent === 'CTAClick') {
        window.fbq('trackCustom', metaEvent, params);
      } else if (eventId) {
        window.fbq('track', metaEvent, params, { eventID: eventId });
      } else {
        window.fbq('track', metaEvent, params);
      }
    }
  }

  // GA4 fallback (when no GTM)
  if (typeof window.gtag === 'function' && !process.env.NEXT_PUBLIC_GTM_ID) {
    const ga4Events: Record<string, string> = {
      cta_click: 'cta_click',
      phone_click: 'phone_click',
      lead: 'generate_lead',
      form_start: 'form_start',
      form_error: 'form_error',
    };
    const ga4Event = ga4Events[event];
    if (ga4Event) {
      window.gtag('event', ga4Event, params);
    }

    if (event === 'lead') {
      const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
      const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
      if (adsId && label) {
        window.gtag('event', 'conversion', {
          send_to: `${adsId}/${label}`,
          ...params,
        });
      }
    }
  }

  // TikTok Pixel (direct, for event_id dedup)
  if (window.ttq) {
    const ttEvents: Record<string, string> = {
      cta_click: 'ClickButton',
      phone_click: 'Contact',
      lead: 'SubmitForm',
    };
    const ttEvent = ttEvents[event];
    if (ttEvent) {
      const eventId = params.event_id as string | undefined;
      window.ttq.track(ttEvent, {
        content_name: (params.content_name as string) || 'lead_form',
      }, eventId ? { event_id: eventId } : undefined);
    }
  }
}

export function trackPageView(params: TrackParams = {}) {
  track('page_view_lp', params);
}
