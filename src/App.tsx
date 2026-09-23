import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import CustomBuilderView from './components/CustomBuilderView';
import GalleryView from './components/GalleryView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import ConsultationView from './components/ConsultationView';
import CategoryView from './components/CategoryView';
import CartSidebar from './components/CartSidebar';
import QuickViewModal from './components/QuickViewModal';
import WhatsAppButton from './components/WhatsAppButton';
import PageMeta from './components/PageMeta';
import ConsentBanner from './components/ConsentBanner';

import { ALL_PRODUCTS, INSTAGRAM_POSTS } from './data';
import { CAKE_CATEGORY_DATA } from './data/categoryData';
import { MenuItem, CustomCakeState, AtelierSettings, InstagramPost } from './types';
import { siteSettings } from './lib/runtime';
import { Sparkles, X } from 'lucide-react';

// The CMS is a separate bundle, so visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));

interface CartItem {
  product: MenuItem;
  flavor: string;
  weight: string;
  message: string;
  quantity: number;
}

const atelierSettings: AtelierSettings = {
  instagramUrl: siteSettings.instagramUrl,
  instagramHandle: siteSettings.instagramHandle,
  whatsappNumber: siteSettings.whatsappNumber,
  address: siteSettings.address,
  email: siteSettings.email,
  bannerImage: '/gallery/1/img1.jpg',
  egglessPremium: 100,
  base1Tier: 999,
  base2Tiers: 2499,
  base3Tiers: 4999,
  deliveryFeePerKm: 45
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  const currentTab = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '');
  const setCurrentTab = (tab: string) => {
    navigate(tab === 'home' ? '/' : `/${tab}`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const productsList = ALL_PRODUCTS;
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customInquiries, setCustomInquiries] = useState<{ cake: CustomCakeState; date: string; notes: string }[]>([]);
  const [galleryPosts, setGalleryPosts] = useState<InstagramPost[]>(INSTAGRAM_POSTS);

  useEffect(() => {
    if (isAdmin) return;
    const controller = new AbortController();

    async function loadInstagramGallery() {
      try {
        const response = await fetch('/api/instagram', {
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) return;

        const payload = await response.json();
        const syncedPosts = Array.isArray(payload?.posts) ? payload.posts : [];

        if (syncedPosts.length > 0) {
          setGalleryPosts(syncedPosts);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    loadInstagramGallery();

    return () => controller.abort();
  }, [isAdmin]);

  // Policy Modal States
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  if (isAdmin) {
    return (
      <>
        <PageMeta pathname={location.pathname} />
        <Suspense fallback={<div className="min-h-screen bg-[#FBF8F7]" />}>
          <AdminApp />
        </Suspense>
      </>
    );
  }

  // Cart actions
  const handleAddToCart = (product: MenuItem, flavor: string, weight: string, message: string, qty: number) => {
    setCartItems(prev => [
      ...prev,
      { product, flavor, weight, message, quantity: qty }
    ]);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCartQty = (index: number, newQty: number) => {
    setCartItems(prev => prev.map((item, i) => {
      if (i === index) return { ...item, quantity: newQty };
      return item;
    }));
  };

  // Custom cake inquiries list
  const handleAddCustomInquiry = (cake: CustomCakeState, date: string, notes: string) => {
    setCustomInquiries(prev => [...prev, { cake, date, notes }]);
  };

  const handleCheckoutOrders = () => {
    setCartItems([]);
  };

  const handleRemoveInquiry = (index: number) => {
    setCustomInquiries(prev => prev.filter((_, i) => i !== index));
  };

  // Wishlist actions
  const handleToggleWishlist = (product: MenuItem) => {
    setWishlistedIds(prev =>
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans text-[#1E1E1E] antialiased">
      <PageMeta pathname={location.pathname} />

      {/* 1. STICKY TOP NAVBAR */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={cartItems.length + customInquiries.length}
        wishlistCount={wishlistedIds.length}
        toggleCart={() => setCartOpen(true)}
        toggleWishlist={() => {
          // Jump to catalogue filtered or showcase list
          setCurrentTab('catalog');
        }}
      />

      {/* 2. MAIN SCROLLABLE CONTENT VIEW STAGE */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <HomeView
                    products={productsList}
                    setCurrentTab={setCurrentTab}
                    setSelectedProduct={setSelectedProduct}
                    toggleWishlist={handleToggleWishlist}
                    wishlistedIds={wishlistedIds}
                    settings={atelierSettings}
                    galleryPosts={galleryPosts}
                  />
                }
              />

              <Route
                path="/weddings"
                element={<CategoryView config={CAKE_CATEGORY_DATA.wedding} setCurrentTab={setCurrentTab} />}
              />

              <Route
                path="/cakes/:slug"
                element={<CategoryRoute setCurrentTab={setCurrentTab} />}
              />

              <Route
                path="/catalog"
                element={
                  <CatalogView
                    products={productsList}
                    setSelectedProduct={setSelectedProduct}
                    toggleWishlist={handleToggleWishlist}
                    wishlistedIds={wishlistedIds}
                  />
                }
              />

              <Route
                path="/custom"
                element={
                  <CustomBuilderView
                    onAddCustomInquiry={handleAddCustomInquiry}
                    settings={atelierSettings}
                  />
                }
              />

              <Route path="/gallery" element={<GalleryView posts={galleryPosts} />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/consultation" element={<ConsultationView />} />
              <Route path="/contact" element={<ContactView />} />
              <Route path="*" element={<NotFoundView />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. PREMIUM PERSISTENT FOOTER */}
      <Footer
        openPolicyModal={(policyType) => setActivePolicy(policyType)}
        settings={atelierSettings}
      />

      {/* 4. WHATSAPP FLOATING CTA INTEGRATION */}
      <WhatsAppButton />

      <ConsentBanner />

      {/* 5. SLIDE-IN CART & INQUIRY CHECKOUT SIDEBAR */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        customInquiries={customInquiries}
        onRemoveItem={handleRemoveCartItem}
        onRemoveInquiry={handleRemoveInquiry}
        onUpdateQty={handleUpdateCartQty}
        onCheckoutOrders={handleCheckoutOrders}
      />

      {/* 6. PRODUCT QUICK VIEW MODAL */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          toggleWishlist={handleToggleWishlist}
          isWishlisted={wishlistedIds.includes(selectedProduct.id)}
        />
      )}

      {/* 7. POLICY MODALS SCREEN (PRIVACY, TERMS, CANCELLATION) */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full border border-[#FFF5F8] text-left space-y-6 shadow-2xl animate-scaleIn max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#D63384]" />
                <h3 className="font-serif font-bold text-xl text-[#1E1E1E]">
                  {activePolicy === 'privacy' && 'Privacy Policy'}
                  {activePolicy === 'terms' && 'Terms of Service'}
                  {activePolicy === 'refund' && 'Cancellation & Refund Guidelines'}
                </h3>
              </div>
              <button
                onClick={() => setActivePolicy(null)}
                className="h-9 w-9 hover:bg-[#FFF5F8] text-gray-400 hover:text-[#D63384] rounded-full flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-500 leading-relaxed font-sans">
              {activePolicy === 'privacy' && (
                <>
                  <p>When you send an enquiry from this website (consultation brief, custom cake simulator, contact form or enquiry list), Cakeasy saves the details you enter, such as your name, phone, email, event date and cake brief, so that Neha can reply and prepare a quotation. The conversation then continues on WhatsApp.</p>
                  <p>We also note how you reached the site (for example an Instagram or Google campaign link) to understand which channels help people find us. Photos you choose in the forms are not uploaded; you attach them yourself in WhatsApp.</p>
                  <p>Optional analytics and advertising cookies are used only if you accept them, and you can change that choice at any time from "Cookie preferences" in the footer. The website does not offer customer accounts or online payment.</p>
                  <p>To see, correct or delete the details of your enquiry, message Cakeasy on WhatsApp or email {siteSettings.email}.</p>
                </>
              )}

              {activePolicy === 'terms' && (
                <>
                  <p>Cake designs, availability, pricing, delivery, and pickup details are confirmed directly with Cakeasy before an order is accepted.</p>
                </>
              )}

              {activePolicy === 'refund' && (
                <>
                  <p>Cancellation and refund terms for a custom order are confirmed directly with Cakeasy before the order is accepted.</p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-gray-50 text-right">
              <button
                onClick={() => setActivePolicy(null)}
                className="bg-[#D63384] hover:bg-[#b02266] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryRoute({ setCurrentTab }: { setCurrentTab: (tab: string) => void }) {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? CAKE_CATEGORY_DATA[slug as keyof typeof CAKE_CATEGORY_DATA] : undefined;

  if (!config || slug === 'wedding') {
    return <NotFoundView />;
  }

  return <CategoryView config={config} setCurrentTab={setCurrentTab} />;
}

function NotFoundView() {
  return (
    <section className="mx-auto my-10 max-w-xl rounded-3xl border border-[#EDE3E2] bg-[#FFF7FA] px-6 py-12 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D63384]">Page not found</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-[#251B21]">This page isn't on the menu.</h1>
      <p className="mt-3 text-sm text-gray-500">The link may be old or mistyped. Here are good places to start.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link to="/weddings" className="rounded-full bg-[#D63384] px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-[#B02266]">Wedding cakes</Link>
        <Link to="/gallery" className="rounded-full border border-[#F0B7C9] px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#D63384] hover:bg-white">Our work</Link>
        <Link to="/" className="rounded-full border border-[#EDE3E2] px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#43242F] hover:bg-white">Home</Link>
      </div>
    </section>
  );
}
