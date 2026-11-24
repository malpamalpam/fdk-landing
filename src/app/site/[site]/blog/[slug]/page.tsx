import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { SITES } from '@/config/sites';
import { getSiteContent, VALID_SITES } from '@/content/sites';
import { getPosts, getPost, getRelated } from '@/lib/blog';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import SiteConsentBanner from '@/components/site/SiteConsentBanner';
import BlogPostCard from '@/components/site/blog/BlogPostCard';
import { Cta, Note, mdxComponents } from '@/components/site/blog/MdxComponents';
import Link from 'next/link';

export function generateStaticParams() {
  return VALID_SITES.flatMap((site) =>
    getPosts(site).map((post) => ({ site, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string; slug: string }>;
}): Promise<Metadata> {
  const { site, slug } = await params;
  const post = getPost(site, slug);
  const config = SITES[site as keyof typeof SITES];
  if (!post || !config) return {};

  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isVercel = host.includes('vercel.app') || host.includes('localhost');
  const url = `https://${config.domains[0]}/blog/${slug}`;

  return {
    metadataBase: new URL(`https://${config.domains[0]}`),
    title: `${post.title} | ${config.ogSiteName}`,
    description: post.description,
    alternates: { canonical: isVercel ? undefined : url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      ...(post.updated && { modifiedTime: post.updated }),
      authors: ['Grzegorz Stepien'],
      locale: config.ogLocale,
      siteName: config.ogSiteName,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
    robots: isVercel ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ site: string; slug: string }>;
}) {
  const { site, slug } = await params;
  const post = getPost(site, slug);
  const content = getSiteContent(site);
  const config = SITES[site as keyof typeof SITES];
  if (!post || !content || !config) return notFound();

  const related = getRelated(site, slug);
  const dateStr = new Date(post.date).toLocaleDateString(
    config.htmlLang === 'pl' ? 'pl-PL' : config.htmlLang === 'ru' ? 'ru-RU' : 'en-GB',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  // JSON-LD
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      ...(post.updated && { dateModified: post.updated }),
      author: { '@type': 'Person', name: 'Grzegorz Stepien' },
      publisher: {
        '@type': 'Organization',
        name: 'Fundacja Firma Dla Kazdego',
        url: `https://${config.domains[0]}`,
      },
      mainEntityOfPage: `https://${config.domains[0]}/blog/${slug}`,
      inLanguage: config.htmlLang,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: content.blog.breadcrumbHome, item: `https://${config.domains[0]}` },
        { '@type': 'ListItem', position: 2, name: content.blog.breadcrumbBlog, item: `https://${config.domains[0]}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title },
      ],
    },
    ...(post.faq?.length ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }] : []),
  ];

  // Components with site-specific props injected
  const components = {
    ...mdxComponents,
    Cta: () => (
      <Cta
        site={site}
        slug={slug}
        title={content.blog.ctaTitle}
        text={content.blog.ctaText}
        button={content.blog.ctaButton}
        formId="#kontakt"
      />
    ),
    Note,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader content={content} phone={config.phone} />
      <main id="main" className="pt-24 pb-16">
        <article className="max-w-[72ch] mx-auto px-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-muted mb-6">
            <Link href="/" className="hover:text-navy transition-colors">{content.blog.breadcrumbHome}</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/blog" className="hover:text-navy transition-colors">{content.blog.breadcrumbBlog}</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-navy line-clamp-1">{post.title}</span>
          </nav>

          {/* Header */}
          <h1 className="text-navy font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-muted text-sm mb-8">
            <span>Grzegorz Stepien</span>
            <span>&middot;</span>
            <time dateTime={post.date}>{dateStr}</time>
            <span>&middot;</span>
            <span>{content.blog.readingTime.replace('{n}', String(post.readingTime))}</span>
          </div>

          {/* MDX Content */}
          <div className="blog-content">
            <MDXRemote source={post.content} components={components} />
          </div>

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="text-navy font-bold text-xl mb-6">FAQ</h2>
              <div className="space-y-3">
                {post.faq.map((item, i) => (
                  <details key={item.q} name="post-faq" {...(i === 0 ? { open: true } : {})} className="group bg-surfaceSite rounded-card-site overflow-hidden">
                    <summary className="cursor-pointer px-5 py-4 flex items-center justify-between text-navy font-medium text-sm hover:bg-surfaceAlt transition-colors list-none [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span className="text-lime text-lg ml-3 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <div className="px-5 pb-4 text-muted text-sm leading-relaxed">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Author */}
          <div className="mt-12 bg-surfaceSite rounded-card-site p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0">
              <span className="text-navy font-bold text-sm">GS</span>
            </div>
            <p className="text-muted text-sm leading-relaxed">{content.blog.authorBio}</p>
          </div>

          {/* Back to list */}
          <div className="mt-8">
            <Link href="/blog" className="text-navy font-medium text-sm hover:text-lime transition-colors">
              {content.blog.backToList}
            </Link>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 mt-16">
            <h2 className="text-navy font-bold text-xl mb-6">{content.blog.relatedTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <BlogPostCard
                  key={r.slug}
                  post={r}
                  readMore={content.blog.readMore}
                  readingTimeLabel={content.blog.readingTime}
                  publishedLabel={content.blog.publishedOn}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter content={content} phone={config.phone} />
      <SiteConsentBanner content={content} />
    </>
  );
}
