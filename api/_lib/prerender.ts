// Server-rendered page content for crawlers and AI assistants that do not run
// JavaScript. It is placed inside <div id="root"> and React replaces it on load.
// Everything here comes from the same data the visible page uses (no hidden or
// extra claims), so people and search engines see the same content.
import { escapeHtml } from '../../shared/head.js';
import { LANDING_PAGES, type LandingPage } from '../../shared/landing.js';
import { findRoute, hoursText, type SiteSettings } from '../../shared/site.js';
import { GALLERY_CATEGORY_LABELS, type PublicContent } from '../../shared/content.js';
import { CAKE_CATEGORY_DATA, PRIMARY_CATEGORIES, categoryPath, type CakeCategorySlug } from '../../src/data/categoryData.js';
import { ALL_PRODUCTS, ARCHIVE_CATEGORY_BY_ID, INSTAGRAM_POSTS, MEET_THE_TEAM } from '../../src/data.js';

const e = escapeHtml;

const NAV: [string, string][] = [
  ['/', 'Home'], ['/weddings', 'Wedding & Milestone Cakes'], ['/cakes/designer', 'Designer Cakes'], ['/eggless-cakes', 'Eggless Cakes'],
  ['/custom-cakes-greater-noida', 'Custom Cakes in Greater Noida'], ['/gallery', 'Our Work'], ['/catalog', 'Catalogue'],
  ['/consultation', 'Book Consultation'], ['/about', 'About Neha'], ['/contact', 'Contact'],
];

const ORDER_STEPS = ['Share your event details', 'Send your inspiration, theme or story', 'Finalise design, flavour, servings and budget', 'Receive the proposal and quotation', 'Confirm with advance payment', 'Cakeasy creates and delivers'];

interface Gallery { id: string; caption: string; category: string; url: string; alt: string; featured: boolean }

function galleryOf(content: PublicContent): Gallery[] {
  if (content.gallery.length) {
    return [...content.gallery].sort((a, b) => Number(b.featured) - Number(a.featured)).map((item) => ({
      id: item.id, caption: item.caption, category: GALLERY_CATEGORY_LABELS[item.category] || item.category,
      url: item.images[0].url, alt: item.images[0].alt || item.caption, featured: item.featured,
    }));
  }
  return INSTAGRAM_POSTS.map((post) => ({ id: post.id, caption: '', category: ARCHIVE_CATEGORY_BY_ID[post.id] || 'designer', url: post.imageUrl, alt: 'Cakeasy cake', featured: false }));
}

const h2 = (text: string) => `<h2 class="mt-10 font-serif text-2xl font-bold">${e(text)}</h2>`;
const p = (text: string) => `<p class="mt-3 text-sm leading-7 text-gray-600">${e(text)}</p>`;
const link = (href: string, text: string) => `<a href="${e(href)}" class="font-semibold text-[#D63384]">${e(text)}</a>`;
const list = (items: string[]) => `<ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">${items.join('')}</ul>`;

function figures(items: Gallery[]) {
  if (!items.length) return '';
  return `<div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">${items.map((item) => `<figure><img src="${e(item.url)}" alt="${e(item.alt)}" loading="lazy" width="400" height="400" class="aspect-square w-full rounded-2xl object-contain bg-[#FFF5F8]">${item.caption ? `<figcaption class="mt-2 text-xs text-gray-600">${e(item.caption)}</figcaption>` : ''}</figure>`).join('')}</div>`;
}

function faqs(content: PublicContent) {
  if (!content.faqs.length) return '';
  return `${h2('Questions before you order')}<dl class="mt-3 space-y-4">${content.faqs.map((faq) => `<div><dt class="text-sm font-semibold">${e(faq.question)}</dt><dd class="mt-1 text-sm leading-6 text-gray-600">${e(faq.answer)}</dd></div>`).join('')}</dl>`;
}

function contactBlock(site: SiteSettings) {
  return list([
    `<li>Address: ${e(site.address)}${site.googleBusinessUrl ? ` (${link(site.googleBusinessUrl, 'Google Maps')})` : ''}</li>`,
    `<li>WhatsApp and calls: ${link(`https://wa.me/${site.whatsappNumber}`, site.phoneDisplay)}</li>`,
    site.email ? `<li>Email: ${link(`mailto:${site.email}`, site.email)}</li>` : '',
    `<li>Hours: ${e(hoursText())}</li>`,
    site.instagramUrl ? `<li>Instagram: ${link(site.instagramUrl, site.instagramHandle)}</li>` : '',
  ]);
}

