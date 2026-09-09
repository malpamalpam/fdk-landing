/**
 * Check that no [FDK...] placeholders appear in rendered landing HTML.
 * Usage: npx tsx scripts/check-placeholders.ts
 * Requires: npm run build to have been run first
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const LP_DIR = join(process.cwd(), '.next', 'server', 'app', 'lp');
const PATTERN = /\[FDK[:\s]/g;

function scanDir(dir: string): string[] {
  const issues: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return issues;
  }

  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      issues.push(...scanDir(full));
    } else if (entry.endsWith('.html') || entry.endsWith('.rsc')) {
      const content = readFileSync(full, 'utf-8');
      const matches = content.match(PATTERN);
      if (matches) {
        issues.push(`${full}: found ${matches.length} placeholder(s) — ${matches.slice(0, 3).join(', ')}`);
      }
    }
  }
  return issues;
}

const issues = scanDir(LP_DIR);

if (issues.length > 0) {
  console.error('❌ Found [FDK...] placeholders in rendered HTML:\n');
  issues.forEach((i) => console.error(`  ${i}`));
  process.exit(1);
} else {
  console.log('✅ No [FDK...] placeholders found in landing pages.');
}
