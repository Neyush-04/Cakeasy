import { Link } from 'react-router-dom';
import { MapPin, Instagram, Sparkles, MessageCircle, Facebook, Youtube } from 'lucide-react';
import { AtelierSettings } from '../types';
import { siteSettings } from '../lib/runtime';
import { whatsappUrl } from '../lib/whatsapp';
import { trackWhatsAppClick, trackingConfigured } from '../lib/analytics';
import { OPEN_CONSENT_EVENT } from './ConsentBanner';

interface FooterProps {
  openPolicyModal: (policyType: string) => void;
  settings?: AtelierSettings;
}

export default function Footer({ openPolicyModal, settings }: FooterProps) {
  const social = 'h-8 w-8 rounded-full bg-neutral-800 hover:bg-[#D63384] text-gray-300 hover:text-white flex items-center justify-center transition-all';

  return (
    <footer className="bg-[#1E1E1E] text-white pt-16 pb-12 overflow-hidden border-t border-[#D63384]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
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
              Neha Chaudhary's premium cake boutique in Greater Noida. Orders and availability are confirmed directly on WhatsApp.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings?.instagramUrl || 'https://www.instagram.com/cakeasy99/'}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-neutral-800 hover:bg-[#D63384] text-gray-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Instagram Link"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a href={whatsappUrl()} onClick={() => trackWhatsAppClick('footer')} target="_blank" rel="noreferrer" className={social} aria-label="WhatsApp Cakeasy">
                <MessageCircle className="h-4 w-4" />
              </a>
              {siteSettings.facebookUrl && <a href={siteSettings.facebookUrl} target="_blank" rel="noreferrer" className={social} aria-label="Cakeasy Facebook"><Facebook className="h-4 w-4" /></a>}
              {siteSettings.youtubeUrl && <a href={siteSettings.youtubeUrl} target="_blank" rel="noreferrer" className={social} aria-label="Cakeasy YouTube"><Youtube className="h-4 w-4" /></a>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#F6B8C8]">Browse</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['/weddings', 'Wedding & Milestone Cakes'],
                ['/cakes/designer', 'Designer Cakes'],
                ['/catalog', 'Our Cakes'],
                ['/custom', 'Custom Cake Simulator'],
                ['/gallery', 'Cake Gallery'],
                ['/about', 'Our Story'],
              ].map(([id, label]) => (
                <li key={id}>
                  <Link to={id} className="text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#F6B8C8]">Boutique</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#F6B8C8] shrink-0 mt-0.5" />
                <span>{settings?.address || 'Cakeasy, 4C-601, AWHO, Gr. Noida, Delhi NCR, 201310'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-[#F6B8C8] shrink-0" />
                <a href={whatsappUrl()} onClick={() => trackWhatsAppClick('footer-studio')} target="_blank" rel="noreferrer" className="hover:text-white">{siteSettings.phoneDisplay}</a>
              </li>
              <li className="pt-2 text-xs text-neutral-500 border-t border-neutral-800">
                Please confirm pickup, delivery, and hours before visiting.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#F6B8C8]">Policies</h3>
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
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-left w-full block">
                  Contact Cakeasy
                </Link>
              </li>
              {trackingConfigured && (
                <li>
                  <button onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="text-gray-400 hover:text-white transition-colors text-left w-full">
                    Cookie preferences
                  </button>
                </li>
              )}
              <li>
                <a href="/admin" rel="nofollow" className="text-neutral-500 hover:text-[#F6B8C8] transition-colors text-left w-full block">
                  Owner CMS
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Cakeasy. Crafted Sweet Memories. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Custom cakes by Cakeasy</span>
            <span className="text-[#D63384]">•</span>
            <span>Made with Love & Passion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
