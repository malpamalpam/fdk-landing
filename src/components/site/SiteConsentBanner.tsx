'use client';

import { useState, useEffect } from 'react';
import type { SiteContent } from '@/content/site-types';

const STORAGE_KEY = 'fdk_lp_consent';
const CONSENT_TTL = 365 * 24 * 60 * 60 * 1000;

interface ConsentPrefs {
  analytics: 'granted' | 'denied';
  advertising: 'granted' | 'denied';
  expires?: number;
}

function getStored(): ConsentPrefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const prefs: ConsentPrefs = JSON.parse(raw);
    if (prefs.expires && Date.now() > prefs.expires) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return prefs;
  } catch {
    return null;
  }
}

function save(prefs: ConsentPrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, expires: Date.now() + CONSENT_TTL }));
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: prefs.analytics,
      ad_storage: prefs.advertising,
      ad_user_data: prefs.advertising,
      ad_personalization: prefs.advertising,
    });
  }
}

export default function SiteConsentBanner({ content }: { content: SiteContent }) {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    if (!getStored()) setShow(true);
  }, []);

  const accept = (prefs: ConsentPrefs) => {
    save(prefs);
    setShow(false);
  };

  if (!show) return null;

  const { cookie } = content;

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl px-3 py-3 md:p-6 md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-card-site md:border">
      <p className="text-sm text-muted mb-3 leading-snug">{cookie.text}</p>

      {showSettings ? (
        <div className="space-y-3 mb-3">
          <label className="flex items-center justify-between text-sm">
            <span className="text-navy font-medium">Analytics</span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="w-4 h-4 rounded text-lime focus:ring-lime" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="text-navy font-medium">Advertising</span>
            <input type="checkbox" checked={advertising} onChange={(e) => setAdvertising(e.target.checked)} className="w-4 h-4 rounded text-lime focus:ring-lime" />
          </label>
          <button
            onClick={() => accept({ analytics: analytics ? 'granted' : 'denied', advertising: advertising ? 'granted' : 'denied' })}
            className="w-full bg-lime text-navy text-sm font-bold py-2 min-h-11 rounded-pill transition-colors hover:bg-limeSoft"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => accept({ analytics: 'granted', advertising: 'granted' })}
            className="flex-1 bg-lime text-navy text-sm font-bold py-2 px-3 min-h-11 rounded-pill transition-colors hover:bg-limeSoft"
          >
            {cookie.accept}
          </button>
          <button
            onClick={() => accept({ analytics: 'denied', advertising: 'denied' })}
            className="flex-1 border border-lavender text-navy text-sm font-bold py-2 px-3 min-h-11 rounded-pill hover:bg-surfaceSite transition-colors"
          >
            {cookie.essential}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="text-[14px] md:text-xs text-muted hover:text-navy underline transition-colors whitespace-nowrap flex-shrink-0 min-h-11 inline-flex items-center"
          >
            {cookie.settings}
          </button>
        </div>
      )}
    </div>
  );
}
