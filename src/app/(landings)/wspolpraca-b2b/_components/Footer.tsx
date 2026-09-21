'use client';

import Image from 'next/image';
import { NAVY } from '../_lib/tokens';
import { useLang } from './LangProvider';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="py-12 lg:py-16 relative overflow-hidden" style={{ background: NAVY }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute pointer-events-none" style={{ bottom: 0, left: 0, width: '400px', height: '300px', background: 'radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 65%)' }} />
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <Image src="/img/logo-fdk.svg" alt="FDK" width={160} height={40} className="h-10 w-auto brightness-0 invert opacity-90" />
            <p className="text-white/40 text-xs mt-1">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-white/60 text-sm font-semibold">Inkubator FDK</p>
            <p className="text-white/35 text-xs">PL · EN · UA · RU</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer" className="text-white/40 text-xs hover:text-white/60 transition-colors">
              {t.footer.privacy}
            </a>
            <p className="text-white/25 text-xs">{t.footer.rights}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
