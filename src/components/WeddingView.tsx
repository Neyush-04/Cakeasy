import React from 'react';
import { ArrowRight, Check, Heart, Sparkles } from 'lucide-react';

interface WeddingViewProps {
  setCurrentTab: (tab: string) => void;
}

const designStyles = [
  { title: 'Floral romance', detail: 'Fresh-feel blooms, soft palettes and hand-finished tiers.', image: '/catalog/product2.jpg' },
  { title: 'Minimal luxury', detail: 'Clean silhouettes, texture, metallic accents and quiet drama.', image: '/catalog/product3.jpg' },
  { title: 'Story-led themes', detail: 'A cake designed from your outfits, invitation, décor or shared story.', image: '/catalog/product4.jpg' },
];

export default function WeddingView({ setCurrentTab }: WeddingViewProps) {
  return (
    <div className="space-y-20 pb-20 animate-fadeIn">
      <section className="relative overflow-hidden rounded-[36px] bg-[#251b21] text-white">
        <div className="absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_70%_20%,#d63384,transparent_45%),radial-gradient(circle_at_20%_80%,#c89038,transparent_40%)]" />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center gap-10 p-8 sm:p-12 lg:p-16">
          <div className="lg:col-span-6 space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#f7c5d8]"><Heart className="h-3.5 w-3.5 fill-current" /> Cakeasy wedding studio</span>
            <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl">Your wedding.<br /><span className="text-[#f5c178]">Your story.</span><br />Your cake.</h1>
            <p className="max-w-xl text-sm leading-7 text-white/75 sm:text-base">Bespoke centrepieces designed around your colours, décor, outfits and guest experience. Every tier is discussed with Neha, then created by hand in our Greater Noida studio.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setCurrentTab('consultation')} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d63384] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_12px_30px_rgba(214,51,132,.3)] hover:bg-[#b02266]">Book a cake consultation <ArrowRight className="h-4 w-4" /></button>
              <button onClick={() => setCurrentTab('gallery')} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15">View real Cakeasy work</button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="mx-auto max-w-md rotate-1 overflow-hidden rounded-[28px] border-8 border-white/10 shadow-2xl">
              <img src="/catalog/product2.jpg" alt="Bespoke Cakeasy wedding cake" className="aspect-[4/5] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
        <div className="space-y-4 lg:col-span-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d63384]">The flagship collection</span>
          <h2 className="font-serif text-4xl font-bold text-[#1e1e1e]">A centrepiece with a point of view.</h2>
          <p className="text-sm leading-7 text-gray-500">Wedding, engagement and anniversary cakes are quoted around the design, servings, flavour, delivery and setup requirements — never forced into a one-size-fits-all menu.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
          {['Multi-tier silhouettes', 'Floral & Indian-inspired detail', 'Outfit, décor & invitation matching'].map((item) => (
            <div key={item} className="rounded-2xl border border-[#f6b8c8]/35 bg-[#fff7fa] p-5 text-sm font-semibold leading-6 text-[#43242f]"><Check className="mb-4 h-5 w-5 text-[#d63384]" />{item}</div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d63384]">Choose your design language</span><h2 className="mt-2 font-serif text-3xl font-bold text-[#1e1e1e]">Real inspiration, made personal.</h2></div>
          <button onClick={() => setCurrentTab('gallery')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d63384]">Open the full lookbook <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {designStyles.map((style) => (
            <article key={style.title} className="group overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden"><img src={style.image} alt={style.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
              <div className="space-y-2 p-6"><h3 className="font-serif text-xl font-bold text-[#1e1e1e]">{style.title}</h3><p className="text-sm leading-6 text-gray-500">{style.detail}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-[#f6b8c8]/40 bg-[#fff7fa] p-8 sm:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-5"><span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d63384]">The Cakeasy custom cake journey</span><h2 className="font-serif text-3xl font-bold text-[#1e1e1e]">More than a cake. A design conversation.</h2><p className="max-w-2xl text-sm leading-7 text-gray-600">Share your event details, inspiration and priorities. Neha will discuss servings, flavour, structure, finish and logistics before a design proposal is confirmed.</p><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{['Share your event details', 'Send your inspiration', 'Discuss servings, flavour & budget', 'Receive a design proposal', 'Confirm with advance payment', 'Create, deliver & set up'].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-xl bg-white p-3 text-xs font-semibold text-[#43242f]"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d63384] text-white">{index + 1}</span>{step}</div>)}</div></div>
          <div className="lg:col-span-5 rounded-3xl bg-[#251b21] p-7 text-white shadow-xl"><Sparkles className="h-7 w-7 text-[#f5c178]" /><h3 className="mt-5 font-serif text-2xl">Ready to design yours?</h3><p className="mt-3 text-sm leading-6 text-white/65">A short consultation gives us everything needed to begin a thoughtful quotation.</p><button onClick={() => setCurrentTab('consultation')} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d63384] px-5 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#b02266]">Start your consultation <ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#eadfd8] bg-white p-7 text-center sm:flex-row sm:text-left"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d63384]">Also available for your celebration</p><p className="mt-2 text-sm text-gray-600">Birthday cakes, bento cakes, cupcakes, dessert tables and personalised boxes.</p></div><button onClick={() => setCurrentTab('catalog')} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#f6b8c8] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#d63384]">Explore the supporting range <ArrowRight className="h-4 w-4" /></button></section>
    </div>
  );
}