function categoryLinks(slugs: CakeCategorySlug[]) {
  return list(slugs.map((slug) => {
    const config = CAKE_CATEGORY_DATA[slug];
    return `<li>${link(categoryPath(slug), config.navLabel)}: ${e(config.description)}</li>`;
  }));
}

function home(content: PublicContent) {
  const featured = galleryOf(content).filter((item) => item.featured).slice(0, 6);
  return [
    `<p class="text-xs font-bold uppercase tracking-widest text-[#D63384]">Cakeasy by Neha Chaudhary</p>`,
    `<h1 class="mt-2 font-serif text-4xl font-bold">Bespoke cakes designed around your celebration.</h1>`,
    p('From wedding decor and outfits to birthdays, milestones and personal stories, Cakeasy creates cakes that are designed uniquely for your occasion.'),
    p('Cakeasy is Neha Chaudhary’s premium cake boutique in Greater Noida, serving Delhi NCR. Every cake is 100% eggless by default.'),
    h2('Choose the kind of celebration you are designing'),
    categoryLinks([...PRIMARY_CATEGORIES, 'cupcakes', 'dessert-boxes']),
    h2('The Cakeasy custom cake journey'),
    `<ol class="mt-3 list-decimal space-y-1 pl-5 text-sm text-gray-600">${ORDER_STEPS.map((step) => `<li>${e(step)}</li>`).join('')}</ol>`,
    h2('Real Cakeasy work'),
    figures(featured),
  ].join('');
}

function category(slug: CakeCategorySlug, content: PublicContent) {
  const config = CAKE_CATEGORY_DATA[slug];
  const work = galleryOf(content).filter((item) => item.category.toLowerCase() === config.navLabel.split(' ')[0].toLowerCase()).slice(0, 6);
  return [
    `<p class="text-xs font-bold uppercase tracking-widest text-[#D63384]">${e(config.eyebrow)}</p>`,
    `<h1 class="mt-2 font-serif text-4xl font-bold">${e(config.title)}</h1>`,
    p(config.description),
    p('Every Cakeasy cake is eggless by default.'),
    h2('What belongs here'),
    list(config.styles.map((style) => `<li>${e(style)}</li>`)),
    p(config.note),
    work.length ? `${h2('Curated Cakeasy work')}${figures(work)}` : figures(config.images.slice(0, 3).map((url, index) => ({ id: url, caption: '', category: '', url, alt: `${config.navLabel} by Cakeasy, design ${index + 1}`, featured: false }))),
    `<p class="mt-6 text-sm">${link('/consultation', 'Book a consultation')} · ${link('/gallery', 'View the full gallery')}</p>`,
  ].join('');
}

function landing(page: LandingPage, content: PublicContent, site: SiteSettings) {
  const all = galleryOf(content);
  const picks = page.galleryIds.map((id) => all.find((item) => item.id === id)).filter((item): item is Gallery => Boolean(item));
  return [
    `<p class="text-xs font-bold uppercase tracking-widest text-[#D63384]">${e(page.eyebrow)}</p>`,
    `<h1 class="mt-2 font-serif text-4xl font-bold">${e(page.h1)}</h1>`,
    ...page.intro.map(p),
    ...page.sections.map((section) => [
      h2(section.heading),
      ...(section.paragraphs || []).map(p),
      section.links ? list(section.links.map((item) => `<li>${link(item.href, item.label)}: ${e(item.text)}</li>`)) : '',
      section.steps ? `<ol class="mt-3 list-decimal space-y-1 pl-5 text-sm text-gray-600">${section.steps.map((step) => `<li>${e(step)}</li>`).join('')}</ol>` : '',
      section.showContact ? contactBlock(site) : '',
    ].join('')),
    picks.length ? `${h2(page.galleryHeading)}${figures(picks)}` : '',
    faqs(content),
  ].join('');
}

