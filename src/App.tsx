import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import CustomBuilderView from './components/CustomBuilderView';
import GalleryView from './components/GalleryView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import CartSidebar from './components/CartSidebar';
import QuickViewModal from './components/QuickViewModal';
import WhatsAppButton from './components/WhatsAppButton';

import { ALL_PRODUCTS } from './data';
import { MenuItem, CustomCakeState } from './types';
import { ShieldCheck, Sparkles, X, Heart, ShoppingBag } from 'lucide-react';

interface CartItem {
  product: MenuItem;
  flavor: string;
  weight: string;
  message: string;
  quantity: number;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Core application states lifted
  const [productsList, setProductsList] = useState<MenuItem[]>(ALL_PRODUCTS);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customInquiries, setCustomInquiries] = useState<{ cake: CustomCakeState; date: string; notes: string }[]>([]);
  
  // Simulated Order Database
  const [ordersList, setOrdersList] = useState<any[]>([
    { id: 'CK-7790', customer: 'Priya Sharma', cake: 'Pastel Lavender Bento Cake', status: 'piping', eta: 'Today at 5:30 PM' },
    { id: 'CK-8824', customer: 'Rohan Deshmukh', cake: 'Chilled White Chocolate Drip Cake', status: 'baking', eta: 'Tomorrow at 1:00 PM' },
    { id: 'CK-5510', customer: 'Ananya Mehta', cake: 'Artisanal Pastel Rose Wedding Cake', status: 'received', eta: 'July 20th at 12:00 PM' },
  ]);

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
    
    // Auto-append custom inquiry as a simulated trackable order!
    const mockId = `CK-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrdersList(prev => [
      {
        id: mockId,
        customer: 'You (Website Guest)',
        cake: `Bespoke ${cake.tiers} Tier ${cake.shape} Cake`,
        status: 'received',
        eta: date ? `${date} at 4:00 PM` : 'Scheduled TBD',
      },
      ...prev
    ]);
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

  // Admin CMS actions
  const handleAddProductCatalog = (newProduct: MenuItem) => {
    setProductsList(prev => [...prev, newProduct]);
  };

  const handleDeleteProductCatalog = (id: string) => {
    setProductsList(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: string) => {
    setOrdersList(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    }));
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
        {currentTab === 'home' && (
          <HomeView
            products={productsList}
            setCurrentTab={setCurrentTab}
            setSelectedProduct={setSelectedProduct}
            toggleWishlist={handleToggleWishlist}
            wishlistedIds={wishlistedIds}
          />
        )}

        {currentTab === 'catalog' && (
          <CatalogView
            products={productsList}
            setSelectedProduct={setSelectedProduct}
            toggleWishlist={handleToggleWishlist}
            wishlistedIds={wishlistedIds}
          />
        )}

        {currentTab === 'custom' && (
          <CustomBuilderView
            onAddCustomInquiry={handleAddCustomInquiry}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryView />
        )}

        {currentTab === 'about' && (
          <AboutView />
        )}

        {currentTab === 'contact' && (
          <ContactView />
        )}

         {currentTab === 'admin' && (
          isAdminLoggedIn ? (
            <AdminDashboard
              products={productsList}
              onAddProduct={handleAddProductCatalog}
              onDeleteProduct={handleDeleteProductCatalog}
              orders={ordersList}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onLogout={() => setIsAdminLoggedIn(false)}
            />
          ) : (
            <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
          )
        )}
      </main>

      {/* 3. PREMIUM PERSISTENT FOOTER */}
      <Footer
        setCurrentTab={setCurrentTab}
        openPolicyModal={(policyType) => setActivePolicy(policyType)}
      />

      {/* 4. WHATSAPP FLOATING CTA INTEGRATION */}
      <WhatsAppButton />

      {/* 5. SLIDE-IN CART & INQUIRY CHECKOUT SIDEBAR */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        customInquiries={customInquiries}
        onRemoveItem={handleRemoveCartItem}
        onRemoveInquiry={handleRemoveInquiry}
        onUpdateQty={handleUpdateCartQty}
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
                  <p className="font-semibold text-gray-800">1. Information We Gather</p>
                  <p>When you place customized design inquiries on Cakeasy.in, we capture your preferences, shape selections, uploaded inspiration assets, and contact details (name, email, phone) to personalize your baking experience.</p>
                  <p className="font-semibold text-gray-800">2. Storage & Cookie Guidelines</p>
                  <p>To ensure a flawless checkout experience, custom orders are saved locally in standard secure client cookies. We never resell, rent, or lease your private coordinates to third-party databases.</p>
                  <p className="font-semibold text-gray-800">3. Contact Hotline</p>
                  <p>For inquiries regarding GDPR compliance or erasing data logs, reach our Bandra Atelier via hello@cakeasy.in.</p>
                </>
              )}

              {activePolicy === 'terms' && (
                <>
                  <p className="font-semibold text-gray-800">1. Acceptance of Custom Rules</p>
                  <p>By browsing Cakeasy.in or submitting inspiration boards to our head bakers, you authorize our design teams to adapt details based on available ingredients and culinary safety guidelines.</p>
                  <p className="font-semibold text-gray-800">2. Digital Visual Approvals</p>
                  <p>All finished bespoke cakes are photographed and approved by the customer on WhatsApp prior to temperature-controlled transit. Once approved, shape modifications are suspended.</p>
                  <p className="font-semibold text-gray-800">3. Local Jurisdiction</p>
                  <p>These guidelines are governed under standard metropolitan retail policies in Bandra West, Mumbai, India.</p>
                </>
              )}

              {activePolicy === 'refund' && (
                <>
                  <p className="font-semibold text-gray-800">1. Cancellation Timelines</p>
                  <p>As all milestones are custom-designed from scratch, cancellation requests must be processed 48 hours prior to delivery to qualify for 100% store credit refunds.</p>
                  <p className="font-semibold text-gray-800">2. Extreme Weather & Transit Failures</p>
                  <p>If a custom cake falls out of shape or gets physically compromised in transit due to temperature failures in our chilled vehicles, we will provide a full refund or express-bake a replacement on priority.</p>
                  <p className="font-semibold text-gray-800">3. Taste Preferences</p>
                  <p>We pride ourselves on Le Cordon Bleu standards. Surcharges cannot be waived post-consumption based on subjective taste preferences.</p>
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
