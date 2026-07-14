import React, { useState, useEffect } from 'react';
import { MessageCircle, Sparkles, X } from 'lucide-react';

interface WhatsAppButtonProps {
  whatsappNumber?: string;
}

export default function WhatsAppButton({ whatsappNumber }: WhatsAppButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after a slight delay to capture user attention without being intrusive
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = whatsappNumber || '919876543210'; // Dynamically read from settings
    const message = encodeURIComponent("Hi Cakeasy! I'm visiting your website and would love to inquire about ordering a custom cake. ✨");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {showTooltip && (
        <div className="mb-3 bg-white text-[#1E1E1E] px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(214,51,132,0.12)] border border-[#FFF5F8] max-w-xs text-sm font-sans flex items-start gap-2.5 animate-bounce pointer-events-auto">
          <div className="p-1 rounded-full bg-[#FFF5F8] text-[#D63384] shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[#D63384] tracking-wider uppercase">Chit-chat with our Baker</p>
            <p className="text-xs text-gray-500 mt-0.5">Need a cake designed today? Let’s talk on WhatsApp!</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-gray-300 hover:text-gray-500 transition-colors p-0.5 ml-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <button
        id="whatsapp-floating-trigger"
        onClick={handleWhatsAppClick}
        className="pointer-events-auto bg-[#25D366] hover:bg-[#20ba59] text-white p-4 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.45)] hover:scale-105 transition-all duration-300 flex items-center justify-center group relative"
        aria-label="Contact us on WhatsApp"
      >
        <span className="absolute right-full mr-3 bg-[#1E1E1E] text-white text-xs font-medium px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
          Chat with us on WhatsApp
        </span>
        <MessageCircle className="h-6 w-6 fill-white stroke-none" />
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-[#D63384] rounded-full border-2 border-white animate-pulse" />
      </button>
    </div>
  );
}
