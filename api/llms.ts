// Plain-text summary for AI assistants and answer engines. Facts only, drawn from site settings.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { PUBLIC_ROUTES, absoluteUrl } from '../shared/site.js';
import { getSeoOverrides, getSiteSettings } from './_lib/content.js';

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  const [site, seoMap] = await Promise.all([getSiteSettings(), getSeoOverrides()]);
  const pages = PUBLIC_ROUTES.filter((route) => (seoMap[route.path]?.index ?? route.index) !== false);

  const lines = [
    '# Cakeasy',
    '',
    '> Cakeasy is a premium cake boutique founded by baker Neha Chaudhary. It creates bespoke wedding and designer cakes, plus birthday, bento and other celebration cakes. It began in Lucknow in 2021 and now works from Greater Noida, serving Delhi NCR.',
    '',
    '## How to order',
    `- Orders and custom cake enquiries are handled on WhatsApp: https://wa.me/${site.whatsappNumber}`,
    '- There is no online checkout. Design, price, pickup or delivery are confirmed directly with Cakeasy before an order is accepted.',
    `- Consultation brief: ${absoluteUrl('/consultation')}`,
    '',
    '## Contact',
    `- Phone / WhatsApp: ${site.phoneDisplay}`,
    site.email ? `- Email: ${site.email}` : '',
    `- Boutique: ${site.address}`,
    site.instagramUrl ? `- Instagram: ${site.instagramUrl}` : '',
    '',
    '## Pages',
    ...pages.map((route) => `- [${seoMap[route.path]?.title || route.title}](${absoluteUrl(route.path)}): ${seoMap[route.path]?.description || route.description}`),
  ];

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600');
  res.end(lines.filter((line, i, all) => !(line === '' && all[i - 1] === '')).join('\n') + '\n');
}
