import React from 'react';
import { Sparkles, Heart, Award, ShieldCheck, Flame, Coffee } from 'lucide-react';
import { MEET_THE_TEAM } from '../data';

export default function AboutView() {
  return (
    <div className="space-y-24 pb-20 animate-fadeIn">
      {/* Magazine Cover Hero Style */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#FFF5F8]/70 rounded-[40px] p-8 sm:p-16 border border-[#F6B8C8]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full opacity-5 bg-[radial-gradient(#D63384_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Left Column Text */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#F6B8C8]/30 shadow-sm text-xs font-bold uppercase tracking-widest text-[#D63384]">
            <Award className="h-4 w-4" /> Handcrafted With Love Since Day One
          </div>
          
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E1E1E] leading-tight">
              Bespoke Confectionery Born From <span className="text-[#D63384] italic">Passion</span>.
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
              Cakeasy was founded in Greater Noida with a simple, uncompromising vision: that a cake should look like a work of contemporary art, and taste even more spectacular than it looks.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
              Every sponge we bake is slowly aerated to perfection, layered with hand-whipped vanilla bean buttercream, and sculpted using meticulous French pastry techniques. We refuse to use commercial presets, pre-mixes, or artificial stabilizers.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-pink-100">
            <div>
              <span className="font-serif text-3xl font-bold text-[#D63384]">100%</span>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Scratch Baked</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-bold text-[#D63384]">5k+</span>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Memories Crafted</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-bold text-[#D63384]">18+</span>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Signature Fillings</p>
            </div>
          </div>
        </div>

        {/* Right Column Grid Images */}
        <div className="lg:col-span-5 relative aspect-square rounded-[32px] overflow-hidden border-8 border-white shadow-xl">
          <img
            src="/gallery/4/img1.jpg"
            alt="Artisanal kitchen baking studio"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6 text-white">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-[#F6B8C8] font-bold">Cakeasy Atelier</span>
              <h3 className="font-serif font-bold text-base">Greater Noida Home Kitchen</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Pillars Section */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">Our Principles</span>
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">What Makes Cakeasy Different</h2>
          <p className="text-gray-500 text-xs">We design beyond expectations, honoring your milestones with custom luxury.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#FFF5F8] p-8 rounded-[28px] shadow-sm hover:shadow-md transition-all text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-pink-50 text-[#D63384] flex items-center justify-center mx-auto">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">French Patisserie Rigor</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We leverage classic French temperature methods, curing buttercreams and using high-fat European-style butter to ensure rich texture without heavy grease.
            </p>
          </div>

          <div className="bg-white border border-[#FFF5F8] p-8 rounded-[28px] shadow-sm hover:shadow-md transition-all text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <Coffee className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Finest Natural Ingredients</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              From real Madagascar vanilla pods to premium Belgian Callebaut chocolate chips and hand-picked fresh organic berries. Taste nature’s honest sweetness.
            </p>
          </div>

          <div className="bg-white border border-[#FFF5F8] p-8 rounded-[28px] shadow-sm hover:shadow-md transition-all text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Allergen Clean Standards</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We separate eggless batters, utilize organic oat milks for vegan-safe client orders, and wash our stand-mixers thoroughly to ensure zero cross-contamination.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Master Bakers Section */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">The Patissiers</span>
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">Our Creative Studio Artists</h2>
          <p className="text-gray-500 text-xs">The skilled pastry chefs who turn flour, sugar, and organic blooms into memories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {MEET_THE_TEAM.map((baker) => (
            <div
              key={baker.name}
              className="bg-white rounded-[32px] overflow-hidden border border-neutral-100 p-6 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition-all items-center"
            >
              <img
                src={baker.image}
                alt={baker.name}
                className="w-32 h-32 rounded-2xl object-cover shrink-0 border border-pink-50"
              />
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-[#D63384] tracking-widest bg-pink-50 px-2 py-0.5 rounded-full">
                  {baker.role}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">{baker.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {baker.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
