import type { SiteContent } from '@/content/site-types';
import SiteIcon from './SiteIcon';

export default function SiteForWho({ data }: { data: SiteContent['who'] }) {
  return (
    <section className="bg-surfaceSite py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-navy font-bold text-2xl lg:text-3xl text-center mb-10">{data.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-card-site p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center mb-4">
                <SiteIcon name={item.icon} className="w-5 h-5 text-navy" />
              </div>
              <h3 className="text-navy font-bold text-base mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
