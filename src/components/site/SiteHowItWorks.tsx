import type { SiteContent } from '@/content/site-types';

export default function SiteHowItWorks({ data }: { data: SiteContent['how'] }) {
  return (
    <section aria-labelledby="how-heading" className="bg-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 id="how-heading" className="text-navy font-bold text-2xl lg:text-3xl text-center mb-10">{data.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {data.steps.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="w-12 h-12 rounded-full bg-lime text-navy font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="text-navy font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
