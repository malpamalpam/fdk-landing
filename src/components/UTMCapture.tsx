'use client';

import { useEffect } from 'react';
import { captureAttribution } from '@/lib/attribution';
import { trackPageView } from '@/lib/track';

export default function UTMCapture({ segment, locale, hookVariant }: { segment?: string; locale?: string; hookVariant?: string }) {
  useEffect(() => {
    captureAttribution();
    trackPageView({ segment: segment || 'ogolny', locale: locale || 'pl', hook_variant: hookVariant || 'a' });
  }, [segment, locale, hookVariant]);

  return null;
}
