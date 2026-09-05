'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { getLandingBySlug } from '@/content/landings';
import { pushEvent, EVENTS } from '@/lib/analytics';

export default function ThankYouLandingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const landing = getLandingBySlug(slug);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const eventId = sessionStorage.getItem('fdk_lp_event_id') || '';
    const segment = sessionStorage.getItem('fdk_lp_segment') || '';

    if (eventId) {
      pushEvent(EVENTS.formSubmit, {
        landing_slug: slug,
        segment,
        event_id: eventId,
      });
      sessionStorage.removeItem('fdk_lp_event_id');
    }
  }, [slug]);

  if (!landing) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-lg">
        <CheckCircle className="w-16 h-16 text-brand mb-6" aria-hidden="true" />
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-4">
          {landing.thankYou.h1}
        </h1>
        <p className="text-lg text-body mb-8">
          {landing.thankYou.lead}
        </p>
        {landing.thankYou.next.length > 0 && (
          <ul className="space-y-3 mb-8">
            {landing.thankYou.next.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-body">{step}</span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/${landing.slug}`}
          className="inline-flex items-center text-brand hover:text-brandDark font-semibold transition-colors"
        >
          ← Wróć na stronę
        </Link>
      </div>
    </main>
  );
}
