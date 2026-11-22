'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { getSiteContent } from '@/content/sites';
import { SITES } from '@/config/sites';
import { track } from '@/lib/track';

export default function SiteThankYouClient() {
  const params = useParams();
  const site = params.site as string;
  const content = getSiteContent(site);
  const config = SITES[site as keyof typeof SITES];
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    const eid = sessionStorage.getItem('fdk_site_event_id');
    if (!eid) return;

    // Guard: skip if this event was already sent (prevents double-fire)
    const sentKey = `fdk_lead_sent_${eid}`;
    if (sessionStorage.getItem(sentKey)) {
      sessionStorage.removeItem('fdk_site_event_id');
      sessionStorage.removeItem('fdk_site_id');
      firedRef.current = true;
      return;
    }

    track('lead', { site, segment: site, event_id: eid });
    sessionStorage.setItem(sentKey, '1');
    sessionStorage.removeItem('fdk_site_event_id');
    sessionStorage.removeItem('fdk_site_id');
    firedRef.current = true;
  }, [site]);

  if (!content || !config) return null;

  return (
    <div className="min-h-screen bg-surfaceSite flex flex-col">
      <header className="bg-navy py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Image src="/logo-white.png" alt="FDK" width={140} height={32} className="h-7 w-auto" />
          <a href={`tel:${config.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-lavender text-sm">
            <Phone className="w-4 h-4" /> {config.phone}
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-lime" />
          </div>
          <h1 className="text-navy font-bold text-2xl mb-3">{content.thanks.title}</h1>
          <p className="text-muted text-base mb-8">{content.thanks.text}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-lime text-navy font-bold px-7 py-3 rounded-pill hover:bg-limeSoft transition-colors"
          >
            {content.site === 'tutors' ? 'Back to home' : content.site === 'creative' ? 'На главную' : 'Wróć na stronę'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
