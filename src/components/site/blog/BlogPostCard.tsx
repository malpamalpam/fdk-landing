import Link from 'next/link';
import type { PostMeta } from '@/lib/blog';

export default function BlogPostCard({
  post,
  readMore,
  readingTimeLabel,
  publishedLabel,
}: {
  post: PostMeta;
  readMore: string;
  readingTimeLabel: string;
  publishedLabel: string;
}) {
  const dateStr = new Date(post.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-white rounded-card-site p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center gap-3 text-muted text-xs mb-3">
        <time dateTime={post.date}>{dateStr}</time>
        <span>·</span>
        <span>{readingTimeLabel.replace('{n}', String(post.readingTime))}</span>
      </div>
      <h2 className="text-navy font-bold text-lg mb-2 line-clamp-2">
        <Link href={`/blog/${post.slug}`} className="hover:text-lime transition-colors">
          {post.title}
        </Link>
      </h2>
      <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">{post.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs bg-surfaceSite text-navy px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/blog/${post.slug}`}
        className="text-navy font-medium text-sm hover:text-lime transition-colors"
      >
        {readMore} →
      </Link>
    </article>
  );
}
