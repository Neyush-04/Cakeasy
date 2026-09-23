// Builds the SEO <head> block and the runtime payload injected into every page.
import {
  DEFAULT_OG_IMAGE, GA4_ID_PATTERN, META_PIXEL_PATTERN, SITE_NAME, SITE_ORIGIN, VERIFICATION_TOKEN_PATTERN,
  absoluteUrl, type MarketingSettings, type PublicRuntime, type RouteSeo, type SeoRecord, type SiteSettings,
} from './site.js';

export type PageKind = 'public' | 'landing' | 'admin' | 'not-found';

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  jsonLd: unknown[];
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// JSON inside <script> must not be able to close the tag.
export function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function sameSiteCanonical(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  try {
    const url = new URL(value, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN) return fallback;
    url.hash = '';
    return url.toString();
  } catch {
    return fallback;
  }
}

export function parseJsonLd(raw: string | undefined): unknown[] {
  if (!raw || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    return items.filter((item) => item && typeof item === 'object' && ('@type' in item || '@graph' in item));
  } catch {
    return [];
  }
}

export function businessJsonLd(site: SiteSettings): Record<string, unknown> {
  const sameAs = [site.instagramUrl, site.facebookUrl, site.youtubeUrl, site.pinterestUrl, site.googleBusinessUrl].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': `${SITE_ORIGIN}/#bakery`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    logo: absoluteUrl('/favicon.png'),
    telephone: site.whatsappNumber ? `+${site.whatsappNumber}` : undefined,
    email: site.email || undefined,
    founder: { '@type': 'Person', name: 'Neha Chaudhary' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.addressStreet,
      addressLocality: site.addressLocality,
      addressRegion: site.addressRegion,
      postalCode: site.postalCode,
      addressCountry: 'IN',
    },
    areaServed: ['Greater Noida', 'Noida', 'Delhi NCR'],
    servesCuisine: 'Cakes & Desserts',
    priceRange: '₹₹',
    sameAs,
  };
}

export function resolveSeo(options: {
  path: string;
  kind: PageKind;
  route?: RouteSeo;
  override?: Partial<SeoRecord> | null;
  site: SiteSettings;
}): ResolvedSeo {
  const { path, kind, route, override, site } = options;
  const canonicalFallback = absoluteUrl(path === '/' ? '/' : path);

  if (kind === 'admin') {
    return {
      title: 'Cakeasy CMS', description: 'Cakeasy content management.', canonical: canonicalFallback,
      robots: 'noindex, nofollow', ogTitle: 'Cakeasy CMS', ogDescription: '', ogImage: absoluteUrl(DEFAULT_OG_IMAGE), jsonLd: [],
    };
  }
  if (kind === 'not-found') {
    return {
      title: 'Page not found | Cakeasy', description: 'This page could not be found. Explore Cakeasy wedding, designer and celebration cakes.',
      canonical: canonicalFallback, robots: 'noindex, follow', ogTitle: 'Cakeasy', ogDescription: '', ogImage: absoluteUrl(DEFAULT_OG_IMAGE), jsonLd: [],
    };
  }

  const title = override?.title || route?.title || SITE_NAME;
  const description = override?.description || route?.description || '';
  const index = override?.index ?? route?.index ?? true;
  const follow = override?.follow ?? true;
  const pageJsonLd = parseJsonLd(override?.jsonLd);

  return {
    title,
    description,
    canonical: sameSiteCanonical(override?.canonical, canonicalFallback),
    robots: `${index ? 'index' : 'noindex'}, ${follow ? 'follow' : 'nofollow'}${index ? ', max-image-preview:large' : ''}`,
    ogTitle: override?.ogTitle || title,
    ogDescription: override?.ogDescription || description,
    ogImage: absoluteUrl(override?.ogImage || DEFAULT_OG_IMAGE),
    jsonLd: path === '/' ? [businessJsonLd(site), websiteJsonLd(), ...pageJsonLd] : [businessJsonLd(site), ...pageJsonLd],
  };
}

function websiteJsonLd() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: SITE_NAME, url: `${SITE_ORIGIN}/`, publisher: { '@id': `${SITE_ORIGIN}/#bakery` } };
}

export function buildHeadHtml(seo: ResolvedSeo, marketing: MarketingSettings): string {
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="robots" content="${seo.robots}" />`,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />`,
    `<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />`,
  ];
  if (VERIFICATION_TOKEN_PATTERN.test(marketing.googleSiteVerification)) {
    tags.push(`<meta name="google-site-verification" content="${marketing.googleSiteVerification}" />`);
  }
  if (VERIFICATION_TOKEN_PATTERN.test(marketing.bingSiteVerification)) {
    tags.push(`<meta name="msvalidate.01" content="${marketing.bingSiteVerification}" />`);
  }
  for (const item of seo.jsonLd) tags.push(`<script type="application/ld+json">${safeJson(item)}</script>`);
  return tags.join('\n    ');
}

export function sanitizeMarketing(marketing: Partial<MarketingSettings>): MarketingSettings {
  const ga4 = String(marketing.ga4MeasurementId || '').trim().toUpperCase();
  const pixel = String(marketing.metaPixelId || '').trim();
  return {
    ga4MeasurementId: GA4_ID_PATTERN.test(ga4) ? ga4 : '',
    metaPixelId: META_PIXEL_PATTERN.test(pixel) ? pixel : '',
    googleSiteVerification: String(marketing.googleSiteVerification || '').trim(),
    bingSiteVerification: String(marketing.bingSiteVerification || '').trim(),
  };
}

export function injectIntoShell(shell: string, headHtml: string, runtime: PublicRuntime): string {
  const runtimeScript = `<script>window.__CAKEASY__=${safeJson(runtime)};</script>`;
  const start = shell.indexOf('<!--seo:start-->');
  const end = shell.indexOf('<!--seo:end-->');
  let html = start >= 0 && end > start
    ? `${shell.slice(0, start)}<!--seo:start-->\n    ${headHtml}\n    <!--seo:end-->${shell.slice(end + '<!--seo:end-->'.length)}`
    : shell.replace('</head>', `    ${headHtml}\n  </head>`);
  html = html.replace('</head>', `    ${runtimeScript}\n  </head>`);
  return html;
}
