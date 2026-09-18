import { Onest } from 'next/font/google';
import type { ReactNode } from 'react';

const onest = Onest({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-onest',
});

export default function FakturaLayout({ children }: { children: ReactNode }) {
  return (
    <div className={onest.variable} style={{ fontFamily: "'Onest', sans-serif" }}>
      {children}
    </div>
  );
}
