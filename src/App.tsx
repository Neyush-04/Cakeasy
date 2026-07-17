import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import CustomBuilderView from './components/CustomBuilderView';
import GalleryView from './components/GalleryView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import CartSidebar from './components/CartSidebar';
import QuickViewModal from './components/QuickViewModal';
import WhatsAppButton from './components/WhatsAppButton';
import PageMeta from './components/PageMeta';

import { ALL_PRODUCTS, INSTAGRAM_POSTS } from './data';
import { MenuItem, CustomCakeState, AtelierSettings, InstagramPost } from './types';
import { ShieldCheck, Sparkles, X, Heart, ShoppingBag } from 'lucide-react';

import { 
  collection, 
  getDocs, 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

interface CartItem {
  product: MenuItem;
  flavor: string;
  weight: string;
  message: string;
  quantity: number;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '');
  const setCurrentTab = (tab: string) => {
    navigate(tab === 'home' ? '/' : `/${tab}`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Core application states lifted
  const [productsList, setProductsList] = useState<MenuItem[]>([]);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customInquiries, setCustomInquiries] = useState<{ cake: CustomCakeState; date: string; notes: string }[]>([]);
  const [galleryPosts, setGalleryPosts] = useState<InstagramPost[]>([]);

  // Dynamic configuration states
  const [atelierSettings, setAtelierSettings] = useState<AtelierSettings>({
    instagramUrl: 'https://www.instagram.com/cakeasy99/',
    instagramHandle: '@cakeasy99',
    whatsappNumber: '918810795004',
    address: 'Cakeasy, 4C-601, AWHO, Gr. Noida, Delhi NCR, 201310',
    email: 'cakeasy94@gmail.com',
    bannerImage: '/gallery/1/img1.jpg',
    egglessPremium: 100,
    base1Tier: 999,
    base2Tiers: 2499,
    base3Tiers: 4999,
    deliveryFeePerKm: 45
  });

  // A visitor may browse public content but must never seed or mutate Firestore.
  useEffect(() => {
    // Public catalogue read with a local fallback.
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (querySnapshot.empty) {
          setProductsList(ALL_PRODUCTS);
        } else {
          const loadedProducts: MenuItem[] = [];
          querySnapshot.forEach((doc) => {
            loadedProducts.push(doc.data() as MenuItem);
          });
          setProductsList(loadedProducts);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    };

    fetchProducts();

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'atelier'), (snapshot) => {
      if (!snapshot.exists()) {
        const defaultSettings: AtelierSettings = {
          instagramUrl: 'https://www.instagram.com/cakeasy99/',
          instagramHandle: '@cakeasy99',
          whatsappNumber: '918810795004',
          address: 'Cakeasy, 4C-601, AWHO, Gr. Noida, Delhi NCR, 201310',
          email: 'cakeasy94@gmail.com',
          bannerImage: '/gallery/1/img1.jpg',
          egglessPremium: 100,
          base1Tier: 999,
          base2Tiers: 2499,
          base3Tiers: 4999,
          deliveryFeePerKm: 45
        };
        setAtelierSettings(defaultSettings);
      } else {
        setAtelierSettings(snapshot.data() as AtelierSettings);
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
    });

    // Realtime listener for approved Instagram/gallery posts.
    const unsubscribeGallery = onSnapshot(collection(db, 'instagram_posts'), (snapshot) => {
      if (snapshot.empty) {
        setGalleryPosts(INSTAGRAM_POSTS);
      } else {
        const loadedPosts: InstagramPost[] = [];
        snapshot.forEach((doc) => {
          loadedPosts.push(doc.data() as InstagramPost);
        });
        const approvedPosts = loadedPosts.filter((post) => !post.imageUrl.includes('unsplash.com'));
        setGalleryPosts(approvedPosts.length ? approvedPosts : INSTAGRAM_POSTS);
      }
    }, (error) => {
      console.error("Error fetching instagram posts:", error);
    });

    return () => {
      unsubscribeSettings();
      unsubscribeGallery();
    };
  }, []);

  // Policy Modal States
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

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
    // WhatsApp is the current handoff. No visitor data is written to Firestore.
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
                  <>
                    <PageMeta
                      title="Cakeasy | Custom Cakes in Greater Noida & Delhi NCR"
                      description="Cakeasy is a home bakery in Greater Noida crafting custom bento cakes, wedding cakes, celebration cakes, and cupcakes. Order fresh, handcrafted cakes for your next milestone via WhatsApp."
                    />
                    <HomeView
                      products={productsList}
                      setCurrentTab={setCurrentTab}
                      setSelectedProduct={setSelectedProduct}
                      toggleWishlist={handleToggleWishlist}
                      wishlistedIds={wishlistedIds}
                      settings={atelierSettings}
                      galleryPosts={galleryPosts}
                    />
                  </>
                }
              />

              <Route
                path="/catalog"
                element={
                  <>
                    <PageMeta
                      title="Our Cakes | Cakeasy Catalog — Bento, Wedding & Celebration Cakes"
                      description="Browse Cakeasy's full menu of bento cakes, wedding cakes, celebration cakes, and cupcakes. Custom flavors and designs, handcrafted to order in Greater Noida."
                    />
                    <CatalogView
                      products={productsList}
                      setSelectedProduct={setSelectedProduct}
                      toggleWishlist={handleToggleWishlist}
                      wishlistedIds={wishlistedIds}
                    />
                  </>
                }
              />

              <Route
                path="/custom"
                element={
                  <>
                    <PageMeta
                      title="Custom Cake Builder | Cakeasy"
                      description="Design your own custom cake with Cakeasy — choose shape, size, flavor, and upload inspiration photos. We'll bring your vision to life."
                    />
                    <CustomBuilderView
                      onAddCustomInquiry={handleAddCustomInquiry}
                      settings={atelierSettings}
                    />
                  </>
                }
              />

              <Route
                path="/gallery"
                element={
                  <>
                    <PageMeta
                      title="Cake Gallery | Cakeasy Instagram Showcase"
                      description="See real cakes handcrafted by Cakeasy — browse our Instagram-style gallery of bento cakes, wedding cakes, and celebration cakes from Greater Noida."
                    />
                    <GalleryView
                      posts={galleryPosts}
                    />
                  </>
                }
              />

              <Route
                path="/about"
                element={
                  <>
                    <PageMeta
                      title="Our Story | About Cakeasy"
                      description="Meet the home baker behind Cakeasy — a Greater Noida cake studio crafting custom, handmade cakes for every celebration."
                    />
                    <AboutView />
                  </>
                }
              />

              <Route
                path="/contact"
                element={
                  <>
                    <PageMeta
                      title="Contact & Track Order | Cakeasy"
                      description="Contact Cakeasy via WhatsApp or Instagram DM, find our Greater Noida address, or track your custom cake order."
                    />
                    <ContactView />
                  </>
                }
              />

              <Route path="/admin" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. PREMIUM PERSISTENT FOOTER */}
      <Footer
        setCurrentTab={setCurrentTab}
        openPolicyModal={(policyType) => setActivePolicy(policyType)}
        settings={atelierSettings}
      />

      {/* 4. WHATSAPP FLOATING CTA INTEGRATION */}
      <WhatsAppButton whatsappNumber={atelierSettings.whatsappNumber} />

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
        whatsappNumber={atelierSettings.whatsappNumber}
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
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-500 leading-relaxed font-sans">
              {activePolicy === 'privacy' && (
                <>
                  <p>Cakeasy currently uses WhatsApp to receive and confirm enquiries. The website does not offer customer accounts or online payment.</p>
                  <p>For privacy questions about an enquiry, please contact Cakeasy on WhatsApp.</p>
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
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
