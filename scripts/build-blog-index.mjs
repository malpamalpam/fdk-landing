/**
 * Pre-build script: generates src/content/blog/index.json
 * with frontmatter for all blog posts (no fs reads at runtime).
 * Run: node scripts/build-blog-index.mjs
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');
const OUTPUT = path.join(BLOG_DIR, 'index.json');

function calculateReadingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const sites = ['general', 'tutors', 'creative'];
const index = {};

for (const site of sites) {
  const dir = path.join(BLOG_DIR, site);
  if (!fs.existsSync(dir)) {
    index[site] = [];
    continue;
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    posts.push({
      slug: data.slug,
      title: data.title,
      description: data.description,
      date: data.date,
      ...(data.updated && { updated: data.updated }),
      tags: data.tags || [],
      readingTime: data.readingTime ?? calculateReadingTime(content),
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  index[site] = posts;
}

fs.writeFileSync(OUTPUT, JSON.stringify(index, null, 2), 'utf-8');

const total = Object.values(index).reduce((s, p) => s + p.length, 0);
console.log(`[build-blog-index] ${OUTPUT}`);
for (const [site, posts] of Object.entries(index)) {
  console.log(`  ${site}: ${posts.length} posts`);
}
console.log(`  Total: ${total}`);
