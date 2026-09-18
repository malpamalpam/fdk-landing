'use client';

import { Check, ArrowRight, Globe, CreditCard, Scale, Heart } from 'lucide-react';
import { NAVY, BLUE, VIOLET, SLATE_1, MID, GRAD } from '../_lib/tokens';
import { useLang } from './LangProvider';
import GlowCard from './GlowCard';

const BENEFIT_CONFIG = [
  { icon: Globe, color: '#2563EB' },
  { icon: CreditCard, color: '#10B981' },
  { icon: Scale, color: '#8B5CF6' },
  { icon: Heart, color: '#EF4444' },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Benefits() {
  const { t } = useLang();
  return (
    <section id="benefits" className="py-20 lg:py-28" style={{ background: SLATE_1, scrollMarginTop: '80px' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-3 py-1.5 rounded-full" style={{ background: `${VIOLET}10`, color: VIOLET }}>
            {t.benefits.programLabel}
          </span>
          <h2 className="font-black max-w-2xl mx-auto" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            {t.benefits.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {t.benefits.categories.map((cat, i) => {
            const cfg = BENEFIT_CONFIG[i];
            const Icon = cfg.icon;
            return (
              <GlowCard key={i}>
                <div className="p-8 flex flex-col h-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 w-fit" style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}28` }}>
                    <Icon className="flex-shrink-0" style={{ width: 13, height: 13, color: cfg.color, strokeWidth: 2 }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: cfg.color }}>{cat.label}</span>
                  </div>
                  <h3 className="font-extrabold mb-5 leading-snug" style={{ color: NAVY, fontSize: '1.2rem' }}>{cat.title}</h3>
                  <ul className="space-y-2.5 flex-1">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: cfg.color }} />
                        <span className="text-sm leading-relaxed" style={{ color: MID }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button onClick={() => scrollTo('contact')} className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-base text-white transition-all hover:shadow-lg" style={{ background: GRAD, boxShadow: '0 4px 20px rgba(37,99,235,0.25)' }}>
            {t.benefits.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
