import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { SITES } from '@/config/sites';
import { getSiteContent, VALID_SITES } from '@/content/sites';
import { getPosts } from '@/lib/blog';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import SiteConsentBanner from '@/components/site/SiteConsentBanner';
import BlogPostCard from '@/components/site/blog/BlogPostCard';
import Link from 'next/link';

export function generateStaticParams() {
  return VALID_SITES.map((site) => ({ site }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>;
}): Promise<Metadata> {
  const { site } = await params;
  const content = getSiteContent(site);
  const config = SITES[site as keyof typeof SITES];
  if (!content || !config) return {};

  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isVercel = host.includes('vercel.app') || host.includes('localhost');

  return {
    metadataBase: new URL(`https://${config.domains[0]}`),
    title: `${content.blog.title} | ${config.ogSiteName}`,
    description: content.blog.lead,
    alternates: { canonical: isVercel ? undefined : `https://${config.domains[0]}/blog` },
    openGraph: {
      title: content.blog.title,
      description: content.blog.lead,
      url: `https://${config.domains[0]}/blog`,
      type: 'website',
      locale: config.ogLocale,
      siteName: config.ogSiteName,
    },
    twitter: { card: 'summary_large_image', title: content.blog.title, description: content.blog.lead },
    robots: isVercel ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const content = getSiteContent(site);
  const config = SITES[site as keyof typeof SITES];
  if (!content || !config) return notFound();

  const posts = getPosts(site);

  // JSON-LD Blog
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: content.blog.title,
    description: content.blog.lead,
    url: `https://${config.domains[0]}/blog`,
    inLanguage: config.htmlLang,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://${config.domains[0]}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader content={content} phone={config.phone} />
      <main id="main" className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-muted mb-6">
            <Link href="/" className="hover:text-navy transition-colors">{content.blog.breadcrumbHome}</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-navy">{content.blog.breadcrumbBlog}</span>
          </nav>

          <h1 className="text-navy font-bold text-3xl lg:text-4xl mb-4">{content.blog.title}</h1>
          <p className="text-muted text-lg leading-relaxed mb-10 max-w-2xl">{content.blog.lead}</p>

          {posts.length === 0 ? (
            <p className="text-muted">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <BlogPostCard
                  key={post.slug}
                  post={post}
                  readMore={content.blog.readMore}
                  readingTimeLabel={content.blog.readingTime}
                  publishedLabel={content.blog.publishedOn}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter content={content} phone={config.phone} />
      <SiteConsentBanner content={content} />
    </>
  );
}
