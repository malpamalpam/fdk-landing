'use client';

import { useState, useEffect } from 'react';
import { Check, Shield } from 'lucide-react';
import Image from 'next/image';
import { NAVY, VIOLET, MID, GRAD, TAB_COLORS } from '../_lib/tokens';
import { useLang } from './LangProvider';
import GlowCard from './GlowCard';

const TAB_IMGS = ['/img/wspolpraca/service-admin.webp', '/img/wspolpraca/service-accounting.webp', '/img/wspolpraca/service-payments.webp', '/img/wspolpraca/service-legal.webp'];

export default function Services() {
  const { lang, t } = useLang();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => { setActiveTab(0); }, [lang]);

  const tab = t.services.tabs[activeTab];
  const isLegal = tab?.id === 'legal';

  return (
    <section id="services" className="py-20 lg:py-28 bg-white" style={{ scrollMarginTop: '80px' }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-3 py-1.5 rounded-full" style={{ background: `${VIOLET}10`, color: VIOLET }}>
            {t.services.scopeLabel}
          </span>
          <h2 className="font-black" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            {t.services.heading}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {t.services.tabs.map((tb, i) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(i)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={activeTab === i ? { background: GRAD, color: '#fff', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' } : { background: 'white', color: MID, border: '1px solid rgba(15,23,42,0.08)' }}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: activeTab === i ? 'rgba(255,255,255,0.7)' : TAB_COLORS[i] }} />
              {tb.label}
            </button>
          ))}
        </div>

        {tab && (
          <GlowCard className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] overflow-hidden rounded-[15px]">
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: TAB_COLORS[activeTab] + '20', color: TAB_COLORS[activeTab] }}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: NAVY }}>{tab.label}</h3>
                </div>
                <ul className="space-y-3.5">
                  {tab.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: TAB_COLORS[activeTab] }}>
                        <Check className="w-3.5 h-3.5 text-white" />
                      </span>
                      <span className="text-sm" style={{ color: MID }}>{item}</span>
                    </li>
                  ))}
                </ul>
                {isLegal && (
                  <p className="mt-5 text-xs italic leading-relaxed" style={{ color: MID }}>{t.services.legalDisclaimer}</p>
                )}
              </div>
              <div className="hidden lg:block relative overflow-hidden" style={{ minHeight: '280px' }}>
                <Image src={TAB_IMGS[activeTab % 4]} alt={tab.label} fill className="object-cover" sizes="300px" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 40%)' }} />
              </div>
            </div>
          </GlowCard>
        )}
      </div>
    </section>
  );
}
