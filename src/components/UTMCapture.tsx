'use client';

import { useEffect } from 'react';
import { initUTMCapture } from '@/lib/track';

export default function UTMCapture() {
  useEffect(() => {
    initUTMCapture();
  }, []);

  return null;
}
