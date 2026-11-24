'use client';

import { track } from '@/lib/track';
import { ArrowRight, Info } from 'lucide-react';

export function Cta({ site, slug, title, text, button, formId }: {
  site: string;
  slug: string;
  title: string;
  text: string;
  button: string;
  formId: string;
}) {
  return (
    <div className="my-8 bg-surfaceSite rounded-card-site p-6 md:p-8 border border-lime/20">
      <h3 className="text-navy font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted text-sm mb-4">{text}</p>
      <a
        href={`/${formId}`}
        onClick={() => track('blog_cta_click', { site, slug })}
        className="inline-flex items-center gap-2 bg-lime text-navy font-bold text-sm px-6 py-3 rounded-pill hover:bg-limeSoft transition-colors"
      >
        {button}
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 bg-surfaceSite rounded-card-site p-5 flex gap-3 border border-lavender/20">
      <Info className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
      <div className="text-muted text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// Standard HTML element overrides for MDX
export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className="text-navy font-bold text-xl md:text-2xl mt-10 mb-4 pb-2 border-b-2 border-lime/30 w-fit" />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="text-navy font-bold text-lg mt-8 mb-3" />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="text-navy/80 text-[17px] leading-[1.7] font-light mb-4" />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="text-navy/80 text-[17px] leading-[1.7] font-light mb-4 ml-6 list-none space-y-1.5 [&>li]:relative [&>li]:pl-5 [&>li]:before:content-['•'] [&>li]:before:text-lime [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:font-bold" />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="text-navy/80 text-[17px] leading-[1.7] font-light mb-4 ml-6 list-decimal space-y-1.5 marker:text-lime marker:font-bold" />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table {...props} className="w-full text-sm border-collapse [&_th]:bg-surfaceSite [&_th]:text-navy [&_th]:font-bold [&_th]:text-left [&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-t [&_td]:border-gray-100 [&_td]:text-navy/80" />
    </div>
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote {...props} className="my-6 pl-5 border-l-4 border-lime/40 italic text-muted text-[17px] leading-[1.7]" />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = props.href?.startsWith('http');
    return (
      <a
        {...props}
        className="text-navy font-medium underline decoration-lime/50 hover:decoration-lime transition-colors"
        {...(isExternal ? { target: '_blank', rel: 'noopener' } : {})}
      />
    );
  },
};
