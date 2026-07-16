import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Globe, HelpCircle, Check, Loader2, Sparkles, Send, ShieldCheck, Clock } from 'lucide-react';
import { FAQS } from '../data';

export default function ContactView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [orderId, setOrderId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);

  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setSearchLoading(true);
    setTrackedOrder(null);

    setTimeout(() => {
      setSearchLoading(false);
      // Simulated orders matching standard formats
      setTrackedOrder({
        id: orderId.trim().toUpperCase(),
        customer: 'Priya Sharma',
        cake: 'Pastel Lavender Bento Cake',
        status: 'piping', // received -> baking -> piping -> checked -> dispatched
        eta: 'Today at 5:30 PM',
        deliveryType: 'Temperature-Controlled Chilled Transit',
      });
    }, 1500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmittedMessage(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmittedMessage(false);
    }, 4000);
  };

  const statusStages = [
    { key: 'received', label: 'Inquiry Approved', desc: 'Sponge selection finalized' },
    { key: 'baking', label: 'Baking in Progress', desc: 'Moist cocoa & vanilla sponge in ovens' },
    { key: 'piping', label: 'Buttercream Piping', desc: 'Head decorator applying custom retro details' },
    { key: 'checked', label: 'Quality Approved', desc: 'Toppings & gold leaf verified' },
    { key: 'dispatched', label: 'Dispatched in Cold Container', desc: 'Temperature-controlled van transit' },
  ];

  const getStageIndex = (status: string) => {
    return statusStages.findIndex(s => s.key === status);
  };

  return (
    <div className="space-y-24 pb-20 animate-fadeIn">
      {/* 1. ORDER STATUS TRACKER PORTAL (HIGHLY DETAILED SIMULATION) */}
      <section className="bg-gradient-to-br from-[#FFF5F8] to-white rounded-[40px] p-8 sm:p-12 border border-[#F6B8C8]/20 shadow-sm">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D63384] bg-white border border-[#F6B8C8]/30 px-3 py-1 rounded-full inline-block">
              Express Delivery Tracker
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">Track Your Custom Cake Status</h2>
            <p className="text-xs text-gray-500">
              Enter your Cakeasy Order ID (e.g., <span className="font-bold text-gray-700">CK-7790</span>, <span className="font-bold text-gray-700">CK-8824</span>) to view real-time pastry kitchen updates.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="e.g., CK-7790"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-grow bg-white border border-[#F6B8C8]/50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="bg-[#D63384] hover:bg-[#b02266] text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 min-w-[140px] shrink-0 transition-colors"
            >
              {searchLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Tracking...
                </>
              ) : (
                'Query Kitchen'
              )}
            </button>
          </form>

          {/* Display Tracked Status Details */}
          {trackedOrder && (
            <div className="bg-white border border-[#FFF5F8] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-8 animate-scaleIn">
              {/* Meta info row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-50">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tracking Reference</span>
                  <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">{trackedOrder.id}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Recipient: {trackedOrder.customer} • {trackedOrder.cake}</p>
                </div>
                <div className="bg-[#FFF5F8] border border-pink-100 rounded-xl px-4 py-2 text-right">
                  <span className="text-[10px] text-[#D63384] uppercase font-bold tracking-wider block">Estimated ETA</span>
                  <span className="text-xs font-bold text-[#1E1E1E] flex items-center gap-1.5 justify-end">
                    <Clock className="h-3.5 w-3.5 text-[#D63384]" /> {trackedOrder.eta}
                  </span>
                </div>
              </div>

              {/* Live Status Flow Indicators */}
              <div className="relative pl-6 sm:pl-0 sm:flex sm:justify-between items-start gap-4">
                {/* Visual Connector Line (for desktop) */}
                <div className="hidden sm:block absolute top-[14px] left-8 right-8 h-1 bg-gray-100 -z-0" />

                {statusStages.map((stage, index) => {
                  const currentStageIdx = getStageIndex(trackedOrder.status);
                  const isCompleted = index < currentStageIdx;
                  const isActive = index === currentStageIdx;
                  const isPending = index > currentStageIdx;

                  return (
                    <div key={stage.key} className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-2 relative z-10 py-3 sm:py-0">
                      {/* Circle dot indicator */}
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        isCompleted 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : isActive 
                            ? 'bg-white border-[#D63384] text-[#D63384] ring-4 ring-pink-100' 
                            : 'bg-white border-gray-200 text-gray-300'
                      }`}>
                        {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                      </div>

                      {/* Labels and subtext */}
                      <div className="sm:text-center">
                        <p className={`text-xs font-bold ${isActive ? 'text-[#D63384]' : 'text-gray-800'}`}>
                          {stage.label}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-0.5 max-w-[120px] sm:mx-auto">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Courier and transit logistics */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex items-center justify-between text-xs text-gray-500">
                <span>Dispatch Method: <span className="font-bold text-gray-700">{trackedOrder.deliveryType}</span></span>
                <span className="text-xs text-[#D63384] font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-[#D63384]" /> Temp-Controlled Verified
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. CONTACT CARDS & INQUIRY FORM */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Coordinates & Map representation (5/12) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">Direct Coordinates</span>
            <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">Greater Noida Atelier</h2>
            <p className="text-xs text-gray-500">Our physical studio kitchen is open for consultation, tasting events, and priority order collection.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 bg-white border border-[#FFF5F8] rounded-2xl">
              <MapPin className="h-5 w-5 text-[#D63384] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#1E1E1E]">Aesthetic Physical Studio</h4>
                <p className="text-xs text-gray-500 mt-0.5">4C-601, AWHO, Gr. Noida, Delhi NCR, 201310</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white border border-[#FFF5F8] rounded-2xl">
              <Phone className="h-5 w-5 text-[#D63384] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#1E1E1E]">WhatsApp Hotline & Phone</h4>
                <p className="text-xs text-gray-500 mt-0.5">+91 88107 95004 (WhatsApp & Calls)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white border border-[#FFF5F8] rounded-2xl">
              <Mail className="h-5 w-5 text-[#D63384] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#1E1E1E]">General & Partnership Email</h4>
                <p className="text-xs text-gray-500 mt-0.5">cakeasy94@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Google Maps Visual layout Mock */}
          <div className="bg-neutral-100 rounded-3xl aspect-[16/10] relative overflow-hidden border border-neutral-200">
            {/* Visual Vector Grid Map simulation */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="h-10 w-10 bg-[#D63384] text-white rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
                  📍
                </div>
                <p className="font-serif font-bold text-xs text-[#1E1E1E]">Cakeasy Studio Kitchen</p>
                <p className="text-[9px] text-gray-400">AWHO, Greater Noida, Delhi NCR</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form (7/12) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#FFF5F8] shadow-sm space-y-6">
          <div className="space-y-1.5">
            <h3 className="font-serif font-bold text-xl text-[#1E1E1E]">Leave a Message to our Bakers</h3>
            <p className="text-xs text-gray-500">Have a custom catering query or corporate event? Fill the form, and our lead chef will reply within 4 hours.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Aditi Roy"
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., aditi@gmail.com"
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">How can we sweeten your day?</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your celebration plans, number of guests, or design themes..."
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-3 px-3.5 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittedMessage}
              className={`w-full py-3.5 font-semibold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm ${
                submittedMessage 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[#D63384] hover:bg-[#b02266] text-white hover:shadow-md'
              }`}
            >
              {submittedMessage ? (
                <>
                  <Check className="h-4 w-4 animate-scaleIn" /> Inquiry Transmitted!
                </>
              ) : (
                <>
                  Transmit Message <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <HelpCircle className="h-8 w-8 text-[#D63384] mx-auto" />
          <h3 className="font-serif font-bold text-2xl text-[#1E1E1E]">Bespoke Baking FAQs</h3>
          <p className="text-xs text-gray-400">Everything you need to know about placing customized orders and logistics.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isActive = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-[#FFF5F8] rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isActive ? null : index)}
                  className="w-full text-left px-6 py-4 font-serif font-bold text-sm text-[#1E1E1E] flex justify-between items-center hover:bg-[#FFF5F8]/40 transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="text-xs text-[#D63384] font-bold">{isActive ? '−' : '＋'}</span>
                </button>
                {isActive && (
                  <div className="px-6 pb-4 pt-1 text-xs text-gray-500 leading-relaxed font-sans border-t border-gray-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
