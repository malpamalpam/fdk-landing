'use client';

import { X } from 'lucide-react';
import { NAVY, MID } from '../_lib/tokens';
import { useLang } from './LangProvider';

export default function NotWeDo() {
  const { t } = useLang();
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <div className="max-w-xl mb-14">
          <h2 className="font-black mb-4 leading-tight" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)' }}>
            {t.notWeDo.heading}
          </h2>
          <p className="leading-relaxed text-base" style={{ color: MID }}>{t.notWeDo.sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.notWeDo.items.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border" style={{ borderColor: 'rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.03)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <X className="w-4 h-4" style={{ color: '#EF4444' }} />
              </div>
              <p className="text-sm leading-relaxed pt-1.5" style={{ color: MID }}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
