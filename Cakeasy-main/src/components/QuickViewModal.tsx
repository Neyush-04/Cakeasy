import React, { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, Sparkles, AlertCircle, Info, Heart } from 'lucide-react';
import { MenuItem } from '../types';
import { POPULAR_FLAVORS } from '../data';
import { resolveCakeImage } from '../utils';

interface QuickViewModalProps {
  product: MenuItem | null;
  onClose: () => void;
  onAddToCart: (product: MenuItem, flavor: string, weight: string, message: string, qty: number) => void;
  toggleWishlist: (product: MenuItem) => void;
  isWishlisted: boolean;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  toggleWishlist,
  isWishlisted,
}: QuickViewModalProps) {
  if (!product) return null;

  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('1kg');
  const [cakeMessage, setCakeMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    // Default to the first popular flavor of the product
    if (product.popularFlavors.length > 0) {
      setSelectedFlavor(product.popularFlavors[0]);
    }
  }, [product]);

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedFlavor, selectedWeight, cakeMessage, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1500);
  };

  const getEstPriceNum = () => {
    const baseStr = product.priceRange.split(' - ')[0].replace(/[^0-9]/g, '');
    const base = parseInt(baseStr, 10) || 499;
    
    let multiplier = 1;
    if (selectedWeight === '2kg') multiplier = 1.8;
    if (selectedWeight === '3kg') multiplier = 2.6;
    if (selectedWeight === '0.5kg') multiplier = 0.6;

    return Math.round(base * multiplier * quantity);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Background click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative bg-white rounded-[32px] overflow-hidden max-w-4xl w-full border border-[#FFF5F8] grid grid-cols-1 md:grid-cols-2 shadow-2xl animate-scaleIn max-h-[90vh]">
        
        {/* Left Col: High-Res Image with badges */}
        <div className="relative bg-neutral-100 aspect-square md:h-full overflow-hidden">
          <img
            src={resolveCakeImage(product.image)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#D63384] text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-pink-50 shadow-sm">
            {product.category}
          </span>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm hover:bg-[#FFF5F8] text-gray-500 hover:text-[#D63384] rounded-full flex md:hidden items-center justify-center shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Right Col: Detailed Options */}
        <div className="p-6 sm:p-8 flex flex-col justify-between h-[45vh] md:h-auto overflow-y-auto">
          {/* Top Row: Title, close trigger */}
          <div className="flex justify-between items-start pb-4 border-b border-gray-50 shrink-0">
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[#D63384] font-bold">Cakeasy Artisanal Range</span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1E1E1E] leading-snug">{product.name}</h3>
              <p className="text-xs text-gray-400 font-medium">Starting from {product.priceRange}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2 rounded-xl border transition-all ${
                  isWishlisted 
                    ? 'bg-[#FFF5F8] text-[#D63384] border-[#F6B8C8]/40' 
                    : 'bg-neutral-50 text-gray-400 hover:text-gray-600 border-gray-100'
                }`}
                title="Wishlist item"
              >
                <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-[#D63384] stroke-[#D63384]' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="h-10 w-10 bg-neutral-100 hover:bg-[#FFF5F8] text-gray-400 hover:text-[#D63384] rounded-xl hidden md:flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scrolling Options Panel */}
          <div className="flex-grow overflow-y-auto my-4 space-y-5 pr-1 text-xs text-gray-600">
            <p className="text-xs leading-relaxed text-gray-500 font-sans">
              {product.description}
            </p>

            {/* Flavor dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-700">Choose Layer Flavor</label>
              <select
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
                className="w-full bg-neutral-50 border border-gray-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#D63384] text-gray-700 font-medium"
              >
                {product.popularFlavors.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight / Size chips */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-700">Choose Weight</label>
              <div className="flex flex-wrap gap-2">
                {['0.5kg', '1kg', '2kg', '3kg'].map((weightOption) => (
                  <button
                    key={weightOption}
                    onClick={() => setSelectedWeight(weightOption)}
                    className={`px-3.5 py-2 rounded-xl border font-semibold transition-all ${
                      selectedWeight === weightOption
                        ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384]'
                        : 'border-gray-100 text-gray-500 hover:bg-neutral-50'
                    }`}
                  >
                    {weightOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Piped Greeting text */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-700">Message on Cake (Piped text)</label>
              <input
                type="text"
                maxLength={40}
                placeholder="e.g., Happy Birthday Amit! 🎉"
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                className="w-full bg-neutral-50 border border-gray-100 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
              />
            </div>

            {/* Quantity select */}
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-700 block mb-1">Quantity</label>
                <div className="flex items-center gap-3 border border-neutral-100 rounded-xl p-1 bg-neutral-50 max-w-[110px]">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-2 py-1 bg-white hover:bg-gray-100 text-xs font-bold rounded shadow-sm"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-xs px-1 text-[#1E1E1E]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-2 py-1 bg-white hover:bg-gray-100 text-xs font-bold rounded shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Eggless note */}
              <div className="bg-[#FFF5F8]/40 border border-pink-50 p-2.5 rounded-xl text-[10px] text-gray-500 flex gap-1.5 flex-grow mt-4.5">
                <Info className="h-4 w-4 text-[#D63384] shrink-0" />
                <span>Default: 100% eggless compatible with clean-workspace baking rules.</span>
              </div>
            </div>
          </div>

          {/* Bottom Total Price & Action Button */}
          <div className="pt-4 border-t border-gray-50 shrink-0 flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest">Est. Subtotal</p>
              <p className="font-serif font-bold text-xl text-[#D63384]">₹{getEstPriceNum().toLocaleString()}</p>
            </div>

            <button
              onClick={handleAddToCartClick}
              disabled={addedSuccess}
              className={`flex-grow py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#D63384] hover:bg-[#b02266] text-white hover:shadow-lg'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="h-4 w-4" /> Added to Cart!
                </>
              ) : (
                <>
                  Add Custom Order <ShoppingBag className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
