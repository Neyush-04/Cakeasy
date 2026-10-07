// Shared by the browser bundle and the Vercel functions in /api.
// Keep this file free of browser/Node-only APIs.

export const SITE_ORIGIN = 'https://www.cakeasy.in';
export const SITE_NAME = 'Cakeasy';
export const DEFAULT_OG_IMAGE = '/gallery/1/img1.jpg';

export const FIREBASE_PROJECT_ID = 'gen-lang-client-0442655314';
export const FIRESTORE_DATABASE_ID = 'ai-studio-cakeasy-d3f45449-f679-491a-bb46-52a2d38aeb77';
// Public web API key (already shipped to browsers in firebase-applet-config.json).
export const FIREBASE_WEB_API_KEY = 'AIzaSyAvMyWtjqcIlzbMMPjuHHMXOoG9I4uarck';

// The account that can always sign in to the CMS, even before any users exist.
// Mirrored in firestore.rules and storage.rules.
export const BOOTSTRAP_OWNER_EMAIL = 'pixiforu@gmail.com';

export interface SiteSettings {
  whatsappNumber: string;
  phoneDisplay: string;
  email: string;
  address: string;
  // Structured address for search engines (LocalBusiness schema).
  addressStreet: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  youtubeUrl: string;
  pinterestUrl: string;
  googleBusinessUrl: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  whatsappNumber: '918810795004',
  phoneDisplay: '+91 88107 95004',
  email: 'cakeasy94@gmail.com',
  address: 'Cakeasy, 4C-601, AWHO, Gr. Noida, Delhi NCR, 201310',
  addressStreet: '4C-601, AWHO',
  addressLocality: 'Greater Noida',
  addressRegion: 'Uttar Pradesh',
  postalCode: '201310',
  instagramUrl: 'https://www.instagram.com/cakeasy99/',
  instagramHandle: '@cakeasy99',
  facebookUrl: '',
  youtubeUrl: '',
  pinterestUrl: '',
  googleBusinessUrl: '',
};

export interface MarketingSettings {
  ga4MeasurementId: string;
  metaPixelId: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  metaDomainVerification: string;
}

export const DEFAULT_MARKETING_SETTINGS: MarketingSettings = {
  ga4MeasurementId: '',
  metaPixelId: '',
  googleSiteVerification: '',
  bingSiteVerification: '',
  metaDomainVerification: '',
};

export const GA4_ID_PATTERN = /^G-[A-Z0-9]{4,16}$/;
export const META_PIXEL_PATTERN = /^\d{8,20}$/;
export const VERIFICATION_TOKEN_PATTERN = /^[A-Za-z0-9_\-]{8,120}$/;

export interface SeoRecord {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  index: boolean;
  follow: boolean;
  jsonLd: string;
}

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  index: boolean;
  changefreq?: 'weekly' | 'monthly';
  priority?: number;
}

// From the Google Business Profile (Oct 2026). Shown on the site and in schema.
export const OPENING_HOURS: { days: string; dayCodes: string[]; opens: string; closes: string }[] = [
  { days: 'Monday to Friday', dayCodes: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '12:00', closes: '18:00' },
  { days: 'Saturday', dayCodes: ['Saturday'], opens: '09:00', closes: '19:00' },
];
export const CLOSED_DAYS = 'Sunday';
export const GEO = { latitude: 28.4484242, longitude: 77.5122827 };
export const AREAS_SERVED = ['Greater Noida', 'Noida', 'Delhi NCR'];

export function hoursText(): string {
  const fmt = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return `${((h + 11) % 12) + 1}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'am' : 'pm'}`;
  };
  return [...OPENING_HOURS.map((slot) => `${slot.days}: ${fmt(slot.opens)} – ${fmt(slot.closes)}`), `${CLOSED_DAYS}: closed`].join(' · ');
}

