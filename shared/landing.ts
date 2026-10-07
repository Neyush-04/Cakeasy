// Local SEO landing pages. One source of truth for the React page (LandingView) and
// the server-rendered HTML (api/_lib/prerender.ts). Facts only: everything here is
// already confirmed elsewhere on the site, the Google Business Profile or by Piyush.

export interface LandingLink { label: string; href: string; text: string }
export interface LandingSection { heading: string; paragraphs?: string[]; links?: LandingLink[]; steps?: string[]; showContact?: boolean }
export interface LandingPage {
  path: string;
  eyebrow: string;
  h1: string;
  intro: string[];
  sections: LandingSection[];
  galleryIds: string[];
  galleryHeading: string;
}

const COLLECTIONS: LandingLink[] = [
  { label: 'Wedding & milestone cakes', href: '/weddings', text: 'Multi-tier cakes designed around your venue, palette, outfits and flowers.' },
  { label: 'Engagement cakes', href: '/cakes/engagement', text: 'Floral tiers, ring details and colours matched to the engagement decor.' },
  { label: 'Anniversary cakes', href: '/cakes/anniversary', text: 'Single and multi-tier cakes built around your memories.' },
  { label: 'Designer & theme cakes', href: '/cakes/designer', text: 'Sculpted, themed and story-led cakes, single or multi-tier.' },
  { label: 'Birthday cakes', href: '/cakes/birthday', text: 'Kids themes, characters, hobbies and milestone birthdays.' },
  { label: 'Bento cakes', href: '/cakes/bento', text: 'Small, giftable cakes with a personal message.' },
  { label: 'Cupcakes & dessert boxes', href: '/cakes/cupcakes', text: 'Gift boxes and dessert-table pieces matched to the occasion.' },
];

const ORDER_STEPS = [
  'Share your event details',
  'Send your inspiration, theme or story',
  'Finalise design, flavour, servings and budget',
  'Receive the proposal and quotation',
  'Confirm with advance payment',
  'Cakeasy creates and delivers',
];

export const LANDING_PAGES: Record<string, LandingPage> = {
  '/custom-cakes-greater-noida': {
    path: '/custom-cakes-greater-noida',
    eyebrow: 'Cake boutique in Greater Noida',
    h1: 'Custom cakes in Greater Noida, designed by Neha Chaudhary',
    intro: [
      'Cakeasy is a premium home cake boutique in Greater Noida, founded by baker Neha Chaudhary. It designs bespoke wedding, engagement, anniversary, designer, birthday and bento cakes, and every cake is eggless by default.',
      'The boutique is based at AWHO in Greater Noida and serves Greater Noida, Noida and Delhi NCR. Every order is planned directly with Neha on WhatsApp.',
    ],
    sections: [
      { heading: 'What Cakeasy makes', links: COLLECTIONS },
      {
        heading: 'Designed around your celebration',
        paragraphs: [
          'Your palette, decor, outfits, interests or story become part of the design. Neha helps you choose the right scale, flavour, finish and timeline, and delivery and setup are discussed before anything is confirmed.',
          'The story began in Lucknow in 2021 and grew into the Greater Noida boutique. The gallery shows real Cakeasy work from that journey.',
        ],
      },
      { heading: 'How ordering works', steps: ORDER_STEPS },
      { heading: 'Find Cakeasy in Greater Noida', showContact: true },
    ],
    galleryHeading: 'Recent Cakeasy work',
    galleryIds: ['ig-20', 'ig-9', 'ig-10', 'ig-8', 'ig-15', 'ig-26'],
  },
  '/eggless-cakes': {
    path: '/eggless-cakes',
    eyebrow: '100% eggless by default',
    h1: 'Eggless cakes in Greater Noida, for every celebration',
    intro: [
      'Every Cakeasy cake is eggless by default. From a small bento cake to a multi-tier wedding cake, it is made without eggs. You do not need to ask for it.',
      'Cakeasy is Neha Chaudhary’s premium home cake boutique in Greater Noida, serving Noida and Delhi NCR. Each cake is designed around your occasion, colours and story.',
    ],
    sections: [
      { heading: 'Eggless across every collection', links: COLLECTIONS },
      {
        heading: 'Planning an eggless celebration cake',
        paragraphs: [
          'Share your date, servings, theme and inspiration in the consultation brief. If anyone has an allergy or another dietary need, mention it there so it can be discussed before the order is accepted.',
          'Neha replies on WhatsApp with design ideas and a quotation before anything is confirmed.',
        ],
      },
      { heading: 'How ordering works', steps: ORDER_STEPS },
    ],
    galleryHeading: 'Eggless cakes made by Cakeasy',
    galleryIds: ['ig-9', 'ig-20', 'ig-10', 'ig-25', 'ig-13', 'ig-5'],
  },
};
