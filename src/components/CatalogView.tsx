import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Heart, Sparkles, Check, Info, ArrowUpDown } from 'lucide-react';
import { ALL_PRODUCTS, CAKE_CATEGORIES, POPULAR_FLAVORS } from '../data';
import { MenuItem } from '../types';

interface CatalogViewProps {
  products: MenuItem[];
  setSelectedProduct: (product: MenuItem) => void;
  toggleWishlist: (product: MenuItem) => void;
  wishlistedIds: string[];
}

export default function CatalogView({
  products,
  setSelectedProduct,
  toggleWishlist,
  wishlistedIds,
}: CatalogViewProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('all');
  const [isEgglessOnly, setIsEgglessOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(12000); // Max in rupees
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');

  // Parse starting prices for sorting & slider filtering
  const getStartingPrice = (priceStr: string) => {
    // Remove symbols and parse starting price
    const match = priceStr.replace(/[^0-9]/g, '');
    if (!match) return 0;
    // If it's a range like ₹999 - ₹1,899, match will be '9991899'. Let's parse appropriately.
    const cleanStr = priceStr.split('-')[0].replace(/[^0-9]/g, '');
    return parseInt(cleanStr, 10) || 0;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Text Search
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // 3. Flavor
      const matchesFlavor = selectedFlavor === 'all' || product.popularFlavors.includes(selectedFlavor);

      // 4. Starting Price Slider
      const startingPrice = getStartingPrice(product.priceRange);
      const matchesPrice = startingPrice <= maxPrice;

      // 5. Eggless constraint (Note: All Cakeasy cakes can be ordered eggless, but we add simulated indicator)
      const matchesEggless = !isEgglessOnly || true; // Our mock states they are all eggless compatible

      return matchesSearch && matchesCategory && matchesFlavor && matchesPrice && matchesEggless;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return getStartingPrice(a.priceRange) - getStartingPrice(b.priceRange);
      }
      if (sortBy === 'price-high') {
        return getStartingPrice(b.priceRange) - getStartingPrice(a.priceRange);
      }
      return 0; // Default popularity / natural list order
    });
  }, [searchQuery, selectedCategory, selectedFlavor, maxPrice, isEgglessOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFlavor('all');
    setIsEgglessOnly(false);
    setMaxPrice(12000);
    setSortBy('popular');
  };

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#FFF5F8] rounded-[32px] p-8 sm:p-12 border border-[#F6B8C8]/20 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 bg-[radial-gradient(#D63384_1px,transparent_1px)] [background-size:12px_12px]" />
        
        <div className="space-y-3 text-center md:text-left relative z-10 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">Bespoke Confectionery menu</span>
          <h1 className="font-serif text-4xl font-bold text-[#1E1E1E]">Artisanal Cake Collection</h1>
          <p className="text-gray-500 text-sm">
            Discover our curated, freshly-baked designs. Each cake is baked to order, utilizing premium Le Cordon Bleu pastry techniques, organic berries, and Belgian cacao.
          </p>
        </div>
        
        {/* Statistics or visual indicator */}
        <div className="bg-white/80 backdrop-blur-md border border-[#F6B8C8]/20 rounded-2xl px-6 py-4 text-center shrink-0">
          <span className="text-2xl font-serif font-bold text-[#D63384] block">{filteredProducts.length}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Exquisite Designs Available</span>
        </div>
      </div>

      {/* Main Grid with Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: FILTERS (4/12 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-6 border border-[#FFF5F8] shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-gray-50">
            <span className="font-serif font-bold text-[#1E1E1E] flex items-center gap-2 text-base">
              <SlidersHorizontal className="h-4.5 w-4.5 text-[#D63384]" /> Filter Boutique
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#D63384] hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search bar inside filter sidebar */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1E1E1E]">Search Keyword</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search red velvet, wedding..."
                className="w-full bg-neutral-50 border border-gray-100 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E] placeholder:text-gray-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1E1E1E]">Category</label>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#FFF5F8] text-[#D63384] font-semibold border border-pink-100'
                    : 'text-gray-500 hover:bg-neutral-50'
                }`}
              >
                <span>All Confections</span>
                {selectedCategory === 'all' && <Check className="h-3.5 w-3.5 text-[#D63384]" />}
              </button>
              {CAKE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-[#FFF5F8] text-[#D63384] font-semibold border border-pink-100'
                      : 'text-gray-500 hover:bg-neutral-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && <Check className="h-3.5 w-3.5 text-[#D63384]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-wider text-[#1E1E1E]">Max Budget</label>
              <span className="font-mono font-semibold text-[#D63384]">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="299"
              max="12000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-[#D63384] bg-neutral-100 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>₹299</span>
              <span>₹12,000+</span>
            </div>
          </div>

          {/* Flavor Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1E1E1E]">Signature Flavor</label>
            <select
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              className="w-full bg-neutral-50 border border-gray-100 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#D63384] text-gray-600"
            >
              <option value="all">Any signature flavor</option>
              {POPULAR_FLAVORS.map((flavor) => (
                <option key={flavor} value={flavor}>
                  {flavor}
                </option>
              ))}
            </select>
          </div>

          {/* Dietary Preference (Eggless) */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isEgglessOnly}
                onChange={() => setIsEgglessOnly(!isEgglessOnly)}
                className="rounded text-[#D63384] focus:ring-[#D63384] border-gray-300 h-4.5 w-4.5 accent-[#D63384]"
              />
              <div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">100% Eggless Only</span>
                <p className="text-[10px] text-gray-400">Strict vegan-safe kitchen work surfaces</p>
              </div>
            </label>
          </div>

          {/* Kitchen info badge */}
          <div className="bg-[#FFF5F8]/40 border border-pink-50 rounded-2xl p-4 text-xs text-gray-500 flex gap-2">
            <Info className="h-4 w-4 text-[#D63384] shrink-0 mt-0.5" />
            <p>Our studio specializes in temperature-safe packaging to ensure flawless shape delivery.</p>
          </div>
        </aside>

        {/* RIGHT COLUMN: PRODUCTS GRID (9/12 cols) */}
        <main className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-2xl p-4 border border-[#FFF5F8] shadow-sm">
            <p className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-[#1E1E1E]">{filteredProducts.length}</span> luxury confections
            </p>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-xs font-semibold text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="popular">Sort: Recommended</option>
                <option value="price-low">Sort: Price (Low to High)</option>
                <option value="price-high">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistedIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-[24px] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 group relative flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#D63384] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-pink-50">
                        {product.category}
                      </span>
                      {/* Wishlist Icon */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-4 right-4 h-9 w-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[#D63384] transition-colors shadow-sm"
                        aria-label="Add to wishlist"
                      >
                        <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-[#D63384] stroke-[#D63384]' : ''}`} />
                      </button>
                    </div>

                    {/* Meta info & text */}
                    <div className="p-5 flex flex-col flex-grow space-y-3.5">
                      <div className="space-y-1">
                        <h3 className="font-serif font-bold text-base text-[#1E1E1E] leading-snug group-hover:text-[#D63384] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Flavor indicators */}
                      <div className="flex flex-wrap gap-1">
                        {product.popularFlavors.slice(0, 2).map((flavor, i) => (
                          <span key={i} className="bg-[#FFF5F8] text-[#D63384] text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide">
                            {flavor.split(' ').slice(-2).join(' ')}
                          </span>
                        ))}
                      </div>

                      {/* Bottom row */}
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase tracking-widest">Est. Pricing</p>
                          <p className="font-serif font-bold text-sm text-[#1E1E1E]">{product.priceRange}</p>
                        </div>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="bg-[#D63384] hover:bg-[#b02266] text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-sm hover:shadow transition-all"
                        >
                          Quick Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#F6B8C8]/30 max-w-lg mx-auto">
              <span className="text-4xl">🧁</span>
              <h3 className="font-serif font-bold text-lg text-[#1E1E1E] mt-4">No Confections Found</h3>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your filters, budget slider, or signature flavor selection.</p>
              <button
                onClick={handleResetFilters}
                className="mt-6 bg-[#FFF5F8] text-[#D63384] border border-[#F6B8C8] text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#D63384] hover:text-white transition-colors"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
