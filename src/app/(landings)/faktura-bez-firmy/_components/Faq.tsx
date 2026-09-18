'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { NAVY, BLUE, SLATE_1, MID } from '../_lib/tokens';
import { useLang } from './LangProvider';
import { pushEvent, EVENTS } from '@/lib/analytics';

export default function Faq() {
  const { lang, t } = useLang();
  return (
    <section id="faq" className="py-20 lg:py-28" style={{ background: SLATE_1, scrollMarginTop: '80px' }}>
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <h2 className="font-black text-center mb-12" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
          {t.faq.heading}
        </h2>
        <AccordionPrimitive.Root
          type="single"
          collapsible
          className="space-y-3"
          onValueChange={(val) => {
            if (val) {
              const idx = parseInt(val.replace('item-', ''), 10);
              const q = t.faq.items[idx]?.q;
              if (q) pushEvent(EVENTS.faqOpen, { landing_slug: 'landing2', question: q.slice(0, 60) });
            }
          }}
        >
          {t.faq.items.map((item, i) => (
            <AccordionPrimitive.Item key={`${lang}-${i}`} value={`item-${i}`} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)' }}>
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="w-full flex items-center justify-between px-6 py-4 text-left group" style={{ color: NAVY }}>
                  <span className="font-semibold text-sm pr-4 leading-snug">{item.q}</span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" style={{ color: BLUE }} />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden">
                <p className="px-6 pb-5 pt-1 text-sm leading-relaxed border-t" style={{ color: MID, borderColor: 'rgba(37,99,235,0.08)' }}>{item.a}</p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}