// Built-in SEO for every public route. The CMS can override any of these per path.
export const PUBLIC_ROUTES: RouteSeo[] = [
  {
    path: '/',
    title: 'Cakeasy | Premium Cake Boutique in Greater Noida',
    description: "Neha Chaudhary's premium cake boutique: bespoke, 100% eggless wedding, designer and celebration cakes, designed around your story. Greater Noida, Delhi NCR.",
    index: true, changefreq: 'weekly', priority: 1.0,
  },
  {
    path: '/weddings',
    title: 'Wedding & Milestone Cakes | Cakeasy',
    description: 'Bespoke cakes for engagements, weddings and anniversaries, designed around your venue, palette, outfits, flowers and story.',
    index: true, changefreq: 'monthly', priority: 0.9,
  },
  {
    path: '/cakes/designer',
    title: 'Designer Cakes | Cakeasy',
    description: 'Sculpted, themed, floral, hobby-led and story-based cakes. Single-tier and multi-tier designs belong here when the idea is the hero.',
    index: true, changefreq: 'monthly', priority: 0.8,
  },
  {
    path: '/cakes/engagement',
    title: 'Engagement Cakes | Cakeasy',
    description: 'Elegant multi-tier and couple-led cakes with florals, ring details, custom colours and finishes coordinated to the engagement decor.',
    index: true, changefreq: 'monthly', priority: 0.8,
  },
  {
    path: '/cakes/anniversary',
    title: 'Anniversary Cakes | Cakeasy',
    description: 'Romantic single-tier and multi-tier cakes for milestones, surprises and the small private celebrations that deserve something personal.',
    index: true, changefreq: 'monthly', priority: 0.7,
  },
  {
    path: '/cakes/birthday',
    title: 'Birthday Cakes | Cakeasy',
    description: 'Kid themes, adult milestones, professions, hobbies and luxury birthday designs, from intimate cakes to statement tiers.',
    index: true, changefreq: 'monthly', priority: 0.7,
  },
  {
    path: '/cakes/bento',
    title: 'Bento Cakes | Cakeasy',
    description: 'Small designer cakes for intimate celebrations, desk surprises, date nights and thoughtful gifting. Curated designs with room for a personal message.',
    index: true, changefreq: 'monthly', priority: 0.7,
  },
  {
    path: '/cakes/cupcakes',
    title: 'Cupcakes | Cakeasy',
    description: 'Giftable cupcake boxes for birthdays, office celebrations, dessert tables and wedding favours, finished to match the occasion.',
    index: true, changefreq: 'monthly', priority: 0.5,
  },
  {
    path: '/cakes/pastries',
    title: 'Pastries | Cakeasy',
    description: 'A supporting range for repeat orders, gifting and everyday celebrations. Elegant, fresh and easy to order through WhatsApp.',
    index: true, changefreq: 'monthly', priority: 0.5,
  },
  {
    path: '/cakes/dessert-boxes',
    title: 'Dessert Boxes | Cakeasy',
    description: 'Dessert boxes and cake pairings for intimate gatherings, return gifts, corporate celebrations and thoughtful surprises.',
    index: true, changefreq: 'monthly', priority: 0.5,
  },
  {
    path: '/catalog',
    title: 'Our Cakes | Cakeasy Catalogue: Bento, Wedding & Celebration Cakes',
    description: "Browse Cakeasy's eggless bento, wedding and celebration cakes and cupcakes. Custom flavours and designs, handcrafted to order in Greater Noida.",
    index: true, changefreq: 'weekly', priority: 0.8,
  },
  {
    path: '/custom',
    title: 'Custom Cake Simulator | Cakeasy',
    description: 'Design your own custom cake with Cakeasy: choose shape, size, flavour and finish, add an inspiration photo, and send the brief on WhatsApp.',
    index: true, changefreq: 'monthly', priority: 0.7,
  },
  {
    path: '/gallery',
    title: 'Cake Gallery | Cakeasy Story Since 2021',
    description: 'See real cakes handcrafted by Cakeasy since 2021: wedding, designer, birthday and bento cakes from Lucknow to Greater Noida.',
    index: true, changefreq: 'weekly', priority: 0.8,
  },
  {
    path: '/about',
    title: 'Our Story | Neha Chaudhary & Cakeasy',
    description: 'Meet Neha Chaudhary, founder and baker of Cakeasy, and the journey from Lucknow in 2021 to a premium cake boutique in Greater Noida.',
    index: true, changefreq: 'monthly', priority: 0.6,
  },
  {
    path: '/consultation',
    title: 'Book a Cake Consultation | Cakeasy',
    description: "Share your event date, venue, servings, palette, outfits and inspiration with Cakeasy, Neha Chaudhary's premium cake boutique.",
    index: true, changefreq: 'monthly', priority: 0.8,
  },
  {
    path: '/contact',
    title: 'Contact Cakeasy | WhatsApp Orders',
    description: 'Contact Cakeasy, the eggless cake boutique in Greater Noida: WhatsApp, address, opening hours and how to share a custom cake enquiry.',
    index: true, changefreq: 'monthly', priority: 0.6,
  },
  {
    path: '/custom-cakes-greater-noida',
    title: 'Custom Cakes in Greater Noida | Cakeasy Cake Boutique',
    description: 'Premium custom cakes in Greater Noida by Neha Chaudhary: wedding, designer, birthday and bento cakes, all eggless. Serving Noida and Delhi NCR.',
    index: true, changefreq: 'monthly', priority: 0.9,
  },
  {
    path: '/eggless-cakes',
    title: '100% Eggless Cakes in Greater Noida | Cakeasy',
    description: 'Every Cakeasy cake is eggless by default: bespoke wedding, designer, birthday and bento cakes by Neha Chaudhary in Greater Noida, serving Delhi NCR.',
    index: true, changefreq: 'monthly', priority: 0.9,
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Cakeasy',
    description: 'How Cakeasy handles the details you share in an enquiry, cookies and measurement, and how to see, correct or delete your information.',
    index: true, changefreq: 'monthly', priority: 0.2,
  },
  {
    path: '/terms',
    title: 'Terms of Service | Cakeasy',
    description: 'How Cakeasy confirms custom cake orders on WhatsApp, eggless-by-default cakes and use of website photos.',
    index: true, changefreq: 'monthly', priority: 0.2,
  },
  {
    path: '/refund-policy',
    title: 'Cancellation & Refund Policy | Cakeasy',
    description: 'Cancellation and refund terms for Cakeasy custom cake orders are confirmed directly before an order is accepted.',
    index: true, changefreq: 'monthly', priority: 0.2,
  },
];

