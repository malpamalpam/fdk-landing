'use client';

import { XCircle, Check } from 'lucide-react';
import { NAVY, BG, MID } from '../_lib/tokens';
import { useLang } from './LangProvider';

export default function Comparison() {
  const { t } = useLang();
  return (
    <section className="py-20 lg:py-28" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-black" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            {t.comparison.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-2xl p-7" style={{ background: '#FFF6F6', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <XCircle className="w-4 h-4" style={{ color: '#EF4444' }} />
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: '#EF4444' }}>{t.comparison.lossLabel}</span>
            </div>
            <ul className="space-y-4">
              {t.comparison.losses.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                  <span className="text-sm leading-relaxed" style={{ color: '#7F1D1D' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-7" style={{ background: '#F0FDF4', border: '1px solid rgba(16,185,129,0.25)' }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <Check className="w-4 h-4" style={{ color: '#10B981' }} />
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: '#10B981' }}>{t.comparison.gainLabel}</span>
            </div>
            <ul className="space-y-4">
              {t.comparison.gains.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                  <span className="text-sm leading-relaxed" style={{ color: '#064E3B' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
