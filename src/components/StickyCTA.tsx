'use client';

import { useState, useEffect } from 'react';
import type { Dictionary } from '@/dictionaries/types';

export default function StickyCTA({ dict }: { dict: Dictionary }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 md:hidden bg-ink/95 backdrop-blur-sm border-t border-white/10">
      <a
        href="#kontakt"
        className="block w-full bg-brand hover:bg-brandDark text-white font-semibold text-center py-3 rounded-[4px] transition-colors"
        data-track="cta_click"
        data-track-place="sticky"
      >
        {dict.sticky.cta}
      </a>
    </div>
  );
}
