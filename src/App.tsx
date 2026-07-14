import React, { useState, useEffect } from 'react';
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
import { MenuItem, CustomCakeState, AtelierSettings, PromoCoupon } from './types';
import { ShieldCheck, Sparkles, X, Heart, ShoppingBag } from 'lucide-react';

import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
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
  const [currentTab, setCurrentTab] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Core application states lifted
  const [productsList, setProductsList] = useState<MenuItem[]>([]);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customInquiries, setCustomInquiries] = useState<{ cake: CustomCakeState; date: string; notes: string }[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic configuration states
  const [atelierSettings, setAtelierSettings] = useState<AtelierSettings>({
    instagramUrl: 'https://instagram.com/cakeasy.in',
    instagramHandle: '@cakeasy.in',
    whatsappNumber: '919876543210',
    address: 'Cakeasy Studio, Bandra West, Mumbai',
    email: 'hello@cakeasy.in',
    bannerImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800',
    egglessPremium: 100,
    base1Tier: 999,
    base2Tiers: 2499,
    base3Tiers: 4999,
    deliveryFeePerKm: 45
  });
  const [couponsList, setCouponsList] = useState<PromoCoupon[]>([]);

  // Sync Products, Orders, Settings, and Coupons
  useEffect(() => {
    // 1. Fetch & Seed Products
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (querySnapshot.empty) {
          // Seed initial products if collection is empty
          const seedPromises = ALL_PRODUCTS.map(async (p) => {
            await setDoc(doc(db, 'products', p.id), p);
          });
          await Promise.all(seedPromises);
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

    // 2. Realtime listener for Orders
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      if (snapshot.empty) {
        // If empty, seed default orders so dashboard has demo records
        const defaultOrders = [
          { id: 'CK-7790', customer: 'Priya Sharma', cake: 'Pastel Lavender Bento Cake', status: 'piping', eta: 'Today at 5:30 PM' },
          { id: 'CK-8824', customer: 'Rohan Deshmukh', cake: 'Chilled White Chocolate Drip Cake', status: 'baking', eta: 'Tomorrow at 1:00 PM' },
          { id: 'CK-5510', customer: 'Ananya Mehta', cake: 'Artisanal Pastel Rose Wedding Cake', status: 'received', eta: 'July 20th at 12:00 PM' },
        ];
        defaultOrders.forEach(async (order) => {
          try {
            await setDoc(doc(db, 'orders', order.id), order);
          } catch (e) {
            console.error("Error seeding default order:", e);
          }
        });
        setOrdersList(defaultOrders);
      } else {
        const loadedOrders: any[] = [];
        snapshot.forEach((doc) => {
          loadedOrders.push(doc.data());
        });
        // Sort orders so newer ones appear higher
        setOrdersList(loadedOrders);
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    // 3. Realtime listener for Atelier Settings
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'atelier'), async (snapshot) => {
      if (!snapshot.exists()) {
        const defaultSettings: AtelierSettings = {
          instagramUrl: 'https://instagram.com/cakeasy.in',
          instagramHandle: '@cakeasy.in',
          whatsappNumber: '919876543210',
          address: 'Cakeasy Studio, Bandra West, Mumbai',
          email: 'hello@cakeasy.in',
          bannerImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800',
          egglessPremium: 100,
          base1Tier: 999,
          base2Tiers: 2499,
          base3Tiers: 4999,
          deliveryFeePerKm: 45
        };
        try {
          await setDoc(doc(db, 'settings', 'atelier'), defaultSettings);
          setAtelierSettings(defaultSettings);
        } catch (e) {
          console.error("Error seeding default settings:", e);
        }
      } else {
        setAtelierSettings(snapshot.data() as AtelierSettings);
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
    });

    // 4. Realtime listener for Coupons
    const unsubscribeCoupons = onSnapshot(collection(db, 'coupons'), async (snapshot) => {
      if (snapshot.empty) {
        const defaultCoupons: PromoCoupon[] = [
          { code: 'CAKEASY10', discount: '10% OFF', type: 'percentage', active: true },
          { code: 'BENTOLOVER', discount: '₹100 OFF', type: 'fixed', active: true },
          { code: 'WEDDINGMASTER', discount: 'Free Transit Delivery', type: 'shipping', active: false },
        ];
        defaultCoupons.forEach(async (coupon) => {
          try {
            await setDoc(doc(db, 'coupons', coupon.code), coupon);
          } catch (e) {
            console.error("Error seeding default coupon:", e);
          }
        });
        setCouponsList(defaultCoupons);
      } else {
        const loadedCoupons: PromoCoupon[] = [];
        snapshot.forEach((doc) => {
          loadedCoupons.push(doc.data() as PromoCoupon);
        });
        setCouponsList(loadedCoupons);
      }
    }, (error) => {
      console.error("Error fetching coupons:", error);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeSettings();
      unsubscribeCoupons();
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
  const handleAddCustomInquiry = async (cake: CustomCakeState, date: string, notes: string) => {
    setCustomInquiries(prev => [...prev, { cake, date, notes }]);
    
    // Auto-append custom inquiry as a simulated trackable order!
    const mockId = `CK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: mockId,
      customer: 'You (Website Guest)',
      cake: `Bespoke ${cake.tiers} Tier ${cake.shape} Cake`,
      status: 'received',
      eta: date ? `${date} at 4:00 PM` : 'Scheduled TBD',
    };

    try {
      await setDoc(doc(db, 'orders', mockId), newOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${mockId}`);
    }
  };

  // Standard cart order submissions
  const handleCheckoutOrders = async (items: CartItem[]) => {
    const promises = items.map(async (item) => {
      const mockId = `CK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: mockId,
        customer: 'You (Website Guest)',
        cake: `${item.product.name} (${item.weight}, ${item.flavor})`,
        status: 'received',
        eta: 'Scheduled in 48 hours',
      };
      await setDoc(doc(db, 'orders', mockId), newOrder);
    });

    try {
      await Promise.all(promises);
      setCartItems([]); // Clear cart items after successful checkout
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    }
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
  const handleAddProductCatalog = async (newProduct: MenuItem) => {
    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
      setProductsList(prev => [...prev, newProduct]);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${newProduct.id}`);
    }
  };

  const handleDeleteProductCatalog = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProductsList(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: nextStatus });
      setOrdersList(prev => prev.map(o => {
        if (o.id === orderId) {
          return { ...o, status: nextStatus };
        }
        return o;
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Save studio operations config to Firestore
  const handleUpdateAtelierSettings = async (nextSettings: AtelierSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'atelier'), nextSettings);
      setAtelierSettings(nextSettings);
    } catch (error) {
      console.error("Error saving settings to Firestore:", error);
    }
  };

  const handleAddPromoCoupon = async (newCoupon: PromoCoupon) => {
    try {
      await setDoc(doc(db, 'coupons', newCoupon.code), newCoupon);
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  };

  const handleTogglePromoCoupon = async (code: string) => {
    try {
      const coupon = couponsList.find(c => c.code === code);
      if (coupon) {
        await updateDoc(doc(db, 'coupons', code), { active: !coupon.active });
      }
    } catch (error) {
      console.error("Error toggling coupon active status:", error);
    }
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
            settings={atelierSettings}
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
            settings={atelierSettings}
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
              settings={atelierSettings}
              onUpdateSettings={handleUpdateAtelierSettings}
              coupons={couponsList}
              onAddCoupon={handleAddPromoCoupon}
              onToggleCoupon={handleTogglePromoCoupon}
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
