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
    image: '/src/assets/images/cakeasy_bento_cake_1784021831791.jpg',
    popularFlavors: ['Classic Madagascar Vanilla', 'Lotus Biscoff Premium', 'Belgian Chocolate Ganache'],
  },
  {
    id: 'prod-2',
    name: 'Artisanal Pastel Rose Wedding Cake',
    description: 'A grand multi-tiered wedding masterpiece frosted with smooth pastel buttercream, hand-applied edible gold leaf accents, and fresh, organic cascading roses.',
    priceRange: '₹4,999 - ₹12,000',
    category: 'wedding',
    image: '/src/assets/images/cakeasy_hero_banner_1784021815776.jpg',
    popularFlavors: ['Rose Water & Pistachio', 'Classic Madagascar Vanilla', 'Zesty Lemon Blueberry'],
  },
  {
    id: 'prod-3',
    name: 'Macaron & White Chocolate Drip Cake',
    description: 'An elegant, tall celebration cake dressed in white chocolate drip, topped with hand-crafted French macarons, organic summer berries, and subtle edible gold foil highlights.',
    priceRange: '₹1,499 - ₹2,999',
    category: 'celebration',
    image: '/src/assets/images/cakeasy_drip_cake_1784021848957.jpg',
    popularFlavors: ['Salted Caramel Crunch', 'Belgian Chocolate Ganache', 'Red Velvet Cream Cheese'],
  },
  {
    id: 'prod-4',
    name: 'Belgian Chocolate Ganache Decadence',
    description: 'A rich, dark chocolate lover’s dream. Layered with moist cocoa sponge and velvety premium Belgian chocolate ganache, finished with a mirror glaze.',
    priceRange: '₹999 - ₹1,899',
    category: 'celebration',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    popularFlavors: ['Belgian Chocolate Ganache'],
  },
  {
    id: 'prod-5',
    name: 'Dreamy Lotus Biscoff Cupcakes',
    description: 'Fluffy vanilla bean cupcakes topped with smooth Biscoff-infused buttercream, a drizzle of warm cookie butter, and a crunchy Lotus cookie crown.',
    priceRange: '₹299 - ₹499 (Box of 4/6)',
    category: 'cupcakes',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800',
    popularFlavors: ['Lotus Biscoff Premium'],
  },
  {
    id: 'prod-6',
    name: 'Red Velvet Cream Cheese Bento Cake',
    description: 'Our signature red velvet sponge paired with a tang of luxurious cream cheese frosting, presented beautifully in an eco-friendly bagasse takeout box.',
    priceRange: '₹449 - ₹549',
    category: 'bento',
    image: 'https://images.unsplash.com/photo-1586985289688-ca9cf499368a?auto=format&fit=crop&q=80&w=800',
    popularFlavors: ['Red Velvet Cream Cheese'],
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    imageUrl: '/src/assets/images/cakeasy_bento_cake_1784021831791.jpg',
    caption: 'Lavender dreams in a box 💜 Our signature bento cakes are the perfect size for your mini celebrations. DM to book yours! #cakeasy #bentocakes #koreancake #bakinglove',
    likes: 1248,
    commentsCount: 32,
    date: '2 hours ago',
    comments: [
      { username: 'sweet_tooth_delights', text: 'This looks so neat and cute! 🥺' },
      { username: 'aditi_mehta', text: 'Price for vanilla flavor please?' },
      { username: 'cakeasy.in', text: '@aditi_mehta Sent you a DM with details! ✨' }
    ]
  },
  {
    id: 'ig-2',
    imageUrl: '/src/assets/images/cakeasy_hero_banner_1784021815776.jpg',
    caption: 'Crafting sweet memories for beautiful beginnings. Deeply in love with the gold leaf detail on this multi-tiered pastel rose beauty. 🌹✨ #weddingcake #luxurybaking #confectionery #cakeasy',
    likes: 2405,
    commentsCount: 89,
    date: '1 day ago',
    comments: [
      { username: 'the_wedding_planners_india', text: 'Absolutely breathtaking work!' },
      { username: 'pooja_sharma', text: 'Do you deliver to South Mumbai?' },
      { username: 'cakeasy.in', text: '@pooja_sharma Yes Pooja, we deliver customized wedding cakes across the city with temperature-controlled transit.' }
    ]
  },
  {
    id: 'ig-3',
    imageUrl: '/src/assets/images/cakeasy_drip_cake_1784021848957.jpg',
    caption: 'Macarons, white chocolate drip, and fresh berries—a celebration of elegance and texture. What occasion are we celebrating today? 🍓🍰 #celebrationcakes #dripcake #instacake #aestheticbaking',
    likes: 1892,
    commentsCount: 45,
    date: '3 days ago',
    comments: [
      { username: 'priya_k', text: 'This was the star of my mom’s birthday party! Tasted like heaven too.' },
      { username: 'cakeasy.in', text: 'Thank you @priya_k! Made our day hearing this ❤️' }
    ]
  }
];

export const FAQS = [
  {
    question: 'How far in advance should I place my order?',
    answer: 'For standard and bento cakes, we recommend ordering 24–48 hours in advance. For customized celebration cakes and complex wedding orders, we request at least 5–7 days notice so we can source specific design elements and cure decorations.',
  },
  {
    question: 'Do you offer eggless options?',
    answer: 'Yes! 100% of our cake flavors can be crafted eggless upon request. We strictly maintain clean workspace guidelines and distinct utensils to avoid cross-contamination for eggless and allergen-friendly baking.',
  },
  {
    question: 'Do you offer home delivery? What are the charges?',
    answer: 'We provide specialized temperature-controlled delivery across the metropolitan area to ensure your cake arrives in pristine, display-ready condition. Delivery charges are calculated dynamically based on distance from our boutique studio kitchen.',
  },
  {
    question: 'Can I upload my own custom inspiration image?',
    answer: 'Absolutely! Our "Custom Cakes" portal lets you select the shape, tier configurations, size, and flavor, and upload any reference photograph. Our head baker will personally review and contact you to finalize the design.',
  },
  {
    question: 'What is your refund/cancellation policy?',
    answer: 'As all orders are custom-baked to order, cancellations made 48 hours prior to delivery qualify for a 100% store credit refund. Cancellations made within 24–48 hours receive a 50% refund, while orders canceled under 24 hours from scheduled delivery are non-refundable.',
  }
];

export const MEET_THE_TEAM = [
  {
    name: 'Ananya Roy',
    role: 'Founder & Head Pâtissier',
    bio: 'Trained at Le Cordon Bleu, Paris. Ananya founded Cakeasy with the philosophy that a cake should taste even more spectacular than it looks.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Chef Kabir Malhotra',
    role: 'Master Decorator',
    bio: 'A former sculptor turned pastry designer, Kabir specializes in intricate sugar craft, hand-piping, and hyper-realistic floral confections.',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400'
  }
];
