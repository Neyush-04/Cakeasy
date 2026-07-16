import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, MessageCircle, AlertTriangle } from 'lucide-react';
import { MenuItem, CustomCakeState } from '../types';
import { resolveCakeImage } from '../utils';

interface CartItem {
  product: MenuItem;
  flavor: string;
  weight: string;
  message: string;
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  customInquiries: { cake: CustomCakeState; date: string; notes: string }[];
  onRemoveItem: (index: number) => void;
  onRemoveInquiry: (index: number) => void;
  onUpdateQty: (index: number, newQty: number) => void;
  onCheckoutOrders?: (items: CartItem[]) => void;
  whatsappNumber?: string;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  customInquiries,
  onRemoveItem,
  onRemoveInquiry,
  onUpdateQty,
  onCheckoutOrders,
  whatsappNumber,
}: CartSidebarProps) {
  if (!isOpen) return null;

  const calculateSubtotal = () => {
    let sum = 0;
    cartItems.forEach((item) => {
      // Extract numeric value from pricing range e.g. "₹399 - ₹499" -> 399
      const basePrice = parseInt(item.product.priceRange.replace(/[^0-9]/g, '').slice(0, 3)) || 499;
      sum += basePrice * item.quantity;
    });
    return sum;
  };

  const handleCheckoutWhatsApp = () => {
    let text = `*New Order Inquiry from Cakeasy.in Web Portal* 🎂✨\n\n`;

    if (cartItems.length > 0) {
      text += `*🛍️ SHOPPING CART ITEMS:*\n`;
      cartItems.forEach((item, index) => {
        text += `${index + 1}. *${item.product.name}*\n`;
        text += `   - Flavor: ${item.flavor}\n`;
        text += `   - Weight: ${item.weight}\n`;
        text += `   - Message: "${item.message || 'None'}"\n`;
        text += `   - Qty: ${item.quantity}x\n\n`;
      });
    }

    if (customInquiries.length > 0) {
      text += `*🎨 BESPOKE CUSTOM CAKE DESIGNS:*\n`;
      customInquiries.forEach((item, index) => {
        text += `${index + 1}. *Bespoke ${item.cake.tiers} Tier ${item.cake.shape} Cake*\n`;
        text += `   - Frosting Color: ${item.cake.frostingColor}\n`;
        text += `   - Style: ${item.cake.frostingStyle}\n`;
        text += `   - Flavor Profile: ${item.cake.flavor}\n`;
        text += `   - Toppings Chosen: ${item.cake.toppings.join(', ') || 'Standard'}\n`;
        text += `   - Custom Message: "${item.cake.message || 'None'}"\n`;
        text += `   - Delivery Target Date: ${item.date || 'TBD'}\n`;
        text += `   - Baker Notes: ${item.notes || 'None'}\n\n`;
      });
    }

    text += `*📍 CONTACT DETAILS:*\n`;
    text += `- Please contact me to finalize flavor layers, transit coordinates, and billing options. Thank you!`;

    // Persist standard orders to Firestore before redirecting to WhatsApp
    if (cartItems.length > 0 && onCheckoutOrders) {
      onCheckoutOrders(cartItems);
    }

    const phoneNumber = whatsappNumber || '918810795004';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const isEmpty = cartItems.length === 0 && customInquiries.length === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1E1E1E]/50 backdrop-blur-sm flex justify-end">
      {/* Overlay back click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Cart Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-[#FFF5F8] animate-slideIn">
        
        {/* Top Header Row */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#D63384]" />
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Your Bake Cart</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FFF5F8] text-gray-400 hover:text-[#D63384] rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Middle Scrollable list */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {isEmpty ? (
            <div className="text-center py-20 space-y-4">
              <span className="text-4xl block">🧺</span>
              <h4 className="font-serif font-bold text-base text-[#1E1E1E]">Your Cart is Empty</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">Browse our catalogue or load the 10-step custom cake builder to craft sweet milestones.</p>
              <button
                onClick={onClose}
                className="bg-[#FFF5F8] text-[#D63384] border border-[#F6B8C8]/30 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase hover:bg-[#D63384] hover:text-white transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <>
              {/* Standard Cart Items */}
              {cartItems.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#D63384] border-b border-pink-50 pb-1.5">Standard Boutique Cakes</h4>
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-4 border border-gray-50 rounded-2xl p-4 relative group">
                      <img
                        src={resolveCakeImage(item.product.image)}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-neutral-100"
                      />
                      <div className="flex-grow space-y-1">
                        <h5 className="font-serif font-bold text-xs text-[#1E1E1E] leading-snug pr-6">{item.product.name}</h5>
                        <p className="text-[10px] text-gray-500">Flavor: {item.flavor}</p>
                        <p className="text-[10px] text-gray-500">Weight: {item.weight}</p>
                        {item.message && <p className="text-[10px] text-[#D63384] italic mt-0.5">"Message: {item.message}"</p>}
                        
                        {/* Qty controller & pricing */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 border border-neutral-100 rounded-lg p-0.5 bg-neutral-50 scale-90">
                            <button
                              onClick={() => onUpdateQty(index, Math.max(1, item.quantity - 1))}
                              className="px-2 py-0.5 hover:bg-white text-xs font-bold rounded"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQty(index, item.quantity + 1)}
                              className="px-2 py-0.5 hover:bg-white text-xs font-bold rounded"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs font-bold font-serif text-[#1E1E1E]">{item.product.priceRange.split(' - ')[0]}</span>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                        aria-label="Delete item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Cake Inquiries */}
              {customInquiries.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#D63384] border-b border-pink-50 pb-1.5">Custom Cake Builds</h4>
                  {customInquiries.map((inquiry, index) => (
                    <div key={index} className="flex gap-4 border border-pink-50 bg-[#FFF5F8]/20 rounded-2xl p-4 relative">
                      <div className="h-12 w-12 bg-[#FFF5F8] border border-[#F6B8C8] rounded-xl flex items-center justify-center text-xl shrink-0">
                        🎂
                      </div>
                      <div className="flex-grow space-y-1 text-xs">
                        <h5 className="font-serif font-bold text-xs text-[#1E1E1E] leading-snug">
                          {inquiry.cake.tiers} Tier {inquiry.cake.shape} Base
                        </h5>
                        <p className="text-[10px] text-gray-500">Flavor profile: {inquiry.cake.flavor}</p>
                        <p className="text-[10px] text-gray-500">Color: {inquiry.cake.frostingColor}</p>
                        <p className="text-[10px] text-gray-500">Toppings: {inquiry.cake.toppings.slice(0, 2).join(', ') || 'Classic'}</p>
                        {inquiry.date && <p className="text-[10px] font-semibold text-[#D63384] mt-1">Delivery: {inquiry.date}</p>}
                      </div>

                      {/* Remove inquiry button */}
                      <button
                        onClick={() => onRemoveInquiry(index)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                        aria-label="Delete custom inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Total & Checkout CTA */}
        {!isEmpty && (
          <div className="p-6 border-t border-gray-50 shrink-0 bg-[#FFF5F8]/40 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Standard Items Subtotal:</span>
                <span className="font-mono text-gray-800 font-bold">₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Delivery:</span>
                <span className="text-emerald-600 font-bold uppercase text-[10px]">Calculated distance-wise</span>
              </div>
              <div className="pt-2 border-t border-pink-100 flex justify-between items-center text-sm">
                <span className="font-serif font-bold text-[#1E1E1E]">Total Inquiries:</span>
                <span className="font-serif font-bold text-base text-[#D63384]">
                  {cartItems.length} Order(s) & {customInquiries.length} Design(s)
                </span>
              </div>
            </div>

            {/* Note about Whatsapp */}
            <div className="bg-white rounded-xl p-3 border border-pink-50 text-[10px] text-gray-500 flex gap-2">
              <AlertTriangle className="h-4 w-4 text-[#D63384] shrink-0 mt-0.5" />
              <p>Inquiries are instantly organized into a WhatsApp text. Final baking approvals are cleared directly by the Head Chef on WhatsApp.</p>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckoutWhatsApp}
              className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Send Consolidated Inquiry to WhatsApp <MessageCircle className="h-4 w-4 fill-white stroke-none" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
