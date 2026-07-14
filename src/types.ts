export interface CustomCakeState {
  tiers: 1 | 2 | 3;
  shape: 'round' | 'square' | 'heart';
  flavor: string;
  frostingColor: string; // hex or tailwind color
  frostingStyle: 'smooth' | 'rustic' | 'textured';
  toppings: string[];
  message: string;
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
