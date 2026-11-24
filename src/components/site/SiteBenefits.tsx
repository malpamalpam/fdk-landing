import type { SiteContent } from '@/content/site-types';
import SiteIcon from './SiteIcon';

export default function SiteBenefits({ data }: { data: SiteContent['benefits'] }) {
  return (
    <section aria-labelledby="benefits-heading" className="bg-navy py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 id="benefits-heading" className="text-white font-bold text-2xl lg:text-3xl text-center mb-10">{data.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.title}
              className="bg-navySoft rounded-card-site p-6"
            >
              <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center mb-4">
                <SiteIcon name={item.icon} className="w-5 h-5 text-lime" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
              <p className="text-lavender text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
