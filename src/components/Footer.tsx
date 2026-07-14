import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Globe, Sparkles, ShieldCheck } from 'lucide-react';
import { AtelierSettings } from '../types';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openPolicyModal: (policyType: string) => void;
  settings?: AtelierSettings;
}

export default function Footer({ setCurrentTab, openPolicyModal, settings }: FooterProps) {
  const handleNavigation = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1E1E1E] text-white pt-16 pb-12 overflow-hidden border-t border-[#D63384]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-[#D63384]/20 flex items-center justify-center border border-[#D63384]/40">
                <Sparkles className="h-4.5 w-4.5 text-[#F6B8C8]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Cakeasy<span className="text-[#F6B8C8]">.</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting premium, luxurious, and highly customized artisanal confections for every milestone. Freshly baked with Le Cordon Bleu precision.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={settings?.instagramUrl || "https://instagram.com/cakeasy.in"} 
                target="_blank" 
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-neutral-800 hover:bg-[#D63384] text-gray-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Instagram Link"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-neutral-800 hover:bg-[#D63384] text-gray-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Facebook Link"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://cakeasy.in" 
                target="_blank" 
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-neutral-800 hover:bg-[#D63384] text-gray-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Website Link"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#F6B8C8]">Bake Boutique</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNavigation('home')} className="text-gray-400 hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('catalog')} className="text-gray-400 hover:text-white transition-colors">
                  Our Cakes (Filters)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('custom')} className="text-gray-400 hover:text-[#F6B8C8] transition-colors flex items-center gap-1.5">
                  Custom Cake Builder <span className="bg-[#D63384] text-[10px] font-bold px-1.5 py-0.5 rounded text-white scale-95">NEW</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('gallery')} className="text-gray-400 hover:text-white transition-colors">
                  Social Masonry Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('about')} className="text-gray-400 hover:text-white transition-colors">
                  Our Paris-Trained Story
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Schedule */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#F6B8C8]">Boutique Studio</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#F6B8C8] shrink-0 mt-0.5" />
                <span>
                  {settings?.address || "Bespoke Kitchen Studio, Phase II, Bandra West, Mumbai - 400050"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-[#F6B8C8] shrink-0" />
                <span>Official Web: <a href="https://cakeasy.in" target="_blank" rel="noreferrer" className="underline hover:text-white">cakeasy.in</a></span>
              </li>
              <li className="pt-2 text-xs text-neutral-500 border-t border-neutral-800">
                <span className="font-semibold text-neutral-400">Hours:</span> Tues - Sun: 10:00 AM - 9:00 PM (Monday Closed)
              </li>
            </ul>
          </div>

          {/* Custom SEO Details & Policy links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#F6B8C8]">Policies & Trust</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => openPolicyModal('privacy')} className="text-gray-400 hover:text-white transition-colors text-left w-full">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('terms')} className="text-gray-400 hover:text-white transition-colors text-left w-full">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('refund')} className="text-gray-400 hover:text-white transition-colors text-left w-full">
                  Cancellation & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('contact')} className="text-gray-400 hover:text-white transition-colors text-left w-full">
                  Track Custom Order Status
                </button>
              </li>
              <li className="pt-2">
                <button 
                  onClick={() => handleNavigation('admin')} 
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#F6B8C8] transition-colors group"
                >
                  <ShieldCheck className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                  <span>Admin Order Terminal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Structured Info Footer Row */}
        <div className="pt-8 mt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Cakeasy. Crafted Sweet Memories. All rights reserved.</p>
          <div className="flex gap-4">
            <span>SEO Optimized for Mumbai & Global Confectionaries</span>
            <span className="text-[#D63384]">•</span>
            <span>Made with Le Cordon Bleu Passion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
