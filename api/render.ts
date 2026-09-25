// Serves the app shell for every page route with page-specific SEO, applies CMS
// redirects and returns a real 404 status for unknown paths.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { buildHeadHtml, injectIntoShell, resolveSeo, type PageKind } from '../shared/head.js';
import { BUILT_IN_REDIRECTS, UTM_KEYS, findRoute, normalizePath } from '../shared/site.js';
import { getMarketingSettings, getPublicContent, getRedirects, getSeoOverrides, getSiteSettings } from './_lib/content.js';
import { faqJsonLd } from '../shared/content.js';

// Pages that display the published FAQs (and so may carry FAQPage schema).
const FAQ_PAGES = new Set(['/consultation']);

type Req = IncomingMessage & { query?: Record<string, string | string[]> };

let shellCache: string | null = null;

async function loadShell(host: string | undefined): Promise<string> {
  if (shellCache) return shellCache;
  const candidates = [
    path.join(process.cwd(), 'dist', 'app-shell.html'),
    path.join(process.cwd(), 'app-shell.html'),
  ];
  for (const file of candidates) {
    try {
      shellCache = await readFile(file, 'utf8');
      return shellCache;
    } catch { /* try next */ }
  }
  if (!host) throw new Error('App shell not found');
  const response = await fetch(`https://${host}/app-shell.html`, { signal: AbortSignal.timeout(4000) });
  if (!response.ok) throw new Error(`App shell fetch failed: ${response.status}`);
  shellCache = await response.text();
  return shellCache;
}

function withCampaignParams(destination: string, incoming: URLSearchParams): string {
  const isInternal = destination.startsWith('/');
  const url = new URL(destination, 'https://placeholder.local');
  for (const key of UTM_KEYS) {
    const value = incoming.get(key);
    if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  return isInternal ? `${url.pathname}${url.search}${url.hash}` : url.toString();
}

export default async function handler(req: Req, res: ServerResponse) {
  const requestUrl = new URL(req.url || '/', 'https://placeholder.local');
  const rawPath = requestUrl.searchParams.get('__path') || requestUrl.pathname;
  requestUrl.searchParams.delete('__path');
  const pagePath = normalizePath(rawPath);

  const [site, marketing, seoMap, redirects] = await Promise.all([
    getSiteSettings(), getMarketingSettings(), getSeoOverrides(), getRedirects(),
  ]);

  let kind: PageKind;
  const route = findRoute(pagePath);
  if (pagePath === '/admin' || pagePath.startsWith('/admin/')) kind = 'admin';
  else {
    const builtIn = BUILT_IN_REDIRECTS[pagePath];
    const redirect = builtIn ? { destination: builtIn, code: 301 as const } : redirects.get(pagePath);
    if (redirect) {
      res.statusCode = redirect.code;
      res.setHeader('Location', withCampaignParams(redirect.destination, requestUrl.searchParams));
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
      res.end();
      return;
    }
    kind = route ? 'public' : 'not-found';
  }

  let shell: string;
  try {
    shell = await loadShell(req.headers.host);
  } catch (error) {
    console.error('[render] shell:', error instanceof Error ? error.message : error);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end('Cakeasy is briefly unavailable. Please refresh in a moment.');
    return;
  }

  const seo = resolveSeo({ path: pagePath, kind, route, override: seoMap[pagePath], site });
  if (kind === 'public' && FAQ_PAGES.has(pagePath)) {
    const faqSchema = faqJsonLd((await getPublicContent()).faqs);
    if (faqSchema) seo.jsonLd.push(faqSchema);
  }
  const html = injectIntoShell(shell, buildHeadHtml(seo, marketing), { site, marketing, seo: seoMap });

  res.statusCode = kind === 'not-found' ? 404 : 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (kind === 'admin') {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  } else {
    res.setHeader('Cache-Control', `public, max-age=0, s-maxage=${kind === 'not-found' ? 60 : 120}, stale-while-revalidate=600`);
  }
  res.end(html);
}
