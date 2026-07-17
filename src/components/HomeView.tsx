import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, ArrowRight, Sparkles, Heart, Instagram, Star, ChevronLeft, ChevronRight, Clock, Truck, ShieldCheck } from 'lucide-react';
import { ALL_PRODUCTS, INSTAGRAM_POSTS } from '../data';
import { MenuItem, AtelierSettings, InstagramPost } from '../types';
import { resolveCakeImage } from '../utils';
import ScrollReveal from './ScrollReveal';
import TextSplitter from './TextSplitter';
import heroImage from '../assets/images/cakeasy_hero_banner_1784021815776.jpg';

interface HomeViewProps {
  products: MenuItem[];
  setCurrentTab: (tab: string) => void;
  setSelectedProduct: (product: MenuItem) => void;
  toggleWishlist: (product: MenuItem) => void;
  wishlistedIds: string[];
  settings: AtelierSettings;
  galleryPosts: InstagramPost[];
}

export default function HomeView({
  products,
  setCurrentTab,
  setSelectedProduct,
  toggleWishlist,
  wishlistedIds,
  settings,
  galleryPosts,
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrendingTab, setActiveTrendingTab] = useState<'trending' | 'new' | 'bestseller'>('trending');
  const hiddenReviews = [{ name: '', role: '', stars: 0, text: '', date: '' }];
  const reviews = hiddenReviews;
  const reviewIndex = 0;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const categories = [
    { id: 'bento', label: 'Bento Cakes', icon: '🧁', count: '12+ Designs', color: 'bg-pink-50 text-pink-700 hover:border-pink-200' },
    { id: 'wedding', label: 'Wedding Cakes', icon: '💒', count: '8 Masterpieces', color: 'bg-amber-50 text-amber-700 hover:border-amber-200' },
    { id: 'celebration', label: 'Celebrations', icon: '✨', count: '24+ Varieties', color: 'bg-purple-50 text-purple-700 hover:border-purple-200' },
    { id: 'cupcakes', label: 'Cupcakes & More', icon: '🥯', count: '10+ Flavors', color: 'bg-emerald-50 text-emerald-700 hover:border-emerald-200' },
  ];

  // Filter products based on active home tab
  const getFilteredTrending = () => {
    if (activeTrendingTab === 'new') {
      return products.slice().reverse();
    }
    if (activeTrendingTab === 'bestseller') {
      return products.length >= 3 
        ? [products[2], products[0], products[1]] 
        : products.slice(0, 3);
    }
    return products.slice(0, 3);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentTab('catalog');
      // Pass query in a stateful way if needed, for simplicity it transitions to the catalog.
    }
  };

  const handleNextReview = () => undefined;
  const handlePrevReview = () => undefined;

  return (
    <div className="space-y-24 pb-20 animate-fadeIn">
      {/* 1. HERO SECTION WITH BACKGROUND BANNER */}
      <section ref={heroRef} className="relative bg-[#FFF5F8] py-20 lg:py-28 overflow-hidden rounded-b-[40px] border-b border-[#F6B8C8]/30">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(#D63384_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#F6B8C8]/30 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#D63384]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#D63384]">Bespoke Confectionery</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1E1E1E] leading-tight">
                  <TextSplitter text="Crafting Sweet Memories." className="text-[#1E1E1E]" />
                </h1>
                <ScrollReveal delay={300}>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                    Artisanal customized cakes baked fresh to order. Premium ingredients and beautiful designs tailored for your milestones.
                  </p>
                </ScrollReveal>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentTab('catalog')}
                  className="bg-[#D63384] hover:bg-[#b02266] text-white font-medium px-8 py-4 rounded-full shadow-[0_4px_14px_rgba(214,51,132,0.3)] hover:shadow-[0_6px_20px_rgba(214,51,132,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Order Now <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentTab('custom')}
                  className="bg-white hover:bg-neutral-50 text-[#1E1E1E] border border-[#F6B8C8] font-medium px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Customize Cake <Sparkles className="h-4 w-4 text-[#D63384]" />
                </button>
              </div>

              {/* Dynamic search bar inside Hero */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search flavors, wedding or bento designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#F6B8C8]/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#D63384] focus:ring-1 focus:ring-[#D63384] transition-all text-[#1E1E1E] placeholder:text-gray-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FFF5F8] text-[#D63384] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#F6B8C8]/20 hover:bg-[#D63384] hover:text-white transition-colors"
                >
                  Find
                </button>
              </form>
            </div>

            {/* Right Large Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto w-full max-w-lg aspect-[4/5] rounded-[32px] overflow-hidden border-8 border-white shadow-[0_20px_50px_rgba(214,51,132,0.08)] bg-[#FFF5F8]">
                <motion.img
                  style={{ y: heroImageY, scale: heroImageScale }}
                  src={heroImage}
                  alt="Cakeasy cake creation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#FFF5F8]">
                  <p className="text-[10px] text-[#D63384] font-bold tracking-wider uppercase">Cakeasy creation</p>
                  <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Custom celebration cake</h3>
                  <p className="text-xs text-gray-500">Explore the Cakeasy gallery for more inspiration.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">Bespoke Categories</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1E1E]">Explore Our Sweet Creations</h2>
            <p className="text-gray-500 text-sm">Select a curated theme designed to add exquisite flair to your sweet celebration.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <ScrollReveal key={cat.id} delay={index * 100}>
              <div
                onClick={() => setCurrentTab('catalog')}
                className={`cursor-pointer border border-[#FFF5F8] rounded-[24px] p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1 bg-white h-full`}
              >
                <div className="h-16 w-16 mx-auto rounded-full bg-[#FFF5F8] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform mb-4">
                  {cat.icon}
                </div>
                <h3 className="font-serif font-bold text-base text-[#1E1E1E] group-hover:text-[#D63384] transition-colors">{cat.label}</h3>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. TRENDING CAKES SECTION */}
      <section className="bg-neutral-50 py-16 rounded-[40px] border border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">Daily Fresh Highlights</span>
              <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">Trending At Cakeasy Studio</h2>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex bg-white rounded-xl p-1 border border-[#FFF5F8] shadow-sm">
              {[
                { id: 'trending', label: 'Trending' },
                { id: 'new', label: 'New Arrivals' },
                { id: 'bestseller', label: 'Best Sellers' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTrendingTab(tab.id as any)}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                    activeTrendingTab === tab.id
                      ? 'bg-[#D63384] text-white shadow-sm'
                      : 'text-gray-500 hover:text-[#1E1E1E]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getFilteredTrending().map((product, index) => {
              const isWishlisted = wishlistedIds.includes(product.id);
              return (
                <ScrollReveal key={product.id} delay={index * 150} className="h-full">
                  <div
                    className="bg-white rounded-[24px] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full"
                  >
                    {/* Image container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                      <img
                        src={resolveCakeImage(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Badge */}
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#D63384] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-[#FFF5F8]">
                        {product.category === 'bento' ? 'Personal Bento' : product.category === 'wedding' ? 'Artisanal Wedding' : 'Celebration Special'}
                      </span>
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-4 right-4 h-9 w-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[#D63384] transition-colors shadow-sm"
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#D63384] stroke-[#D63384]' : ''}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-serif font-bold text-lg text-[#1E1E1E] leading-snug group-hover:text-[#D63384] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Flavors bar */}
                      <div className="flex flex-wrap gap-1">
                        {product.popularFlavors.slice(0, 2).map((flavor, index) => (
                          <span key={index} className="bg-[#FFF5F8] text-[#D63384] text-[10px] px-2 py-0.5 rounded font-medium">
                            {flavor}
                          </span>
                        ))}
                      </div>

                      {/* Pricing & CTA */}
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Starting at</p>
                          <p className="font-serif font-bold text-base text-[#1E1E1E]">{product.priceRange.split(' - ')[0]}</p>
                        </div>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="bg-[#FFF5F8] hover:bg-[#D63384] text-[#D63384] hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          Details & Baker Options
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentTab('catalog')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D63384] hover:text-[#b02266] transition-colors group"
            >
              Browse complete boutique menu <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        <ScrollReveal delay={0}>
          <div className="space-y-4 text-center">
            <div className="h-14 w-14 bg-[#FFF5F8] text-[#D63384] rounded-2xl flex items-center justify-center mx-auto border border-[#F6B8C8]/20 animate-pulse">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Bespoke Express Schedule</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Need a same-day custom cake? Our collection of signature bento cakes can be custom-piped and hand-delivered within 4 to 6 hours!
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="space-y-4 text-center">
            <div className="h-14 w-14 bg-[#FFF5F8] text-[#D63384] rounded-2xl flex items-center justify-center mx-auto border border-[#F6B8C8]/20">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Temperature-Controlled Transit</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Delivered in specialized, chilled boutique containers to prevent delicate custom toppings and intricate ganaches from losing form.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="space-y-4 text-center">
            <div className="h-14 w-14 bg-[#FFF5F8] text-[#D63384] rounded-2xl flex items-center justify-center mx-auto border border-[#F6B8C8]/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Allergen & Eggless Distinction</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Our kitchen runs a strict clean-workspace policy. All recipes can be ordered 100% eggless with organic, premium dairy alternatives.
            </p>
          </div>
        </ScrollReveal>
      </section>
      )}

      {false && (
      <section className="bg-[#FFF5F8]/60 py-16 rounded-[40px] border border-[#FFF5F8] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">Bespoke Celebrations</span>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex justify-center text-amber-400 gap-1">
              {[...Array(hiddenReviews[reviewIndex].stars)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 stroke-none" />
              ))}
            </div>
            
            <p className="font-serif text-xl sm:text-2xl text-gray-800 leading-relaxed italic">
              "{hiddenReviews[reviewIndex].text}"
            </p>
          </div>

          <div>
            <p className="font-serif font-bold text-base text-[#1E1E1E]">{hiddenReviews[reviewIndex].name}</p>
            <p className="text-xs text-[#D63384] font-medium mt-0.5">{reviews[reviewIndex].role} • {reviews[reviewIndex].date}</p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handlePrevReview}
              className="h-10 w-10 bg-white hover:bg-[#D63384] text-gray-600 hover:text-white rounded-full flex items-center justify-center border border-pink-100 shadow-sm transition-all"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextReview}
              className="h-10 w-10 bg-white hover:bg-[#D63384] text-gray-600 hover:text-white rounded-full flex items-center justify-center border border-pink-100 shadow-sm transition-all"
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
      )}

      {/* 6. Instagram showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">Join {settings.instagramHandle || "@cakeasy.in"}</span>
            <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">Follow Our Instagram Journey</h2>
          </div>
          <a
            href={settings.instagramUrl || "https://instagram.com/cakeasy.in"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#FFF5F8] border border-[#F6B8C8] text-[#D63384] font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all"
          >
            <Instagram className="h-4 w-4" /> Visit Instagram
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {(galleryPosts || []).slice(0, 3).map((post) => (
            <div
              key={post.id}
              onClick={() => setCurrentTab('gallery')}
              className="bg-white rounded-3xl overflow-hidden border border-neutral-100 group cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={resolveCakeImage(post.imageUrl)}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#D63384]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-sm gap-2">
                  <Instagram className="h-5 w-5" /> View Social Post
                </div>
              </div>
              <div className="p-5 flex-grow space-y-2">
                <div className="hidden">
                  <span>❤️ {post.likes} likes</span>
                  <span>💬 {post.comments?.length || 0} comments</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
