import React, { useState } from 'react';
import { Menu, X, ShoppingBag, Heart, Instagram, Mail, Globe, MessageCircle } from 'lucide-react';
import logo from '../assets/brand/cakeasy-logo-web.webp';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  toggleCart: () => void;
  toggleWishlist: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  cartCount,
  wishlistCount,
  toggleCart,
  toggleWishlist,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Our Cakes' },
    { id: 'custom', label: 'Custom Cakes' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'Our Story' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleTabSelect = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#FFF5F8] transition-all duration-300">
      <div className="border-b border-[#FFF5F8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
            Neha Chaudhary's Cakeasy Studio
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <a
              href="https://wa.me/918810795004"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[0_6px_18px_rgba(37,211,102,0.28)] hover:bg-[#20ba59] transition-colors"
              aria-label="WhatsApp Cakeasy"
            >
              <MessageCircle className="h-4 w-4 fill-white stroke-white" /> WhatsApp
            </a>
            <a
              href="https://www.instagram.com/cakeasy99/"
              target="_blank"
              rel="noreferrer"
              className="h-9 w-9 rounded-full border border-pink-100 bg-[#FFF5F8] text-[#D63384] flex items-center justify-center hover:bg-[#D63384] hover:text-white transition-colors"
              aria-label="Cakeasy Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="mailto:cakeasy94@gmail.com"
              className="h-9 w-9 rounded-full border border-pink-100 bg-white text-gray-500 flex items-center justify-center hover:text-[#D63384] hover:border-[#F6B8C8] transition-colors"
              aria-label="Email Cakeasy"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="https://cakeasy.in"
              target="_blank"
              rel="noreferrer"
              className="h-9 w-9 rounded-full border border-pink-100 bg-white text-gray-500 flex items-center justify-center hover:text-[#D63384] hover:border-[#F6B8C8] transition-colors"
              aria-label="Cakeasy website"
            >
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          {/* Logo Section */}
          <div 
            onClick={() => handleTabSelect('home')}
            className="flex items-center cursor-pointer group"
          >
            <img
              src={logo}
              alt="Cakeasy Premium Cakes"
              className="h-20 w-auto max-w-[180px] object-contain object-left transition-transform duration-300 group-hover:scale-[1.02] sm:max-w-[210px]"
            />
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`relative py-2 text-sm font-medium tracking-wide transition-colors uppercase ${
                  currentTab === item.id
                    ? 'text-[#D63384]'
                    : 'text-gray-600 hover:text-[#1E1E1E]'
                }`}
              >
                {item.label}
                {currentTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D63384] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-4">
            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className="p-2 text-gray-600 hover:text-[#D63384] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#D63384] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="p-2 text-gray-600 hover:text-[#D63384] transition-colors relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#D63384] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-[#FFF5F8] px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors uppercase tracking-wider ${
                currentTab === item.id
                  ? 'bg-[#FFF5F8] text-[#D63384]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
