'use client';

import { BadgeCheck, FileText, Zap, Globe, CreditCard, Languages } from 'lucide-react';
import { NAVY, MID, WHY_ACCENTS } from '../_lib/tokens';
import { useLang } from './LangProvider';

const ICONS = [BadgeCheck, FileText, Zap, Globe, CreditCard, Languages];

export default function WhyUs() {
  const { t } = useLang();
  return (
    <section id="why-us" className="py-20 lg:py-28 bg-white" style={{ scrollMarginTop: '80px' }}>
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <div className="mb-14">
          <h2 className="font-black mb-3" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            {t.whyUs.heading}
          </h2>
          <p className="text-base" style={{ color: MID }}>{t.whyUs.sub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.whyUs.items.map((item, i) => {
            const Icon = ICONS[i];
            const accent = WHY_ACCENTS[i];
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white transition-all duration-200 cursor-default group"
                style={{ border: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1 text-sm leading-snug" style={{ color: NAVY }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: MID }}>{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
