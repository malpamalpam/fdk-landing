'use client';

import { useState, useEffect } from 'react';
import type { Dictionary } from '@/dictionaries/types';

export default function CookieBanner({ dict }: { dict: Dictionary }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('fdk_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = (value: 'all' | 'essential') => {
    localStorage.setItem('fdk_consent', value);
    setShow(false);
    if (value === 'all') {
      window.dispatchEvent(new Event('fdk_consent_granted'));
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl p-4 md:p-6 md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-[12px] md:border">
      <p className="text-sm text-body mb-4">{dict.cookie.text}</p>
      <div className="flex gap-3">
        <button
          onClick={() => accept('all')}
          className="flex-1 bg-brand hover:bg-brandDark text-white text-sm font-semibold py-2.5 px-4 rounded-[4px] transition-colors"
        >
          {dict.cookie.accept}
        </button>
        <button
          onClick={() => accept('essential')}
          className="flex-1 border border-gray-300 text-ink text-sm font-semibold py-2.5 px-4 rounded-[4px] hover:bg-gray-50 transition-colors"
        >
          {dict.cookie.essential}
        </button>
      </div>
    </div>
  );
}
