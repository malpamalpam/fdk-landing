import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import type { SiteContent } from '@/content/site-types';

export default function SiteFooter({ content, phone }: { content: SiteContent; phone: string }) {
  return (
    <footer role="contentinfo" className="bg-navy text-lavender py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <Image
              src="/logo-white.png"
              alt="Fundacja Firma Dla Każdego"
              width={160}
              height={36}
              className="h-8 w-auto"
            />
            <p className="text-sm">{content.footer.tagline}</p>
            <div className="text-sm space-y-1">
              <p>
                <a
                  href="https://firmadlakazdego.pl"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-white transition-colors"
                >
                  Fundacja Firma Dla Każdego
                </a>
              </p>
              <p>ul. Lwowska 17/4, 00-660 Warszawa</p>
              <p>NIP: 5252625624</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-lime" />
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="min-h-11 inline-flex items-center hover:text-white transition-colors">
                {phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-lime" />
              <a href="mailto:kontakt@firmadlakazdego.pl" className="min-h-11 inline-flex items-center hover:text-white transition-colors">
                kontakt@firmadlakazdego.pl
              </a>
            </div>
          </div>

          <div className="text-sm space-y-2">
            <a
              href="https://firmadlakazdego.pl/polityka-prywatnosci/"
              target="_blank"
              rel="noopener"
              className="min-h-11 inline-flex items-center hover:text-white transition-colors"
            >
              Polityka prywatności
            </a>
            <a
              href="https://firmadlakazdego.pl/regulamin/"
              target="_blank"
              rel="noopener"
              className="min-h-11 inline-flex items-center hover:text-white transition-colors"
            >
              Regulamin
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-lavender/20 text-xs text-lavender/60 text-center">
          &copy; {new Date().getFullYear()} Fundacja Firma Dla Każdego. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
