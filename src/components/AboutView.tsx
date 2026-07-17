import { Award, ShieldCheck, Flame, Coffee } from 'lucide-react';
import { MEET_THE_TEAM } from '../data';

export default function AboutView() {
  return (
    <div className="space-y-24 pb-20 animate-fadeIn">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#FFF5F8]/70 rounded-[40px] p-8 sm:p-16 border border-[#F6B8C8]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full opacity-5 bg-[radial-gradient(#D63384_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#F6B8C8]/30 shadow-sm text-xs font-bold uppercase tracking-widest text-[#D63384]">
            <Award className="h-4 w-4" /> Handcrafted with care
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E1E1E] leading-tight">
              Custom Cakes Born From <span className="text-[#D63384] italic">Celebration</span>.
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
              Cakeasy is a Greater Noida cake studio focused on custom celebration cakes, bento cakes, and designs made around real moments.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
              Each enquiry is handled directly so the flavour, size, finish, message, timing, and pickup or delivery plan are confirmed before baking begins.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-pink-100">
            <div>
              <span className="font-serif text-3xl font-bold text-[#D63384]">30</span>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Gallery Sets</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-bold text-[#D63384]">1:1</span>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Order Planning</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-bold text-[#D63384]">WA</span>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">WhatsApp Orders</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative aspect-square rounded-[32px] overflow-hidden border-8 border-white shadow-xl">
          <img
            src="/gallery/4/img1.jpg"
            alt="Cakeasy cake creation"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6 text-white">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-[#F6B8C8] font-bold">Cakeasy Studio</span>
              <h3 className="font-serif font-bold text-base">Greater Noida</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">Our Principles</span>
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">What Makes Cakeasy Different</h2>
          <p className="text-gray-500 text-xs">Clear planning, custom designs, and cakes made around your occasion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#FFF5F8] p-8 rounded-[28px] shadow-sm hover:shadow-md transition-all text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-pink-50 text-[#D63384] flex items-center justify-center mx-auto">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Made To Order</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cakeasy confirms each design, flavour, size, and schedule directly before accepting a custom cake order.
            </p>
          </div>

          <div className="bg-white border border-[#FFF5F8] p-8 rounded-[28px] shadow-sm hover:shadow-md transition-all text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <Coffee className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Flavour Led</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              The menu is built around familiar celebration flavours, with final ingredients and availability confirmed for each order.
            </p>
          </div>

          <div className="bg-white border border-[#FFF5F8] p-8 rounded-[28px] shadow-sm hover:shadow-md transition-all text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Clear Confirmation</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Dietary requests, eggless options, pickup, delivery, and pricing are discussed before the cake is finalized.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">The Kitchen</span>
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">The Cakeasy Studio</h2>
          <p className="text-gray-500 text-xs">The kitchen behind the cakes, designs, and celebration details.</p>
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
                <p className="text-xs text-gray-500 leading-relaxed">{baker.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
