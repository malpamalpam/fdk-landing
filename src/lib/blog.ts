import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import blogIndex from '@/content/blog/index.json';

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  readingTime: number;
}

export interface PostFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  updated?: string;
  author: 'Grzegorz Stępień';
  readingTime?: number;
  tags: string[];
  keywords: string[];
  faq?: { q: string; a: string }[];
  related?: string[];
}

export interface Post extends PostFrontmatter {
  content: string;
  readingTime: number;
}

const typedIndex = blogIndex as Record<string, PostMeta[]>;

/**
 * Returns post metadata from the pre-built index.json.
 * No fs calls — safe for runtime (serverless, sitemap).
 */
export function getPosts(site: string): PostMeta[] {
  return typedIndex[site] ?? [];
}

/**
 * Reads a single post's full content from MDX via fs.
 * Only called during build (generateStaticParams / static rendering).
 */
export function getPost(site: string, slug: string): Post | null {
  const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
  const dir = path.join(BLOG_DIR, site);
  const filePath = path.join(dir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    console.error(`[blog] File not found: ${filePath}`);
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  const words = content.trim().split(/\s+/).length;
  const readingTime = fm.readingTime ?? Math.max(1, Math.ceil(words / 200));

  return { ...fm, content, readingTime };
}

/**
 * Returns related posts (metadata only) for a given slug.
 * Uses index.json for listing + reads frontmatter of target post for `related` field.
 */
export function getRelated(site: string, slug: string, max = 3): PostMeta[] {
  const post = getPost(site, slug);
  if (!post) return [];

  const allPosts = getPosts(site).filter((p) => p.slug !== slug);

  if (post.related?.length) {
    const related = post.related
      .map((s) => allPosts.find((p) => p.slug === s))
      .filter(Boolean) as PostMeta[];
    if (related.length >= max) return related.slice(0, max);

    const remaining = allPosts.filter((p) => !post.related!.includes(p.slug));
    const tagMatches = remaining
      .map((p) => ({ post: p, score: p.tags.filter((t) => post.tags.includes(t)).length }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((m) => m.post);
    return [...related, ...tagMatches].slice(0, max);
  }

  return allPosts
    .map((p) => ({ post: p, score: p.tags.filter((t) => post.tags.includes(t)).length }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((m) => m.post)
    .slice(0, max);
}
