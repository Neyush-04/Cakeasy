// After `vite build`: rename dist/index.html to dist/app-shell.html so that every page
// request (including "/") goes through api/render.ts, which adds page-specific SEO.
import { existsSync, renameSync, readFileSync } from 'node:fs';

const from = 'dist/index.html';
const to = 'dist/app-shell.html';

if (!existsSync(from)) {
  console.error(`finalize-build: ${from} not found`);
  process.exit(1);
}
const html = readFileSync(from, 'utf8');
if (!html.includes('<!--seo:start-->') || !html.includes('<!--seo:end-->')) {
  console.error('finalize-build: SEO markers missing from index.html');
  process.exit(1);
}
renameSync(from, to);
console.log(`finalize-build: ${from} -> ${to}`);
