'use client';

import SiteHero from '@/components/site/SiteHero';
import SiteLeadForm from '@/components/site/SiteLeadForm';
import type { SiteContent } from '@/content/site-types';

export default function SiteHookSelector({
  content,
  hookIndex,
}: {
  content: SiteContent;
  hookIndex: number;
}) {
  return (
    <SiteHero
      content={content}
      hookIndex={hookIndex}
      formSlot={<SiteLeadForm content={content} variant="hero" />}
    />
  );
}
