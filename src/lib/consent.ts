export interface ConsentState {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  updated_at: string;
}

const STORAGE_KEY = 'fdk_consent';

const DEFAULT_DENIED: ConsentState = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  updated_at: '',
};

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setConsent(state: Omit<ConsentState, 'updated_at'>) {
  const full: ConsentState = { ...state, updated_at: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(full));

  // Push to gtag consent update
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: full.analytics_storage,
      ad_storage: full.ad_storage,
      ad_user_data: full.ad_user_data,
      ad_personalization: full.ad_personalization,
    });
  }

  // Push to dataLayer
  pushDataLayer('consent_update', full as unknown as Record<string, unknown>);

  // Dispatch event for other components
  window.dispatchEvent(new CustomEvent('fdk_consent_change', { detail: full }));
}

export function acceptAll() {
  setConsent({
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });
}

export function acceptEssentialOnly() {
  setConsent({ ...DEFAULT_DENIED });
}

export function isAdConsentGranted(): boolean {
  const c = getConsent();
  return c?.ad_storage === 'granted';
}

export function isAnalyticsConsentGranted(): boolean {
  const c = getConsent();
  return c?.analytics_storage === 'granted';
}

function pushDataLayer(event: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

