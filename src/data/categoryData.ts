export type CakeCategorySlug = 'wedding' | 'designer' | 'engagement' | 'anniversary' | 'birthday' | 'bento' | 'cupcakes' | 'pastries' | 'dessert-boxes';

export interface CakeCategoryConfig {
  slug: CakeCategorySlug;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  hero: string;
  images: string[];
  styles: string[];
  note: string;
  isSmall?: boolean;
}

const gallery = (id: number) => `/gallery/${id}/img1.jpg`;

export const CAKE_CATEGORY_DATA: Record<CakeCategorySlug, CakeCategoryConfig> = {
  wedding: {
    slug: 'wedding', navLabel: 'Wedding & Milestone Cakes', eyebrow: 'The flagship collection', title: 'Bespoke Cakes for Engagements, Weddings & Anniversaries',
    description: 'Multi-tier milestone cakes designed around your venue, palette, outfits, flowers and story — from engagement celebrations to traditional Indian weddings and modern anniversaries.', hero: gallery(9), images: [gallery(9), gallery(10), gallery(8), gallery(20), gallery(11)],
    styles: ['Multi-tier statement cakes', 'Floral buttercream and fondant', 'Traditional Indian wedding details', 'Minimal luxury finishes', 'Venue and decor coordination'],
    note: 'Wedding cakes are quoted by design, servings, flavour, delivery and setup requirements. No fixed menu pricing for complex commissions.'
  },
  designer: {
    slug: 'designer', navLabel: 'Designer Cakes', eyebrow: 'The creative collection', title: 'If you can imagine it, Neha can shape it in cake.',
    description: 'Sculpted, themed, floral, hobby-led and story-based cakes. Single-tier and multi-tier designs belong here when the idea is the hero.', hero: gallery(26), images: [gallery(26), gallery(15), gallery(16), gallery(19), gallery(30)],
    styles: ['Kids themes and characters', 'Profession and hobby cakes', 'Travel and object-shaped designs', 'Floral and fashion-inspired work', 'Story-led multi-tier pieces'],
    note: 'Share a reference, a favourite interest or a story. Cakeasy will help turn the idea into a design brief.'
  },
  engagement: {
    slug: 'engagement', navLabel: 'Engagement Cakes', eyebrow: 'For the yes', title: 'The first chapter deserves more than a generic cake.',
    description: 'Elegant multi-tier and couple-led cakes with florals, ring details, custom colours and finishes coordinated to the engagement decor.', hero: gallery(9), images: [gallery(9), gallery(8), gallery(12), gallery(24)],
    styles: ['Ring and couple concepts', 'Floral tiered cakes', 'Custom colour palettes', 'Gold and pearl details', 'Dessert pairings for the celebration'],
    note: 'Send the invitation, stage palette or outfit references and we will design a cake that belongs in the room.'
  },
  anniversary: {
    slug: 'anniversary', navLabel: 'Anniversary Cakes', eyebrow: 'For the years you chose each other', title: 'A cake built around the memory.',
    description: 'Romantic single-tier and multi-tier cakes for milestones, surprises and the small private celebrations that deserve something personal.', hero: gallery(10), images: [gallery(10), gallery(12), gallery(23), gallery(24), gallery(25)],
    styles: ['Milestone anniversary tiers', 'Photograph and memory details', 'Romantic florals', 'Elegant personalised messages', 'Surprise delivery conversations'],
    note: 'Add a date, a shared interest, a photograph or a private message. We will help you choose the right scale.'
  },
  birthday: {
    slug: 'birthday', navLabel: 'Birthday Cakes', eyebrow: 'Celebrations, made personal', title: 'A birthday centrepiece they will talk about after the candles are gone.',
    description: 'Kid themes, adult milestones, professions, hobbies and luxury birthday designs, from intimate cakes to statement tiers.', hero: gallery(28), images: [gallery(28), gallery(13), gallery(14), gallery(21), gallery(22)],
    styles: ['Kids themes and character cakes', 'Adult birthdays and milestones', 'Profession and hobby cakes', 'Number and message cakes', 'Luxury birthday centrepieces'],
    note: 'Tell us the age, interest, serving size and the reaction you want. Eggless and flavour options can be discussed before confirmation.'
  },
  bento: {
    slug: 'bento', navLabel: 'Bento Cakes', eyebrow: 'Small, personal, giftable', title: 'A little cake for a very specific feeling.',
    description: 'Small designer cakes for intimate celebrations, desk surprises, date nights and thoughtful gifting. Curated designs with room for a personal message.', hero: gallery(5), images: [gallery(5), gallery(6), gallery(7)],
    styles: ['0.5kg intimate cakes', 'Minimal message designs', 'Romantic date-night gifts', 'Small custom themes', 'Bento and cupcake pairings'],
    note: 'Bento cakes are intentionally small. Share the message, date and palette; we will confirm the design and availability.' , isSmall: true
  },
  cupcakes: {
    slug: 'cupcakes', navLabel: 'Cupcakes', eyebrow: 'Supporting celebrations', title: 'A polished little collection for the table.',
    description: 'Giftable cupcake boxes for birthdays, office celebrations, dessert tables and wedding favours, finished to match the occasion.', hero: '/catalog/product5.jpg', images: ['/catalog/product5.jpg', '/catalog/product6.jpg'],
    styles: ['Gift-ready boxes', 'Event colour matching', 'Wedding favours', 'Dessert table quantities', 'Flavour pairings'], note: 'For larger quantities or event styling, send the date and palette for a tailored quote.'
  },
  pastries: {
    slug: 'pastries', navLabel: 'Pastries', eyebrow: 'The daily indulgence', title: 'Small-format treats, still made with Cakeasy care.',
    description: 'A supporting range for repeat orders, gifting and everyday celebrations. Elegant, fresh and easy to order through WhatsApp.', hero: '/catalog/product4.jpg', images: ['/catalog/product4.jpg', '/catalog/product5.jpg', '/catalog/product6.jpg'],
    styles: ['Dessert boxes', 'Cake jars and pastries', 'Tea-time gifting', 'Office and event orders', 'Seasonal selections'], note: 'Availability changes with the bake schedule. WhatsApp the date, quantity and pickup or delivery preference.'
  },
  'dessert-boxes': {
    slug: 'dessert-boxes', navLabel: 'Dessert Boxes', eyebrow: 'Supporting celebrations', title: 'A table of little moments.',
    description: 'Dessert boxes and cake pairings for intimate gatherings, return gifts, corporate celebrations and thoughtful surprises.', hero: '/catalog/product5.jpg', images: ['/catalog/product5.jpg', '/catalog/product6.jpg', '/catalog/product4.jpg'],
    styles: ['Celebration dessert boxes', 'Return gifts and favours', 'Corporate gifting', 'Cake and cupcake pairings', 'Custom message cards'], note: 'Share your quantity, date and packaging needs for a considered event quote.'
  },
};

export const PRIMARY_CATEGORIES: CakeCategorySlug[] = ['wedding', 'designer', 'engagement', 'anniversary', 'birthday', 'bento'];
