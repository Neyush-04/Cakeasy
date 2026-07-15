import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  Layers, 
  CreditCard, 
  ShoppingBag, 
  Sliders, 
  Save, 
  Instagram, 
  Phone, 
  Mail, 
  MapPin, 
  Image as ImageIcon 
} from 'lucide-react';
import { MenuItem, AtelierSettings, PromoCoupon, InstagramPost } from '../types';
import { resolveCakeImage } from '../utils';

interface AdminDashboardProps {
  products: MenuItem[];
  onAddProduct: (product: MenuItem) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  orders: any[];
  onUpdateOrderStatus: (id: string, nextStatus: string) => Promise<void>;
  settings: AtelierSettings;
  onUpdateSettings: (settings: AtelierSettings) => Promise<void>;
  coupons: PromoCoupon[];
  onAddCoupon: (coupon: PromoCoupon) => Promise<void>;
  onToggleCoupon: (code: string) => Promise<void>;
  galleryPosts: InstagramPost[];
  onAddGalleryPost: (post: InstagramPost) => Promise<void>;
  onDeleteGalleryPost: (id: string) => Promise<void>;
  onLogout: () => void;
}

export default function AdminDashboard({
  products,
  onAddProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  settings,
  onUpdateSettings,
  coupons,
  onAddCoupon,
  onToggleCoupon,
  galleryPosts,
  onAddGalleryPost,
  onDeleteGalleryPost,
  onLogout,
}: AdminDashboardProps) {
  const [activePanel, setActivePanel] = useState<'orders' | 'products' | 'coupons' | 'settings' | 'gallery'>('orders');
  
  // Products listing form states
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('₹499');
  const [newCategory, setNewCategory] = useState('bento');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800');

  // Products feedback state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productSuccess, setProductSuccess] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  // Gallery posts form states
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newGalleryLikes, setNewGalleryLikes] = useState<number>(0);
  const [newGalleryDate, setNewGalleryDate] = useState('Just now');

  // Gallery feedback state
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [gallerySuccess, setGallerySuccess] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  // Coupons form states
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed' | 'shipping'>('percentage');

  // Coupons feedback state
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Atelier settings states (local edit buffers)
  const [instUrl, setInstUrl] = useState(settings.instagramUrl);
  const [instHandle, setInstHandle] = useState(settings.instagramHandle);
  const [whatsNo, setWhatsNo] = useState(settings.whatsappNumber);
  const [strAddress, setStrAddress] = useState(settings.address);
  const [strEmail, setStrEmail] = useState(settings.email);
  const [bannerImg, setBannerImg] = useState(settings.bannerImage);
  const [egglessP, setEgglessP] = useState(settings.egglessPremium);
  const [b1Tier, setB1Tier] = useState(settings.base1Tier);
  const [b2Tiers, setB2Tiers] = useState(settings.base2Tiers);
  const [b3Tiers, setB3Tiers] = useState(settings.base3Tiers);
  const [delFee, setDelFee] = useState(settings.deliveryFeePerKm);

  // Settings feedback state
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Sync edit buffers when db settings change
  useEffect(() => {
    setInstUrl(settings.instagramUrl);
    setInstHandle(settings.instagramHandle);
    setWhatsNo(settings.whatsappNumber);
    setStrAddress(settings.address);
    setStrEmail(settings.email);
    setBannerImg(settings.bannerImage);
    setEgglessP(settings.egglessPremium);
    setB1Tier(settings.base1Tier);
    setB2Tiers(settings.base2Tiers);
    setB3Tiers(settings.base3Tiers);
    setDelFee(settings.deliveryFeePerKm);
  }, [settings]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc) return;

    setIsAddingProduct(true);
    setProductSuccess(false);
    setProductError(null);

    const newProd: MenuItem = {
      id: `prod-${Date.now()}`,
      name: newName,
      description: newDesc,
      priceRange: newPrice,
      category: newCategory as any,
      image: newImage,
      popularFlavors: ['Classic Madagascar Vanilla', 'Belgian Chocolate Ganache'],
    };

    try {
      await onAddProduct(newProd);
      setNewName('');
      setNewDesc('');
      setProductSuccess(true);
      setTimeout(() => setProductSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setProductError(err?.message || "Failed to save product. Ensure it strictly matches database security policies.");
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return;

    setIsAddingCoupon(true);
    setCouponSuccess(false);
    setCouponError(null);

    const newCoupon: PromoCoupon = {
      code: newCode.toUpperCase().trim(),
      discount: newDiscount.trim(),
      type: newCouponType,
      active: true
    };

    try {
      await onAddCoupon(newCoupon);
      setNewCode('');
      setNewDiscount('');
      setCouponSuccess(true);
      setTimeout(() => setCouponSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setCouponError(err?.message || "Failed to create coupon. Verify security policies.");
    } finally {
      setIsAddingCoupon(false);
    }
  };

  const handleCreateGalleryPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl || !newGalleryCaption) return;

    setIsAddingGallery(true);
    setGallerySuccess(false);
    setGalleryError(null);

    try {
      await onAddGalleryPost({
        id: `ig-${Date.now()}`,
        imageUrl: newGalleryUrl,
        caption: newGalleryCaption,
        likes: Number(newGalleryLikes) || 0,
        commentsCount: 0,
        date: newGalleryDate || 'Just now',
        comments: []
      });

      setNewGalleryUrl('');
      setNewGalleryCaption('');
      setNewGalleryLikes(0);
      setNewGalleryDate('Just now');
      setGallerySuccess(true);
      setTimeout(() => setGallerySuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setGalleryError(err?.message || "Failed to publish gallery post. Ensure image URL and description size are under limits.");
    } finally {
      setIsAddingGallery(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess(false);
    setSettingsError(null);

    const updatedSettings: AtelierSettings = {
      instagramUrl: instUrl || '',
      instagramHandle: instHandle || '',
      whatsappNumber: whatsNo || '',
      address: strAddress || '',
      email: strEmail || '',
      bannerImage: bannerImg || '',
      egglessPremium: Number(egglessP) || 0,
      base1Tier: Number(b1Tier) || 0,
      base2Tiers: Number(b2Tiers) || 0,
      base3Tiers: Number(b3Tiers) || 0,
      deliveryFeePerKm: Number(delFee) || 0,
    };

    try {
      await onUpdateSettings(updatedSettings);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setSettingsError(err?.message || "Failed to update configurations. Verify Firestore permissions.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#1E1E1E] text-white rounded-[32px] p-8 sm:p-12 border border-[#D63384]/15 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-15 bg-[radial-gradient(#D63384_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="space-y-3 text-center md:text-left relative z-10 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F6B8C8] flex items-center justify-center md:justify-start gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-[#F6B8C8]" /> Cakeasy Atelier CMS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Bake Station & SaaS Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Simulate administrative control over the bakery. Manage real-time custom orders, edit product listings, configure marketing promotional coupons, and tune operational rates & handles.
          </p>
        </div>
        
        {/* Quick stat & Logout */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative z-10">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl px-6 py-4 text-center">
            <span className="text-2xl font-serif font-bold text-[#F6B8C8] block">{orders.length}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Active Inquiries</span>
          </div>
          <button
            onClick={onLogout}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-[#D63384] text-white border border-neutral-700 hover:border-transparent rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Lock Session
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex bg-neutral-100 rounded-2xl p-1.5 max-w-2xl mx-auto border border-neutral-200 shadow-inner">
        {[
          { id: 'orders', label: 'Bake Inquiries', icon: ShoppingBag },
          { id: 'products', label: 'Product Catalog', icon: Layers },
          { id: 'coupons', label: 'Promos & Coupons', icon: CreditCard },
          { id: 'settings', label: 'Studio Settings', icon: Sliders },
          { id: 'gallery', label: 'Live Gallery', icon: Instagram },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id as any)}
              className={`flex-1 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activePanel === tab.id
                  ? 'bg-[#D63384] text-white shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* PANEL 1: INCOMING BAKE ORDERS & STATUS UPDATE */}
      {activePanel === 'orders' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#FFF5F8] shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-[#1E1E1E]">Bespoke Order Inquiries</h2>
            <p className="text-xs text-gray-500">Track and advance real-time customer cake inquires. Adjusting a status here instantly updates the client-side tracker!</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px] font-bold">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Client Detail</th>
                  <th className="py-3 px-4">Cake Design State</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-neutral-50/50">
                    <td className="py-4 px-4 font-mono font-bold text-[#1E1E1E]">{order.id}</td>
                    <td className="py-4 px-4 font-medium">
                      <p className="text-gray-800">{order.customer}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Temp-Controlled Transit</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-[#D63384]">{order.cake}</p>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-700">{order.eta ? order.eta.split(' at ')[0] : 'Scheduled'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        order.status === 'dispatched' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : order.status === 'piping'
                            ? 'bg-pink-50 text-[#D63384] border border-pink-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-neutral-50 border border-gray-100 rounded-lg py-1 px-2.5 text-[10px] font-bold focus:outline-none focus:border-[#D63384]"
                      >
                        <option value="received">Received</option>
                        <option value="baking">Baking</option>
                        <option value="piping">Piping</option>
                        <option value="checked">Checked</option>
                        <option value="dispatched">Dispatched</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PANEL 2: PRODUCTS CATALOG EDITOR */}
      {activePanel === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          {/* Add New Product Form */}
          <form onSubmit={handleCreateProduct} className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#FFF5F8] space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Add Cake Listing</h3>
            
            {productSuccess && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-[11px] font-bold">
                ✓ Product successfully saved and published!
              </div>
            )}
            {productError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 text-[11px] font-semibold leading-normal">
                ⚠ {productError}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Cake Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Chocolate Hazelnut Dream"
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Short Description</label>
              <textarea
                required
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description of frosting, crumbs, and layering..."
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Price Range</label>
                <input
                  type="text"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g., ₹599 - ₹899"
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                >
                  <option value="bento">Bento Cakes</option>
                  <option value="wedding">Wedding Cakes</option>
                  <option value="celebration">Celebration Cakes</option>
                  <option value="cupcakes">Cupcakes & Pastries</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Image Asset URL</label>
              <input
                type="text"
                required
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
              />
            </div>

            <button
              type="submit"
              disabled={isAddingProduct}
              className="w-full py-2.5 bg-[#D63384] hover:bg-[#b02266] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingProduct ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Save to Catalog
                </>
              )}
            </button>
          </form>

          {/* List of active catalog products */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#FFF5F8] space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Atelier Catalog ({products.length})</h3>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {products.map((p) => (
                <div key={p.id} className="flex gap-4 p-3 border border-gray-50 rounded-2xl items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <img src={resolveCakeImage(p.image)} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-neutral-100" />
                    <div>
                      <h4 className="font-bold text-xs text-[#1E1E1E]">{p.name}</h4>
                      <p className="text-[10px] text-[#D63384] font-medium uppercase tracking-wider">{p.category} • {p.priceRange}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    aria-label="Delete product listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PANEL 3: COUPONS CONFIGURATOR */}
      {activePanel === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          {/* Coupon creation form */}
          <form onSubmit={handleCreateCouponSubmit} className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#FFF5F8] space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Create Promo Code</h3>
            
            {couponSuccess && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-[11px] font-bold">
                ✓ Promo code deployed successfully!
              </div>
            )}
            {couponError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 text-[11px] font-semibold leading-normal">
                ⚠ {couponError}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Coupon Code</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g., FESTIVE25"
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Discount Label</label>
                <input
                  type="text"
                  required
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  placeholder="e.g., 25% OFF / ₹150 OFF"
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Type</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                >
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed">Fixed Amount Off</option>
                  <option value="shipping">Free Delivery Transit</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAddingCoupon}
              className="w-full py-2.5 bg-[#D63384] hover:bg-[#b02266] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingCoupon ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Deploying...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Deploy Promo Code
                </>
              )}
            </button>
          </form>

          {/* List of active promos */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#FFF5F8] space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Promotional Campaigns ({coupons.length})</h3>
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div key={coupon.code} className="flex justify-between items-center p-4 border border-gray-50 rounded-2xl">
                  <div>
                    <span className="font-mono font-bold text-xs bg-neutral-100 text-[#1E1E1E] px-2.5 py-1 rounded-md border border-neutral-200">
                      {coupon.code}
                    </span>
                    <p className="text-xs text-gray-500 mt-1.5 font-bold text-[#D63384]">{coupon.discount} ({coupon.type})</p>
                  </div>
                  <button
                    onClick={() => onToggleCoupon(coupon.code)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      coupon.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}
                  >
                    {coupon.active ? '● Campaign Live' : '○ Suspended'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PANEL 4: ATELIER STUDIO SETTINGS (Rates, Instagram handle, coordinates) */}
      {activePanel === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-8 animate-fadeIn text-[#1E1E1E]">
          {settingsSuccess && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100 text-xs font-bold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Studio configurations and pricing schedules successfully saved and synchronized in Firestore!</span>
            </div>
          )}
          {settingsError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 text-xs font-semibold leading-normal">
              ⚠ {settingsError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: General Business Coordinates */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#FFF5F8] shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                <Sliders className="h-5 w-5 text-[#D63384]" />
                <h3 className="font-serif font-bold text-base">Atelier Coordinates & Socials</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                    <Instagram className="h-3.5 w-3.5" /> Instagram Account URL
                  </label>
                  <input
                    type="text"
                    required
                    value={instUrl}
                    onChange={(e) => setInstUrl(e.target.value)}
                    placeholder="https://instagram.com/your-handle"
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Instagram Handle Label</label>
                  <input
                    type="text"
                    required
                    value={instHandle}
                    onChange={(e) => setInstHandle(e.target.value)}
                    placeholder="@cakeasy.in"
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> WhatsApp Hotline Number (No country symbols)
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsNo}
                    onChange={(e) => setWhatsNo(e.target.value)}
                    placeholder="e.g. 919876543210"
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Studio Address
                  </label>
                  <input
                    type="text"
                    required
                    value={strAddress}
                    onChange={(e) => setStrAddress(e.target.value)}
                    placeholder="Bandra West, Mumbai"
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> Support Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={strEmail}
                    onChange={(e) => setStrEmail(e.target.value)}
                    placeholder="hello@cakeasy.in"
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5" /> Home Hero Banner Image URL
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerImg}
                    onChange={(e) => setBannerImg(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Operational Rates Schedule */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#FFF5F8] shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                <Layers className="h-5 w-5 text-[#D63384]" />
                <h3 className="font-serif font-bold text-base">Culinary Rates & Surcharges</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Eggless Premium (₹)</label>
                    <input
                      type="number"
                      required
                      value={egglessP}
                      onChange={(e) => setEgglessP(Number(e.target.value))}
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Transit Fee / KM (₹)</label>
                    <input
                      type="number"
                      required
                      value={delFee}
                      onChange={(e) => setDelFee(Number(e.target.value))}
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-1">Bespoke Custom Cake Base Rates</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500">Base Rate - 1 Tier Cake (₹)</span>
                      <input
                        type="number"
                        required
                        value={b1Tier}
                        onChange={(e) => setB1Tier(Number(e.target.value))}
                        className="w-32 text-right bg-neutral-50 border border-neutral-100 rounded-xl py-1.5 px-3 focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500">Base Rate - 2 Tiers Cake (₹)</span>
                      <input
                        type="number"
                        required
                        value={b2Tiers}
                        onChange={(e) => setB2Tiers(Number(e.target.value))}
                        className="w-32 text-right bg-neutral-50 border border-neutral-100 rounded-xl py-1.5 px-3 focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500">Base Rate - 3 Tiers Cake (₹)</span>
                      <input
                        type="number"
                        required
                        value={b3Tiers}
                        onChange={(e) => setB3Tiers(Number(e.target.value))}
                        className="w-32 text-right bg-neutral-50 border border-neutral-100 rounded-xl py-1.5 px-3 focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF5F8] border border-pink-50 p-4 rounded-2xl text-[10px] text-gray-500 leading-relaxed">
                  <p className="font-bold text-[#D63384] mb-1">How Custom Quotes Adjust:</p>
                  Changing these rates instantly updates the 3D-Interactive Custom Cake Builder on the front-end! The pricing engine recalculates live using your newly declared tier coefficients.
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="py-3.5 px-8 bg-[#D63384] hover:bg-[#b02266] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingSettings ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Saving Configurations...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Atelier Configurations
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* PANEL 5: INSTAGRAM LIVE GALLERY MANAGER */}
      {activePanel === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn text-[#1E1E1E]">
          {/* Left Form Box */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#FFF5F8] shadow-sm space-y-6 lg:col-span-1 h-fit">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <Plus className="h-5 w-5 text-[#D63384]" />
              <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Add Social Post</h3>
            </div>

            {gallerySuccess && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-[11px] font-bold">
                ✓ Gallery post published successfully!
              </div>
            )}
            {galleryError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 text-[11px] font-semibold leading-normal">
                ⚠ {galleryError}
              </div>
            )}

            <form onSubmit={handleCreateGalleryPost} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Image URL</label>
                <input
                  type="text"
                  required
                  placeholder="Paste Unsplash, Cloudinary or direct image link..."
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Caption / Hashtags</label>
                <textarea
                  required
                  rows={4}
                  placeholder="E.g., Mint chocolate luxury in Bandra... #bento #cakeasy"
                  value={newGalleryCaption}
                  onChange={(e) => setNewGalleryCaption(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Initial Likes</label>
                  <input
                    type="number"
                    value={newGalleryLikes}
                    onChange={(e) => setNewGalleryLikes(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Timestamp</label>
                  <input
                    type="text"
                    value={newGalleryDate}
                    onChange={(e) => setNewGalleryDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAddingGallery}
                className="w-full py-3 bg-[#D63384] hover:bg-[#b02266] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingGallery ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    Publish directly to Gallery
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Grid of Current Gallery Posts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#FFF5F8] shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-[#D63384]" />
                  <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Live Instagram Feed ({galleryPosts?.length || 0} Posts)</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-1">
                {galleryPosts?.map((post) => (
                  <div key={post.id} className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 flex gap-4 items-start relative group">
                    <img
                      src={resolveCakeImage(post.imageUrl)}
                      alt={post.caption}
                      className="w-16 h-16 object-cover rounded-xl border border-neutral-200 shrink-0"
                    />
                    <div className="space-y-1 flex-grow pr-6">
                      <p className="text-[10px] text-[#D63384] font-bold">@{settings.instagramHandle || 'cakeasy.in'}</p>
                      <p className="text-xs text-gray-700 font-sans line-clamp-2 leading-relaxed">{post.caption}</p>
                      <div className="flex gap-3 text-[10px] text-gray-400 font-semibold pt-1">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments?.length || 0}</span>
                        <span>🕒 {post.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteGalleryPost(post.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
