import { MenuItem, InstagramPost } from './types';

export const CAKE_CATEGORIES = [
  { id: 'bento', label: 'Bento Cakes', icon: 'Box', desc: 'Cute, minimalist 250g personal cakes' },
  { id: 'wedding', label: 'Wedding Cakes', icon: 'Heart', desc: 'Exquisite, multi-tiered artisanal masterpieces' },
  { id: 'celebration', label: 'Celebration Cakes', icon: 'Sparkles', desc: 'Perfect for birthdays, anniversaries, & baby showers' },
  { id: 'cupcakes', label: 'Cupcakes & Pastries', icon: 'Cupcake', desc: 'Bite-sized indulgence made with love' },
];

export const POPULAR_FLAVORS = [
  'Classic Madagascar Vanilla',
  'Belgian Chocolate Ganache',
  'Lotus Biscoff Premium',
  'Rose Water & Pistachio',
  'Salted Caramel Crunch',
  'Red Velvet Cream Cheese',
  'Fresh Mango & Cream (Seasonal)',
  'Zesty Lemon Blueberry',
];

export const ALL_PRODUCTS: MenuItem[] = [
  {
    id: 'prod-1',
    name: 'Minimalist Korean Bento Cake',
    description: 'A trendy, pastel-toned personal cake with delicate retro buttercream piping. Perfect for intimate milestones, birthday surprises, or spontaneous sweet cravings.',
    priceRange: '₹399 - ₹499',
    category: 'bento',
    image: '/catalog/product1.jpg',
    popularFlavors: ['Classic Madagascar Vanilla', 'Lotus Biscoff Premium', 'Belgian Chocolate Ganache'],
  },
  {
    id: 'prod-2',
    name: 'Artisanal Pastel Rose Wedding Cake',
    description: 'A grand multi-tiered wedding masterpiece frosted with smooth pastel buttercream, hand-applied edible gold leaf accents, and delicate cascading floral accents.',
    priceRange: '₹4,999 - ₹12,000',
    category: 'wedding',
    image: '/catalog/product2.jpg',
    popularFlavors: ['Rose Water & Pistachio', 'Classic Madagascar Vanilla', 'Zesty Lemon Blueberry'],
  },
  {
    id: 'prod-3',
    name: 'Macaron & White Chocolate Drip Cake',
    description: 'An elegant, tall celebration cake dressed in white chocolate drip, topped with macaron-inspired accents, seasonal details, and subtle celebration highlights.',
    priceRange: '₹1,499 - ₹2,999',
    category: 'celebration',
    image: '/catalog/product3.jpg',
    popularFlavors: ['Salted Caramel Crunch', 'Belgian Chocolate Ganache', 'Red Velvet Cream Cheese'],
  },
  {
    id: 'prod-4',
    name: 'Belgian Chocolate Ganache Decadence',
    description: 'A rich, dark chocolate lover’s dream. Layered with moist cocoa sponge and velvety premium Belgian chocolate ganache, finished with a mirror glaze.',
    priceRange: '₹999 - ₹1,899',
    category: 'celebration',
    image: '/catalog/product4.jpg',
    popularFlavors: ['Belgian Chocolate Ganache'],
  },
  {
    id: 'prod-5',
    name: 'Dreamy Lotus Biscoff Cupcakes',
    description: 'Fluffy vanilla bean cupcakes topped with smooth Biscoff-infused buttercream, a drizzle of warm cookie butter, and a crunchy Lotus cookie crown.',
    priceRange: '₹299 - ₹499 (Box of 4/6)',
    category: 'cupcakes',
    image: '/catalog/product5.jpg',
    popularFlavors: ['Lotus Biscoff Premium'],
  },
  {
    id: 'prod-6',
    name: 'Red Velvet Cream Cheese Bento Cake',
    description: 'Our signature red velvet sponge paired with a tang of luxurious cream cheese frosting, presented beautifully in an eco-friendly bagasse takeout box.',
    priceRange: '₹449 - ₹549',
    category: 'bento',
    image: '/catalog/product6.jpg',
    popularFlavors: ['Red Velvet Cream Cheese'],
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    imageUrl: '/gallery/1/img1.jpg',
    images: ['/gallery/1/img1.jpg', '/gallery/1/img2.jpg', '/gallery/1/img3.jpg', '/gallery/1/img4.jpg', '/gallery/1/img5.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 47,
    commentsCount: 0,
    date: 'May 28, 2026',
    comments: []
  },
  {
    id: 'ig-2',
    imageUrl: '/gallery/2/img1.jpg',
    images: ['/gallery/2/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 54,
    commentsCount: 0,
    date: 'May 03, 2026',
    comments: []
  },
  {
    id: 'ig-3',
    imageUrl: '/gallery/3/img1.jpg',
    images: ['/gallery/3/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 61,
    commentsCount: 0,
    date: 'Apr 09, 2026',
    comments: []
  },
  {
    id: 'ig-4',
    imageUrl: '/gallery/4/img1.jpg',
    images: ['/gallery/4/img1.jpg', '/gallery/4/img2.jpg', '/gallery/4/img3.jpg', '/gallery/4/img4.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 68,
    commentsCount: 0,
    date: 'Mar 31, 2026',
    comments: []
  },
  {
    id: 'ig-5',
    imageUrl: '/gallery/5/img1.jpg',
    images: ['/gallery/5/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 75,
    commentsCount: 0,
    date: 'Mar 28, 2026',
    comments: []
  },
  {
    id: 'ig-6',
    imageUrl: '/gallery/6/img1.jpg',
    images: ['/gallery/6/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 82,
    commentsCount: 0,
    date: 'Mar 18, 2026',
    comments: []
  },
  {
    id: 'ig-7',
    imageUrl: '/gallery/7/img1.jpg',
    images: ['/gallery/7/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 89,
    commentsCount: 0,
    date: 'Mar 14, 2026',
    comments: []
  },
  {
    id: 'ig-8',
    imageUrl: '/gallery/8/img1.jpg',
    images: ['/gallery/8/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 96,
    commentsCount: 0,
    date: 'Mar 10, 2026',
    comments: []
  },
  {
    id: 'ig-9',
    imageUrl: '/gallery/9/img1.jpg',
    images: ['/gallery/9/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 103,
    commentsCount: 0,
    date: 'Mar 05, 2026',
    comments: []
  },
  {
    id: 'ig-10',
    imageUrl: '/gallery/10/img1.jpg',
    images: ['/gallery/10/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 110,
    commentsCount: 0,
    date: 'Mar 02, 2026',
    comments: []
  },
  {
    id: 'ig-11',
    imageUrl: '/gallery/11/img1.jpg',
    images: ['/gallery/11/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 117,
    commentsCount: 0,
    date: 'Mar 01, 2026',
    comments: []
  },
  {
    id: 'ig-12',
    imageUrl: '/gallery/12/img1.jpg',
    images: ['/gallery/12/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 124,
    commentsCount: 0,
    date: 'Mar 01, 2026',
    comments: []
  },
  {
    id: 'ig-13',
    imageUrl: '/gallery/13/img1.jpg',
    images: ['/gallery/13/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 131,
    commentsCount: 0,
    date: 'Feb 27, 2026',
    comments: []
  },
  {
    id: 'ig-14',
    imageUrl: '/gallery/14/img1.jpg',
    images: ['/gallery/14/img1.jpg', '/gallery/14/img2.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 138,
    commentsCount: 0,
    date: 'Feb 26, 2026',
    comments: []
  },
  {
    id: 'ig-15',
    imageUrl: '/gallery/15/img1.jpg',
    images: ['/gallery/15/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 145,
    commentsCount: 0,
    date: 'Feb 04, 2026',
    comments: []
  },
  {
    id: 'ig-16',
    imageUrl: '/gallery/16/img1.jpg',
    images: ['/gallery/16/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 152,
    commentsCount: 0,
    date: 'Nov 24, 2025',
    comments: []
  },
  {
    id: 'ig-17',
    imageUrl: '/gallery/17/img1.jpg',
    images: ['/gallery/17/img1.jpg', '/gallery/17/img2.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 159,
    commentsCount: 0,
    date: 'Nov 24, 2025',
    comments: []
  },
  {
    id: 'ig-18',
    imageUrl: '/gallery/18/img1.jpg',
    images: ['/gallery/18/img1.jpg', '/gallery/18/img2.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 166,
    commentsCount: 0,
    date: 'Oct 05, 2025',
    comments: []
  },
  {
    id: 'ig-19',
    imageUrl: '/gallery/19/img1.jpg',
    images: ['/gallery/19/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 43,
    commentsCount: 0,
    date: 'Mar 31, 2025',
    comments: []
  },
  {
    id: 'ig-20',
    imageUrl: '/gallery/20/img1.jpg',
    images: ['/gallery/20/img1.jpg', '/gallery/20/img2.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 50,
    commentsCount: 0,
    date: 'Mar 29, 2025',
    comments: []
  },
  {
    id: 'ig-21',
    imageUrl: '/gallery/21/img1.jpg',
    images: ['/gallery/21/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 57,
    commentsCount: 0,
    date: 'Jul 30, 2024',
    comments: []
  },
  {
    id: 'ig-22',
    imageUrl: '/gallery/22/img1.jpg',
    images: ['/gallery/22/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 64,
    commentsCount: 0,
    date: 'Jul 29, 2024',
    comments: []
  },
  {
    id: 'ig-23',
    imageUrl: '/gallery/23/img1.jpg',
    images: ['/gallery/23/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 71,
    commentsCount: 0,
    date: 'Jul 26, 2024',
    comments: []
  },
  {
    id: 'ig-24',
    imageUrl: '/gallery/24/img1.jpg',
    images: ['/gallery/24/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 78,
    commentsCount: 0,
    date: 'Jul 25, 2024',
    comments: []
  },
  {
    id: 'ig-25',
    imageUrl: '/gallery/25/img1.jpg',
    images: ['/gallery/25/img1.jpg', '/gallery/25/img2.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 85,
    commentsCount: 0,
    date: 'Jul 22, 2024',
    comments: []
  },
  {
    id: 'ig-26',
    imageUrl: '/gallery/26/img1.jpg',
    images: ['/gallery/26/img1.jpg', '/gallery/26/img2.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 92,
    commentsCount: 0,
    date: 'Jul 20, 2024',
    comments: []
  },
  {
    id: 'ig-27',
    imageUrl: '/gallery/27/img1.jpg',
    images: ['/gallery/27/img1.jpg', '/gallery/27/img2.jpg', '/gallery/27/img3.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 99,
    commentsCount: 0,
    date: 'Jun 10, 2024',
    comments: []
  },
  {
    id: 'ig-28',
    imageUrl: '/gallery/28/img1.jpg',
    images: ['/gallery/28/img1.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 106,
    commentsCount: 0,
    date: 'May 23, 2024',
    comments: []
  },
  {
    id: 'ig-29',
    imageUrl: '/gallery/29/img1.jpg',
    images: ['/gallery/29/img1.jpg', '/gallery/29/img2.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 113,
    commentsCount: 0,
    date: 'Apr 03, 2024',
    comments: []
  },
  {
    id: 'ig-30',
    imageUrl: '/gallery/30/img1.jpg',
    images: ['/gallery/30/img1.jpg', '/gallery/30/img2.jpg', '/gallery/30/img3.jpg', '/gallery/30/img4.jpg'],
    caption: 'Cakeasy creation from our photo gallery.',
    likes: 120,
    commentsCount: 0,
    date: 'Mar 19, 2024',
    comments: []
  },
];

export const FAQS = [
  {
    question: 'How far in advance should I place my order?',
    answer: 'Please share your preferred date as early as possible. Cakeasy will confirm availability directly before accepting the order.',
  },
  {
    question: 'Do you offer eggless options?',
    answer: 'Eggless requests can be discussed before ordering. Cakeasy will confirm availability and suitability directly.',
  },
  {
    question: 'Do you offer home delivery? What are the charges?',
    answer: 'Pickup and delivery options are confirmed directly before the order is accepted.',
  },
  {
    question: 'Can I upload my own custom inspiration image?',
    answer: 'Absolutely! Our "Custom Cakes" portal lets you select the shape, tier configurations, size, and flavor, and upload any reference photograph. Our head baker will personally review and contact you to finalize the design.',
  },
  {
    question: 'What is your refund/cancellation policy?',
    answer: 'Cancellation and refund terms are confirmed directly before a custom order is accepted.',
  }
];

export const MEET_THE_TEAM = [
  {
    name: 'Cakeasy',
    role: 'Home Baker & Founder',
    bio: 'Cakeasy is a home-baked cake studio crafting custom cakes for birthdays, weddings, and everyday celebrations.',
    image: '/gallery/1/img1.jpg'
  }
];
