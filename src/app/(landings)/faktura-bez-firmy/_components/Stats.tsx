'use client';

import { SLATE_1, MID, GRAD } from '../_lib/tokens';
import { useLang } from './LangProvider';

export default function Stats() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden" style={{ background: SLATE_1 }}>
      <div className="relative max-w-6xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {t.stats.map((stat, i) => (
            <div key={i} className="text-center rounded-2xl px-5 py-7 bg-white" style={{ border: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 1px 6px rgba(15,23,42,0.05)' }}>
              <div className="font-black mb-2 leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {stat.value}
              </div>
              <p className="text-xs leading-snug tracking-wide" style={{ color: MID }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
