'use client';

import Image from 'next/image';
import { NAVY, VIOLET } from '../_lib/tokens';
import { useLang } from './LangProvider';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="pt-12 pb-8 lg:pt-16 lg:pb-10 relative overflow-hidden" style={{ background: NAVY }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      <div className="absolute pointer-events-none" style={{ bottom: 0, right: 0, width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 65%)' }} />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-10 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex flex-col gap-3">
            <Image src="/img/logo-fdk.svg" alt="Fundacja Firma dla każdego" width={128} height={32} className="h-8 w-auto brightness-0 invert opacity-85" />
            <p className="text-white/45 text-sm leading-snug" style={{ maxWidth: '220px' }}>Fundacja Firma dla każdego</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: `${VIOLET}cc` }}>{t.footer.officeLabel}</p>
            <p className="text-white/70 text-sm font-medium">Lwowska 17/4, Warszawa</p>
            <p className="text-white/45 text-sm">
              {t.footer.workdays}
              <span className="text-white/70 font-semibold ml-2">9:00 – 17:00</span>
            </p>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <p className="text-white/20 text-xs">{t.footer.rights}</p>
            <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer" className="text-white/30 text-xs hover:text-white/50 transition-colors">
              {t.footer.privacy}
            </a>
          </div>
          <p className="text-white/[0.18] text-xs">PL · EN · UA · RU</p>
        </div>
      </div>
    </footer>
  );
}
