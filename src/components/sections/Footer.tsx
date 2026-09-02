import { Facebook, Instagram, Send } from 'lucide-react';
import type { Dictionary } from '@/dictionaries/types';

export default function Footer({ dict }: { dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white py-12 md:py-16">
      <div className="max-w-[1140px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* Logo + tagline */}
          <div>
            <div className="text-2xl font-bold text-brand mb-3">FDK</div>
            <p className="text-white/60 text-sm leading-relaxed">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">{dict.contact.addressTitle}</h3>
            <p className="text-white/60 text-sm whitespace-pre-line leading-relaxed">
              {dict.contact.address}
            </p>
          </div>

          {/* Links + social */}
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <a
                href={`tel:${dict.contact.phonePL.split(' (')[0].replace(/\s/g, '')}`}
                className="text-white/60 text-sm hover:text-brand transition-colors"
              >
                {dict.contact.phonePL}
              </a>
              <a
                href={`tel:${dict.contact.phoneINT.split(' (')[0].replace(/\s/g, '')}`}
                className="text-white/60 text-sm hover:text-brand transition-colors"
              >
                {dict.contact.phoneINT}
              </a>
              <a
                href={`mailto:${dict.contact.email}`}
                className="text-white/60 text-sm hover:text-brand transition-colors"
              >
                {dict.contact.email}
              </a>
            </div>

            <div className="flex gap-3 mb-4">
              <a
                href="https://www.facebook.com/firmadlakazdego"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/firmadlakazdego"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://t.me/FDK_inkubator"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>

            <div className="flex gap-4 text-sm">
              <a
                href="https://firmadlakazdego.pl/polityka-prywatnosci/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-brand transition-colors"
              >
                {dict.footer.privacy}
              </a>
              <a
                href="https://firmadlakazdego.pl/regulamin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-brand transition-colors"
              >
                {dict.footer.terms}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-sm text-white/40">
          {dict.footer.copy.replace('{year}', String(year))}
        </div>
      </div>
    </footer>
  );
}
