'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { track } from '@/lib/track';
import { useDictionary } from '@/components/DictionaryProvider';

export default function ThankYouPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'pl';
  const dict = useDictionary();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    track('lead', {
      content_name: 'lead_form',
      locale,
    });
  }, [locale]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="text-center max-w-lg">
        <CheckCircle className="w-16 h-16 text-brand mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-4">
          {dict.thanks.title}
        </h1>
        <p className="text-lg text-body mb-8">
          {dict.thanks.text}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center bg-brand hover:bg-brandDark text-white font-semibold text-lg px-8 py-4 rounded-[4px] transition-colors"
        >
          {dict.thanks.cta}
        </Link>
      </div>
    </main>
  );
}