// Permanent moves that must keep working regardless of CMS content.
export const BUILT_IN_REDIRECTS: Record<string, string> = {
  '/cakes/wedding': '/weddings',
  // From the previous site (Search Console 404s, Oct 2026).
  '/shop': '/catalog',
};

// Paths the CMS may never claim for a landing page or redirect source.
export const RESERVED_PREFIXES = ['/admin', '/api', '/assets', '/gallery/', '/catalog/', '/sitemap.xml', '/robots.txt', '/llms.txt', '/app-shell.html', '/favicon'];

export function normalizePath(input: string): string {
  let path = (input || '/').split('#')[0].split('?')[0].trim();
  try { path = decodeURI(path); } catch { /* keep raw */ }
  if (!path.startsWith('/')) path = `/${path}`;
  path = path.replace(/\/{2,}/g, '/');
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path.toLowerCase();
}

// Firestore document ids cannot contain "/".
export function seoDocId(path: string): string {
  const normalized = normalizePath(path);
  return normalized === '/' ? 'home' : normalized.slice(1).replace(/\//g, '__');
}

export function isReservedPath(path: string): boolean {
  const normalized = normalizePath(path);
  // "/gallery/" reserves the image folder only, not the /gallery page itself.
  return RESERVED_PREFIXES.some((prefix) => prefix.endsWith('/')
    ? normalized.startsWith(prefix)
    : normalized === prefix || normalized.startsWith(`${prefix}/`));
}

export function findRoute(path: string): RouteSeo | undefined {
  const normalized = normalizePath(path);
  return PUBLIC_ROUTES.find((route) => route.path === normalized);
}

export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_ORIGIN;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_ORIGIN}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

// Values that are safe to hand to the browser on every page.
export interface PublicRuntime {
  site: SiteSettings;
  marketing: MarketingSettings;
  seo: Record<string, Partial<SeoRecord>>;
}

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const;
