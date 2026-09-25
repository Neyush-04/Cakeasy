// CMS-managed content (gallery, catalogue, FAQs): types, allowed values and the
// sanitising used by both the CMS and the public /api/content function.

export const GALLERY_CATEGORIES = ['wedding', 'engagement', 'anniversary', 'designer', 'birthday', 'bento', 'cupcakes', 'pastries', 'dessert-boxes'] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  wedding: 'Wedding', engagement: 'Engagement', anniversary: 'Anniversary', designer: 'Designer', birthday: 'Birthday',
  bento: 'Bento', cupcakes: 'Cupcakes', pastries: 'Pastries', 'dessert-boxes': 'Dessert boxes',
};

export const CATALOGUE_CATEGORIES = ['wedding', 'celebration', 'bento', 'cupcakes'] as const;
export type CatalogueCategory = (typeof CATALOGUE_CATEGORIES)[number];

export const CATALOGUE_CATEGORY_LABELS: Record<CatalogueCategory, string> = {
  wedding: 'Wedding & Milestone', celebration: 'Celebration', bento: 'Bento', cupcakes: 'Cupcakes & Pastries',
};

export interface GalleryImage { url: string; alt: string }

export interface GalleryItem {
  id: string;
  caption: string;
  category: GalleryCategory;
  year: string;
  date: string;
  images: GalleryImage[];
  featured: boolean;
  published: boolean;
  order: number;
}

export interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  category: CatalogueCategory;
  image: string;
  popularFlavors: string[];
  published: boolean;
  order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  order: number;
}

export interface PublicContent {
  gallery: GalleryItem[];
  catalogue: CatalogueItem[];
  faqs: FaqItem[];
}

export const LIMITS = {
  caption: 600, alt: 200, year: 12, date: 40, images: 12,
  name: 100, description: 600, priceRange: 50, image: 1000, flavors: 20, flavor: 60,
  question: 200, answer: 1500,
};

// Only site paths or https URLs (Firebase Storage, Instagram CDN) may reach an <img>.
export function safeImageUrl(value: unknown): string {
  const url = typeof value === 'string' ? value.trim() : '';
  if (/^\/(?!\/)[^\s"'<>]*$/.test(url)) return url;
  if (/^https:\/\/[^\s"'<>]+$/.test(url)) return url;
  return '';
}

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function num(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function cleanGalleryItem(id: string, raw: Record<string, unknown>): GalleryItem | null {
  const category = GALLERY_CATEGORIES.includes(raw.category as GalleryCategory) ? raw.category as GalleryCategory : 'designer';
  const images = (Array.isArray(raw.images) ? raw.images : [])
    .slice(0, LIMITS.images)
    .map((image) => {
      const record = image && typeof image === 'object' ? image as Record<string, unknown> : {};
      return { url: safeImageUrl(record.url), alt: str(record.alt, LIMITS.alt) };
    })
    .filter((image) => image.url);
  if (!images.length) return null;
  return {
    id,
    caption: str(raw.caption, LIMITS.caption),
    category,
    year: str(raw.year, LIMITS.year),
    date: str(raw.date, LIMITS.date),
    images,
    featured: raw.featured === true,
    published: raw.published === true,
    order: num(raw.order),
  };
}

export function cleanCatalogueItem(id: string, raw: Record<string, unknown>): CatalogueItem | null {
  const name = str(raw.name, LIMITS.name);
  const image = safeImageUrl(raw.image);
  if (!name || !image) return null;
  return {
    id,
    name,
    description: str(raw.description, LIMITS.description),
    priceRange: str(raw.priceRange, LIMITS.priceRange),
    category: CATALOGUE_CATEGORIES.includes(raw.category as CatalogueCategory) ? raw.category as CatalogueCategory : 'celebration',
    image,
    popularFlavors: (Array.isArray(raw.popularFlavors) ? raw.popularFlavors : [])
      .map((flavor) => str(flavor, LIMITS.flavor)).filter(Boolean).slice(0, LIMITS.flavors),
    published: raw.published === true,
    order: num(raw.order),
  };
}

export function cleanFaqItem(id: string, raw: Record<string, unknown>): FaqItem | null {
  const question = str(raw.question, LIMITS.question);
  const answer = str(raw.answer, LIMITS.answer);
  if (!question || !answer) return null;
  return { id, question, answer, published: raw.published === true, order: num(raw.order) };
}

export const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

// FAQPage schema only for FAQs that are actually shown on the page.
export function faqJsonLd(faqs: FaqItem[]) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
