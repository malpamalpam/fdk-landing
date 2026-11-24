import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getPosts(site: string): Post[] {
  const dir = path.join(BLOG_DIR, site);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data, content } = matter(raw);
      const fm = data as PostFrontmatter;
      return {
        ...fm,
        content,
        readingTime: fm.readingTime ?? calculateReadingTime(content),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(site: string, slug: string): Post | null {
  const posts = getPosts(site);
  return posts.find((p) => p.slug === slug) ?? null;
}

export function getRelated(site: string, slug: string, max = 3): Post[] {
  const post = getPost(site, slug);
  if (!post) return [];
  const allPosts = getPosts(site).filter((p) => p.slug !== slug);

  // First try explicit related slugs
  if (post.related?.length) {
    const related = post.related
      .map((s) => allPosts.find((p) => p.slug === s))
      .filter(Boolean) as Post[];
    if (related.length >= max) return related.slice(0, max);
    // Fill rest with tag matches
    const remaining = allPosts.filter((p) => !post.related!.includes(p.slug));
    const tagMatches = remaining
      .map((p) => ({ post: p, score: p.tags.filter((t) => post.tags.includes(t)).length }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((m) => m.post);
    return [...related, ...tagMatches].slice(0, max);
  }

  // Fallback: tag overlap
  return allPosts
    .map((p) => ({ post: p, score: p.tags.filter((t) => post.tags.includes(t)).length }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((m) => m.post)
    .slice(0, max);
}
