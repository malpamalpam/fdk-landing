import { Phone, Mail } from 'lucide-react';
import type { SiteContent } from '@/content/site-types';

export default function SiteContact({
  content,
  phone,
  formSlot,
}: {
  content: SiteContent;
  phone: string;
  formSlot: React.ReactNode;
}) {
  return (
    <section id="kontakt" className="bg-surfaceSite py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <div className="bg-white rounded-card-site p-6 lg:p-8 shadow-sm">
          <h2 className="text-navy font-bold text-xl mb-5">{content.hero.formTitle}</h2>
          {formSlot}
        </div>

        {/* Contact info */}
        <div className="flex flex-col justify-center gap-6">
          <div>
            <h3 className="text-navy font-bold text-lg mb-2">
              {content.site === 'tutors' ? 'Get in touch' : content.site === 'creative' ? 'Контакты' : 'Dane kontaktowe'}
            </h3>
            <p className="text-muted text-sm">
              Fundacja Firma Dla Każdego<br />
              ul. Lwowska 17/4, 00-660 Warszawa<br />
              NIP: 5252625624
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 text-navy hover:text-lime transition-colors font-medium"
            >
              <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center">
                <Phone className="w-5 h-5 text-navy" />
              </div>
              {phone}
            </a>
            <a
              href="mailto:kontakt@firmadlakazdego.pl"
              className="flex items-center gap-3 text-navy hover:text-lime transition-colors font-medium"
            >
              <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center">
                <Mail className="w-5 h-5 text-navy" />
              </div>
              kontakt@firmadlakazdego.pl
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
