type TrackParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, params?: TrackParams) => void;
      page: () => void;
    };
  }
}

export function track(event: string, params: TrackParams = {}) {
  // Meta Pixel
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    const metaEvents: Record<string, string> = {
      cta_click: 'CTAClick',
      phone_click: 'Contact',
      lead: 'Lead',
    };
    const metaEvent = metaEvents[event];
    if (metaEvent) {
      if (metaEvent === 'CTAClick') {
        window.fbq('trackCustom', metaEvent, params);
      } else {
        window.fbq('track', metaEvent, params);
      }
    }
  }

  // GA4 / Google Ads
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const ga4Events: Record<string, string> = {
      cta_click: 'cta_click',
      phone_click: 'phone_click',
      lead: 'generate_lead',
    };
    const ga4Event = ga4Events[event];
    if (ga4Event) {
      window.gtag('event', ga4Event, params);
    }

    // Google Ads conversion
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

  // TikTok Pixel
  if (typeof window !== 'undefined' && window.ttq) {
    const ttEvents: Record<string, string> = {
      cta_click: 'ClickButton',
      phone_click: 'Contact',
      lead: 'SubmitForm',
    };
    const ttEvent = ttEvents[event];
    if (ttEvent) {
      window.ttq.track(ttEvent, params);
    }
  }
}

export function initUTMCapture() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'ttclid'];

  for (const key of keys) {
    const value = params.get(key);
    if (value) {
      sessionStorage.setItem(`fdk_${key}`, value);
    }
  }

  if (!sessionStorage.getItem('fdk_landing_url')) {
    sessionStorage.setItem('fdk_landing_url', window.location.href);
  }
  if (!sessionStorage.getItem('fdk_referrer')) {
    sessionStorage.setItem('fdk_referrer', document.referrer);
  }
}
