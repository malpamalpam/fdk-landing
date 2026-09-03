'use client';

import { useState, useEffect } from 'react';
import type { Dictionary } from '@/dictionaries/types';
import { getConsent, acceptAll, acceptEssentialOnly, setConsent } from '@/lib/consent';

export default function CookieBanner({ dict }: { dict: Dictionary }) {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    if (!getConsent()) setShow(true);
  }, []);

  const handleAcceptAll = () => {
    acceptAll();
    setShow(false);
  };

  const handleEssentialOnly = () => {
    acceptEssentialOnly();
    setShow(false);
  };

  const handleSave = () => {
    setConsent({
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: advertising ? 'granted' : 'denied',
      ad_user_data: advertising ? 'granted' : 'denied',
      ad_personalization: advertising ? 'granted' : 'denied',
    });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl p-4 md:p-6 md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-[12px] md:border">
      <p className="text-sm text-body mb-4">{dict.cookie.text}</p>

      {showSettings ? (
        <div className="space-y-3 mb-4">
          <label className="flex items-center justify-between text-sm">
            <span className="text-ink font-medium">{dict.cookie.analytics}</span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="w-4 h-4 rounded text-brand focus:ring-brand"
            />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="text-ink font-medium">{dict.cookie.advertising}</span>
            <input
              type="checkbox"
              checked={advertising}
              onChange={(e) => setAdvertising(e.target.checked)}
              className="w-4 h-4 rounded text-brand focus:ring-brand"
            />
          </label>
          <button
            onClick={handleSave}
            className="w-full bg-brand hover:bg-brandDark text-white text-sm font-semibold py-2.5 px-4 rounded-[4px] transition-colors"
          >
            {dict.cookie.save}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <button
              onClick={handleAcceptAll}
              className="flex-1 bg-brand hover:bg-brandDark text-white text-sm font-semibold py-2.5 px-4 rounded-[4px] transition-colors"
            >
              {dict.cookie.accept}
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 border border-gray-300 text-ink text-sm font-semibold py-2.5 px-4 rounded-[4px] hover:bg-gray-50 transition-colors"
            >
              {dict.cookie.essential}
            </button>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="text-sm text-body hover:text-ink underline transition-colors"
          >
            {dict.cookie.settings}
          </button>
        </div>
      )}
    </div>
  );
}
