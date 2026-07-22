import React from 'react';
import { ArrowRight, Check, MessageCircle, Sparkles } from 'lucide-react';
import { CakeCategoryConfig } from '../data/categoryData';

interface CategoryViewProps { config: CakeCategoryConfig; setCurrentTab: (tab: string) => void; }

export default function CategoryView({ config, setCurrentTab }: CategoryViewProps) {
  return (
    <div className="space-y-20 pb-20 animate-fadeIn">
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <div className="space-y-7 lg:col-span-5">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#D63384]">{config.eyebrow}</span>
          <h1 className="font-serif text-5xl font-bold leading-[1.05] text-[#251B21] sm:text-6xl">{config.title}</h1>
          <p className="max-w-xl text-base leading-8 text-gray-600">{config.description}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={() => setCurrentTab('consultation')} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D63384] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#B02266]">Book a consultation <ArrowRight className="h-4 w-4" /></button>
            <a href="https://wa.me/918810795004" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F0B7C9] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#D63384] hover:bg-[#FFF5F8]"><MessageCircle className="h-4 w-4" /> Chat on WhatsApp</a>
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <div className="aspect-[5/4] overflow-hidden rounded-[34px] bg-[#F3ECE7]"><img src={config.hero} alt={`${config.navLabel} by Cakeasy`} className="h-full w-full object-cover" /></div>
          <div className="absolute -bottom-6 left-6 max-w-xs rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-widest text-[#D63384]">Cakeasy by Neha Chaudhary</p><p className="mt-1 text-xs leading-5 text-gray-600">{config.isSmall ? 'Small, personal and giftable.' : 'Designed around the celebration, not pulled from a generic menu.'}</p></div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4"><span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D63384]">What belongs here</span><h2 className="font-serif text-3xl font-bold text-[#251B21]">A category with a clear point of view.</h2><p className="text-sm leading-7 text-gray-500">{config.note}</p></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8">{config.styles.map((style) => <div key={style} className="flex items-start gap-3 rounded-2xl border border-[#EDE3E2] bg-white p-5 text-sm font-semibold leading-6 text-[#43242F]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D63384]" />{style}</div>)}</div>
      </section>

      <section className="space-y-8"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D63384]">Curated Cakeasy work</span><h2 className="mt-2 font-serif text-3xl font-bold text-[#251B21]">Inspiration for your brief</h2></div><button onClick={() => setCurrentTab('gallery')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D63384]">View the full archive <ArrowRight className="h-4 w-4" /></button></div><div className={`grid grid-cols-1 gap-5 ${config.images.length > 3 ? 'md:grid-cols-3' : 'sm:grid-cols-3'}`}>{config.images.map((image, index) => <article key={image} className={`group overflow-hidden rounded-3xl border border-neutral-100 bg-white ${index === 0 && config.images.length > 3 ? 'md:row-span-2' : ''}`}><div className={`${index === 0 && config.images.length > 3 ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden bg-[#F7F2EF]`}><img src={image} alt={`${config.navLabel} inspiration ${index + 1}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#D63384]">{config.isSmall ? 'Small format' : index === 0 ? 'Signature direction' : 'Design reference'}</p><p className="mt-1 text-sm font-semibold text-[#43242F]">{config.styles[index % config.styles.length]}</p></div></article>)}</div></section>

      <section className="rounded-[32px] bg-[#251B21] p-8 text-white sm:p-12"><div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center"><div className="lg:col-span-8"><Sparkles className="h-6 w-6 text-[#F5C178]" /><h2 className="mt-4 font-serif text-3xl font-bold">Tell us what you are celebrating.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">We will help turn it into a cake that feels truly yours - with the right scale, flavour, finish and delivery plan.</p></div><button onClick={() => setCurrentTab('consultation')} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D63384] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#B02266] lg:col-span-4">Start your cake consultation <ArrowRight className="h-4 w-4" /></button></div></section>
    </div>
  );
}
