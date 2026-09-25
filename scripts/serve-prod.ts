// Local stand-in for Vercel: serves dist/ and routes like vercel.json, using the real
// api/*.ts handlers. Run `npm run build` first, then `npm run serve:prod` (port 4173).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const PORT = Number(process.env.PORT || 4173);
const DIST = path.resolve('dist');
const TYPES: Record<string, string> = {
  '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.json': 'application/json',
};

type Handler = (req: unknown, res: unknown) => Promise<void> | void;
const handlers: Record<string, () => Promise<{ default: Handler }>> = {
  render: () => import('../api/render.ts'),
  sitemap: () => import('../api/sitemap.ts'),
  llms: () => import('../api/llms.ts'),
  enquiry: () => import('../api/enquiry.ts'),
  content: () => import('../api/content.ts'),
  instagram: () => import('../api/instagram.js') as Promise<{ default: Handler }>,
};

async function tryStatic(pathname: string) {
  const file = path.join(DIST, decodeURIComponent(pathname));
  if (!file.startsWith(DIST)) return null;
  try {
    if ((await stat(file)).isFile()) return file;
  } catch { /* not found */ }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const file = url.pathname === '/' ? null : await tryStatic(url.pathname);
  if (file) {
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
    return;
  }

  let name = 'render';
  if (url.pathname === '/sitemap.xml') name = 'sitemap';
  else if (url.pathname === '/llms.txt') name = 'llms';
  else if (url.pathname.startsWith('/api/')) name = url.pathname.slice(5);

  const load = handlers[name];
  if (!load) { res.statusCode = 404; res.end('Not found'); return; }
  if (name === 'render') {
    url.searchParams.set('__path', url.pathname);
    req.url = `/api/render?${url.searchParams.toString()}`;
  }
  // Vercel's Node helpers add res.status().json(); api/instagram.js uses them.
  const vres = res as typeof res & { status: (code: number) => typeof vres; json: (body: unknown) => void };
  vres.status = (code: number) => { res.statusCode = code; return vres; };
  vres.json = (body: unknown) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
  try {
    await (await load()).default(req, vres);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Handler crashed');
  }
}).listen(PORT, () => console.log(`Cakeasy production preview on http://localhost:${PORT}`));
