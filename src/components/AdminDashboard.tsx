import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Check, RefreshCw, Layers, CreditCard, Star, FileText, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../types';

interface AdminDashboardProps {
  products: MenuItem[];
  onAddProduct: (product: MenuItem) => void;
  onDeleteProduct: (id: string) => void;
  orders: any[];
  onUpdateOrderStatus: (id: string, nextStatus: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  products,
  onAddProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  onLogout,
}: AdminDashboardProps) {
  const [activePanel, setActivePanel] = useState<'orders' | 'products' | 'coupons' | 'reviews'>('orders');
  
  // Products simulation form states
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('₹499');
  const [newCategory, setNewCategory] = useState('bento');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800');

  // Coupon states
  const [coupons, setCoupons] = useState([
    { code: 'CAKEASY10', discount: '10% OFF', type: 'percentage', active: true },
    { code: 'BENTOLOVER', discount: '₹100 OFF', type: 'fixed', active: true },
    { code: 'WEDDINGMASTER', discount: 'Free Transit Delivery', type: 'shipping', active: false },
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc) return;

    const newProd: MenuItem = {
      id: `prod-${Date.now()}`,
      name: newName,
      description: newDesc,
      priceRange: newPrice,
      category: newCategory as any,
      image: newImage,
      popularFlavors: ['Classic Madagascar Vanilla', 'Belgian Chocolate Ganache'],
    };

    onAddProduct(newProd);
    setNewName('');
    setNewDesc('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return;
    setCoupons(prev => [
      ...prev,
      { code: newCode.toUpperCase(), discount: newDiscount, type: 'percentage', active: true }
    ]);
    setNewCode('');
    setNewDiscount('');
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.code === code) return { ...c, active: !c.active };
      return c;
    }));
  };

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#1E1E1E] text-white rounded-[32px] p-8 sm:p-12 border border-[#D63384]/15 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="space-y-3 text-center md:text-left relative z-10 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F6B8C8] flex items-center justify-center md:justify-start gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-[#F6B8C8]" /> Cakeasy Atelier CMS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Bake Station & SaaS Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Simulate administrative control over the bakery. Manage real-time custom orders, edit product listings, configure marketing promotional coupons, and moderate testimonials.
          </p>
        </div>
        
        {/* Quick stat */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl px-6 py-4 text-center shrink-0">
          <span className="text-2xl font-serif font-bold text-[#F6B8C8] block">{orders.length}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Active Inquiries</span>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex bg-neutral-100 rounded-2xl p-1.5 max-w-xl mx-auto border border-neutral-200 shadow-inner">
        {[
          { id: 'orders', label: 'Bake Inquiries', icon: ShoppingBag },
          { id: 'products', label: 'Product Catalog', icon: Layers },
          { id: 'coupons', label: 'Promos & Coupons', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id as any)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activePanel === tab.id
                  ? 'bg-[#D63384] text-white shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* PANEL 1: INCOMING BAKE ORDERS & STATUS UPDATE */}
      {activePanel === 'orders' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#FFF5F8] shadow-sm space-y-6">
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
                      <p className="text-[10px] text-gray-400">Temp-Controlled Transit</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-[#D63384]">{order.cake}</p>
                      <p className="text-[10px] text-gray-400">Flavor: Classic Vanilla Bean</p>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-700">{order.eta.split(' at ')[0] || 'Today'}</td>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add New Product Form */}
          <form onSubmit={handleCreateProduct} className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#FFF5F8] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Add Cake Listing</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Cake Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Chocolate Hazelnut Dream"
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384]"
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
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384] resize-none"
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
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384]"
                >
                  <option value="bento">Bento Cakes</option>
                  <option value="wedding">Wedding Cakes</option>
                  <option value="celebration">Celebration Cakes</option>
                  <option value="cupcakes">Cupcakes & Pastries</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#D63384] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Save to Catalog
            </button>
          </form>

          {/* List of active catalog products */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#FFF5F8] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Atelier Catalog ({products.length})</h3>
            
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex gap-4 p-3 border border-gray-50 rounded-2xl items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-neutral-100" />
                    <div>
                      <h4 className="font-bold text-xs text-[#1E1E1E]">{p.name}</h4>
                      <p className="text-[10px] text-[#D63384] font-medium uppercase tracking-wider">{p.category} • {p.priceRange}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coupon creation form */}
          <form onSubmit={handleCreateCoupon} className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#FFF5F8] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Create Promo Code</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Coupon Code</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g., FESTIVE25"
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Discount Surcharge/Value</label>
              <input
                type="text"
                required
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                placeholder="e.g., 25% OFF / ₹250 OFF"
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D63384]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#D63384] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Deploy Promo Code
            </button>
          </form>

          {/* List of active promos */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#FFF5F8] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1E1E1E]">Promotional Campaigns</h3>
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div key={coupon.code} className="flex justify-between items-center p-4 border border-gray-50 rounded-2xl">
                  <div>
                    <span className="font-mono font-bold text-xs bg-neutral-100 text-[#1E1E1E] px-2.5 py-1 rounded-md border border-neutral-200">
                      {coupon.code}
                    </span>
                    <p className="text-xs text-gray-500 mt-1.5 font-bold text-[#D63384]">{coupon.discount}</p>
                  </div>
                  <button
                    onClick={() => toggleCouponStatus(coupon.code)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
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
    </div>
  );
}
