/**
 * Run: node scripts/compress-hero-kontrakt.mjs
 * Requires: npx sharp (or npm i -D sharp first)
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const src = 'C:/Users/gstep/Desktop/Landing 3/src/imports/Projekt_bez_nazwy.png';
const dst = resolve(root, 'public/img/kontrakt/hero.webp');

mkdirSync(dirname(dst), { recursive: true });

const info = await sharp(src)
  .resize(1200)
  .webp({ quality: 78 })
  .toFile(dst);

console.log(`✓ hero.webp — ${(info.size / 1024).toFixed(0)} KB (${info.width}×${info.height})`);
