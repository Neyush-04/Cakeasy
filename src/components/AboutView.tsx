import { Award, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { MEET_THE_TEAM } from '../data';

const journey = [
  {
    year: '2021',
    title: 'Lucknow beginnings',
    text: 'Neha Chaudhary began Cakeasy as a home-baker story in Lucknow, taking small celebration orders and building confidence one cake at a time.',
  },
  {
    year: '2022-2023',
    title: 'A recognisable cake style',
    text: 'Themes, florals, character cakes, bento cakes, and party tables helped shape Cakeasy into a personal, occasion-first brand.',
  },
  {
    year: '2024 onward',
    title: 'From Lucknow to Delhi NCR',
    text: 'The journey moved toward Delhi and Greater Noida, bringing the same handmade warmth into a wider set of celebrations.',
  },
];

export default function AboutView() {
  return (
    <div className="space-y-20 pb-20 animate-fadeIn">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#FFF5F8]/70 rounded-[40px] p-8 sm:p-16 border border-[#F6B8C8]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full opacity-5 bg-[radial-gradient(#D63384_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#F6B8C8]/30 shadow-sm text-xs font-bold uppercase tracking-widest text-[#D63384]">
            <Award className="h-4 w-4" /> Main baker & founder
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E1E1E] leading-tight">
              Meet <span className="text-[#D63384] italic">Neha Chaudhary</span>, the heart of Cakeasy.
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
              Neha is the face, baker, and creative force behind Cakeasy. Her journey began in Lucknow in 2021 and grew into a Greater Noida cake studio serving Delhi NCR celebrations.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
              Cakeasy is built around direct conversations: the occasion, the design, the flavour, the date, and the small emotional details that make a cake feel personal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/918810795004"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="h-4 w-4 fill-white stroke-white" /> WhatsApp Neha
            </a>
            <a
              href="https://www.instagram.com/cakeasy99/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#D63384] border border-[#F6B8C8] hover:bg-[#FFF5F8] transition-colors"
            >
              View Instagram Journey
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative aspect-[4/5] rounded-[32px] overflow-hidden border-8 border-white shadow-xl">
          <img
            src="/gallery/1/img1.jpg"
            alt="Neha Chaudhary, founder and baker of Cakeasy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent flex items-end p-6 text-white">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-[#F6B8C8] font-bold">Cakeasy Founder</span>
              <h2 className="font-serif font-bold text-xl">Neha Chaudhary</h2>
              <p className="text-xs text-white/80">Lucknow to Delhi NCR, one celebration at a time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">The Journey</span>
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">From Lucknow beginnings to Greater Noida</h2>
          <p className="text-gray-500 text-xs">A founder-led story, not a faceless bakery catalogue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {journey.map((item) => (
            <div key={item.year} className="bg-white border border-[#FFF5F8] p-6 rounded-[24px] shadow-sm space-y-3">
              <span className="font-serif text-3xl font-bold text-[#D63384]">{item.year}</span>
              <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">The Kitchen</span>
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">The Cakeasy Studio</h2>
          <p className="text-gray-500 text-xs">The person behind the cakes, designs, and celebration details.</p>
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
                <p className="text-[10px] text-gray-400 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="h-3 w-3" /> Lucknow roots, now Greater Noida.
                </p>
              </div>
            </div>
          ))}

          <div className="bg-[#FFF5F8] rounded-[32px] overflow-hidden border border-[#F6B8C8]/30 p-6 flex flex-col justify-between gap-6 shadow-sm">
            <Sparkles className="h-7 w-7 text-[#D63384]" />
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl text-[#1E1E1E]">A story told through cakes</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                The gallery is arranged as a visual archive so visitors see the growth of Cakeasy, not just isolated product photos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
