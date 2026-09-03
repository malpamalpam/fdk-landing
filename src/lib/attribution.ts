interface TouchData {
  source: string;
  medium: string;
  campaign: string;
  at: string;
  url?: string;
}

const FT_KEY = 'fdk_ft';
const LT_KEY = 'fdk_lt';

function getClickIdSource(params: URLSearchParams): { source: string; medium: string } | null {
  if (params.get('gclid') || params.get('gbraid') || params.get('wbraid')) {
    return { source: 'google', medium: 'cpc' };
  }
  if (params.get('fbclid')) return { source: 'facebook', medium: 'cpc' };
  if (params.get('ttclid')) return { source: 'tiktok', medium: 'cpc' };
  if (params.get('msclkid')) return { source: 'bing', medium: 'cpc' };
  return null;
}

function getReferrerSource(referrer: string): { source: string; medium: string } | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname;
    if (host === window.location.hostname) return null;
    return { source: host, medium: 'referral' };
  } catch {
    return null;
  }
}

function detectSource(params: URLSearchParams, referrer: string): TouchData | null {
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');

  if (utmSource) {
    return {
      source: utmSource,
      medium: utmMedium || '(none)',
      campaign: utmCampaign || '(none)',
      at: new Date().toISOString(),
      url: window.location.href,
    };
  }

  const clickId = getClickIdSource(params);
  if (clickId) {
    return {
      source: clickId.source,
      medium: clickId.medium,
      campaign: utmCampaign || '(none)',
      at: new Date().toISOString(),
      url: window.location.href,
    };
  }

  const ref = getReferrerSource(referrer);
  if (ref) {
    return {
      source: ref.source,
      medium: ref.medium,
      campaign: '(none)',
      at: new Date().toISOString(),
      url: window.location.href,
    };
  }

  return null;
}

export function captureAttribution() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);

  // Save click IDs and UTMs to sessionStorage
  const sessionKeys = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid', 'msclkid',
  ];
  for (const key of sessionKeys) {
    const value = params.get(key);
    if (value) sessionStorage.setItem(`fdk_${key}`, value);
  }

  if (!sessionStorage.getItem('fdk_landing_url')) {
    sessionStorage.setItem('fdk_landing_url', window.location.href);
  }
  if (!sessionStorage.getItem('fdk_referrer')) {
    sessionStorage.setItem('fdk_referrer', document.referrer);
  }

  const touch = detectSource(params, document.referrer);

  // First touch: only set if not exists
  if (!localStorage.getItem(FT_KEY)) {
    const ft = touch || {
      source: 'direct',
      medium: 'none',
      campaign: '(none)',
      at: new Date().toISOString(),
      url: window.location.href,
    };
    localStorage.setItem(FT_KEY, JSON.stringify(ft));
  }

  // Last touch: overwrite only if there's a signal
  if (touch) {
    localStorage.setItem(LT_KEY, JSON.stringify(touch));
  }
}

export function getFirstTouch(): TouchData | null {
  try {
    const raw = localStorage.getItem(FT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getLastTouch(): TouchData | null {
  try {
    const raw = localStorage.getItem(LT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getSessionParam(key: string): string {
  return sessionStorage.getItem(`fdk_${key}`) || '';
}

export function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}
