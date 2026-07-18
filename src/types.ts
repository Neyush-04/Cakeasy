export interface AtelierSettings {
  instagramUrl: string;
  instagramHandle: string;
  whatsappNumber: string;
  address: string;
  email: string;
  bannerImage: string;
  egglessPremium: number;
  base1Tier: number;
  base2Tiers: number;
  base3Tiers: number;
  deliveryFeePerKm: number;
}

export interface PromoCoupon {
  code: string;
  discount: string;
  type: 'percentage' | 'fixed' | 'shipping';
  active: boolean;
}

export interface CustomCakeState {
  tiers: 1 | 2 | 3;
  shape: 'round' | 'square' | 'heart';
  flavor: string;
  frostingColor: string; // hex or tailwind color
  frostingStyle: 'smooth' | 'rustic' | 'textured';
  toppings: string[];
  message: string;
  referenceImageName?: string;
  referenceAttached?: boolean;
}

export interface CakeInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryDate: string;
  cakeState: CustomCakeState;
  status: 'pending' | 'accepted' | 'completed';
  timestamp: string;
  notes?: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  images?: string[];
  caption: string;
  likes: number;
  commentsCount: number;
  date: string;
  comments: { username: string; text: string }[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  category: 'bento' | 'celebration' | 'wedding' | 'cupcakes';
  image: string;
  popularFlavors: string[];
}
