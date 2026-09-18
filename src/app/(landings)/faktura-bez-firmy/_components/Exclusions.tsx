'use client';

import { XCircle } from 'lucide-react';
import { NAVY, BG } from '../_lib/tokens';
import { useLang } from './LangProvider';

export default function Exclusions() {
  const { t } = useLang();
  return (
    <section className="py-20 lg:py-24" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-black" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>{t.exclusions.heading}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.exclusions.items.map((item, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-2xl" style={{ background: '#FFF6F6', border: '1px solid rgba(239,68,68,0.18)' }}>
              <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
              <div>
                <h3 className="font-bold mb-1.5 text-sm" style={{ color: '#991B1B' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7F1D1D', opacity: 0.8 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
