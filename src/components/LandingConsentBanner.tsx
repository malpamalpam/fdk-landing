'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fdk_lp_consent';

interface ConsentPrefs {
  analytics: 'granted' | 'denied';
  advertising: 'granted' | 'denied';
}

function getStored(): ConsentPrefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(prefs: ConsentPrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: prefs.analytics,
      ad_storage: prefs.advertising,
      ad_user_data: prefs.advertising,
      ad_personalization: prefs.advertising,
    });
  }
}

export default function LandingConsentBanner() {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl p-4 md:p-6 md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-[12px] md:border">
      <p className="text-sm text-body mb-4">
        Używamy plików cookie do mierzenia skuteczności reklam. Możesz zaakceptować wszystkie albo wybrać kategorie.
      </p>

      {showSettings ? (
        <div className="space-y-3 mb-4">
          <label className="flex items-center justify-between text-sm">
            <span className="text-ink font-medium">Analityka</span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="w-4 h-4 rounded text-brand focus:ring-brand" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="text-ink font-medium">Reklama</span>
            <input type="checkbox" checked={advertising} onChange={(e) => setAdvertising(e.target.checked)} className="w-4 h-4 rounded text-brand focus:ring-brand" />
          </label>
          <button
            onClick={() => accept({ analytics: analytics ? 'granted' : 'denied', advertising: advertising ? 'granted' : 'denied' })}
            className="w-full bg-brand hover:bg-brandDark text-white text-sm font-semibold py-2.5 rounded-[4px] transition-colors"
          >
            Zapisz
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <button onClick={() => accept({ analytics: 'granted', advertising: 'granted' })} className="flex-1 bg-brand hover:bg-brandDark text-white text-sm font-semibold py-2.5 px-4 rounded-[4px] transition-colors">
              Akceptuję
            </button>
            <button onClick={() => accept({ analytics: 'denied', advertising: 'denied' })} className="flex-1 border border-gray-300 text-ink text-sm font-semibold py-2.5 px-4 rounded-[4px] hover:bg-gray-50 transition-colors">
              Tylko niezbędne
            </button>
          </div>
          <button onClick={() => setShowSettings(true)} className="text-sm text-body hover:text-ink underline transition-colors">
            Ustawienia
          </button>
        </div>
      )}
    </div>
  );
}
