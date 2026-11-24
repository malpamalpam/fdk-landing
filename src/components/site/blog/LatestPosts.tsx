import Link from 'next/link';
import { getPosts } from '@/lib/blog';
import BlogPostCard from './BlogPostCard';

export default function LatestPosts({
  site,
  blogTitle,
  readMore,
  readingTimeLabel,
  publishedLabel,
  navLabel,
}: {
  site: string;
  blogTitle: string;
  readMore: string;
  readingTimeLabel: string;
  publishedLabel: string;
  navLabel: string;
}) {
  const posts = getPosts(site).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="latest-posts-heading" className="bg-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 id="latest-posts-heading" className="text-navy font-bold text-2xl lg:text-3xl">{blogTitle}</h2>
          <Link href="/blog" className="text-navy font-medium text-sm hover:text-lime transition-colors hidden sm:inline-flex items-center gap-1">
            {navLabel} →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard
              key={post.slug}
              post={post}
              readMore={readMore}
              readingTimeLabel={readingTimeLabel}
              publishedLabel={publishedLabel}
            />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/blog" className="text-navy font-medium text-sm hover:text-lime transition-colors">
            {navLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
