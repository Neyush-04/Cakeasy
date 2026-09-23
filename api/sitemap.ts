import type { IncomingMessage, ServerResponse } from 'node:http';
import { escapeHtml } from '../shared/head.js';
import { PUBLIC_ROUTES, SITE_ORIGIN, absoluteUrl } from '../shared/site.js';
import { getRedirects, getSeoOverrides } from './_lib/content.js';

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  const [seoMap, redirects] = await Promise.all([getSeoOverrides(), getRedirects()]);

  const urls = PUBLIC_ROUTES.filter((route) => {
    const override = seoMap[route.path];
    if (redirects.has(route.path)) return false;
    if ((override?.index ?? route.index) === false) return false;
    // A page that points its canonical elsewhere is not the page to list.
    if (override?.canonical && absoluteUrl(override.canonical).replace(/\/$/, '') !== `${SITE_ORIGIN}${route.path}`.replace(/\/$/, '')) return false;
    return true;
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((route) => [
      '  <url>',
      `    <loc>${escapeHtml(absoluteUrl(route.path))}</loc>`,
      route.changefreq ? `    <changefreq>${route.changefreq}</changefreq>` : '',
      route.priority !== undefined ? `    <priority>${route.priority.toFixed(1)}</priority>` : '',
      '  </url>',
    ].filter(Boolean).join('\n')),
    '</urlset>',
  ].join('\n');

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600');
  res.end(body);
}