function mainFor(path: string, content: PublicContent, site: SiteSettings): string {
  if (path === '/') return home(content);
  if (path === '/weddings') return category('wedding', content);
  if (path.startsWith('/cakes/')) {
    const slug = path.slice('/cakes/'.length) as CakeCategorySlug;
    return CAKE_CATEGORY_DATA[slug] ? category(slug, content) : '';
  }
  const landingPage = LANDING_PAGES[path];
  if (landingPage) return landing(landingPage, content, site);

  switch (path) {
    case '/gallery': {
      const items = galleryOf(content);
      return `<h1 class="font-serif text-4xl font-bold">Cakeasy from Lucknow to Delhi NCR</h1>${p('A visual journey of Neha Chaudhary’s cakes: the early home-baker days in Lucknow from 2021, themed celebration work, and the move to the Greater Noida boutique.')}${h2('The Cakeasy archive')}${figures(items)}`;
    }
    case '/catalog': {
      const products = content.catalogue.length ? content.catalogue : ALL_PRODUCTS;
      return `<h1 class="font-serif text-4xl font-bold">Artisanal Cake Collection</h1>${p('Every Cakeasy cake is eggless by default. Designs, flavours and pricing are confirmed with Cakeasy on WhatsApp.')}${products.map((product) => `<article class="mt-6"><h2 class="font-serif text-xl font-bold">${e(product.name)}</h2>${p(product.description)}${product.priceRange ? p(product.priceRange) : ''}${product.popularFlavors.length ? p(`Popular flavours: ${product.popularFlavors.join(', ')}`) : ''}</article>`).join('')}`;
    }
    case '/consultation':
      return `<h1 class="font-serif text-4xl font-bold">Let us design the right cake for the moment.</h1>${p('A short three-step brief gives Neha the useful context: the occasion, the design direction and the details that make it yours. Your brief is saved with a reference number, then opens in WhatsApp for a direct conversation.')}${p('Cakeasy Cake Boutique · Greater Noida. Serving Delhi NCR, with Lucknow roots.')}${faqs(content)}`;
    case '/about': {
      const neha = MEET_THE_TEAM[0];
      return `<h1 class="font-serif text-4xl font-bold">Meet Neha Chaudhary, the heart of Cakeasy.</h1>${p('Neha is the face, baker, and creative force behind Cakeasy. Her journey began in Lucknow in 2021 and grew into a premium cake boutique in Greater Noida, serving Delhi NCR celebrations.')}${p('Cakeasy is built around direct conversations: the occasion, the design, the flavour, the date, and the small emotional details that make a cake feel personal.')}${neha ? p(neha.bio) : ''}`;
    }
    case '/contact':
      return `<h1 class="font-serif text-4xl font-bold">Order by WhatsApp</h1>${p('Share your occasion, preferred date, flavour ideas, and design references. Cakeasy will confirm pricing, pickup or delivery, and availability directly.')}${contactBlock(site)}`;
    case '/custom':
      return `<h1 class="font-serif text-4xl font-bold">Watch your custom cake come together.</h1>${p(findRoute('/custom')?.description || '')}`;
    default: {
      const route = findRoute(path);
      return route ? `<h1 class="font-serif text-4xl font-bold">${e(route.title.split(' | ')[0])}</h1>${p(route.description)}` : '';
    }
  }
}

export function renderBody(path: string, kind: 'public' | 'not-found' | 'admin' | 'landing', content: PublicContent, site: SiteSettings): string {
  if (kind === 'admin') return '';
  const main = kind === 'not-found'
    ? `<h1 class="font-serif text-3xl font-bold">This page isn't on the menu.</h1>${p('The link may be old or mistyped.')}<p class="mt-3 text-sm">${link('/weddings', 'Wedding cakes')} · ${link('/gallery', 'Our work')} · ${link('/', 'Home')}</p>`
    : mainFor(path, content, site);
  if (!main) return '';
  return [
    `<div class="mx-auto max-w-5xl px-4 py-8 font-sans text-[#251B21]">`,
    `<header><a href="/" class="font-serif text-2xl font-bold">Cakeasy</a><nav aria-label="Main" class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">${NAV.map(([href, text]) => link(href, text)).join('')}</nav></header>`,
    `<main class="mt-8">${main}</main>`,
    `<footer class="mt-12 border-t border-[#EDE3E2] pt-6"><p class="text-sm font-semibold">Cakeasy · premium eggless cake boutique in Greater Noida</p>${contactBlock(site)}<p class="mt-3 text-xs">${link('/privacy-policy', 'Privacy Policy')} · ${link('/terms', 'Terms')} · ${link('/refund-policy', 'Cancellation & Refunds')}</p></footer>`,
    `</div>`,
  ].join('');
}
