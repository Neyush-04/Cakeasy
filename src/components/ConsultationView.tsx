import React, { useState } from 'react';
import { ArrowRight, CalendarDays, Check, ImagePlus, MapPin, Send, Sparkles } from 'lucide-react';

interface ConsultationViewProps { whatsappNumber: string; }

export default function ConsultationView({ whatsappNumber }: ConsultationViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [form, setForm] = useState({ name: '', date: '', venue: '', guests: '', tiers: '', palette: '', flavour: '', dietary: 'Egg / eggless to discuss', budget: '', notes: '' });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => setFiles(Array.from(event.target.files || []).map((file: File) => file.name));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const message = ['Hello Cakeasy, I would like to book a wedding / celebration cake consultation.', '', `Name: ${form.name}`, `Event date: ${form.date}`, `Venue: ${form.venue}`, `Guests / servings: ${form.guests}`, `Preferred tiers: ${form.tiers}`, `Colour palette: ${form.palette}`, `Flavour: ${form.flavour}`, `Dietary: ${form.dietary}`, `Budget range: ${form.budget}`, `References selected: ${files.length ? files.join(', ') : 'None'}`, `Notes: ${form.notes}`].join('\n');
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return <div className="space-y-12 pb-20 animate-fadeIn">
    <section className="rounded-[32px] bg-[#251b21] p-8 text-white sm:p-12"><div className="max-w-3xl space-y-5"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#f7c5d8]"><Sparkles className="h-4 w-4" /> Consultation card</span><h1 className="font-serif text-4xl sm:text-5xl">Let’s design a cake around your celebration.</h1><p className="max-w-2xl text-sm leading-7 text-white/70">Tell us what the day feels like. The details below help Neha prepare a thoughtful design conversation instead of sending a generic price list.</p></div></section>
    <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="space-y-7 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Your name" value={form.name} onChange={(value) => update('name', value)} required placeholder="Bride, groom or organiser" /><Field label="Wedding / event date" type="date" value={form.date} onChange={(value) => update('date', value)} required /><Field label="Venue / city" value={form.venue} onChange={(value) => update('venue', value)} required placeholder="Venue, hotel or neighbourhood" /><Field label="Guests / servings" value={form.guests} onChange={(value) => update('guests', value)} placeholder="Approximate number" /><Field label="Preferred number of tiers" value={form.tiers} onChange={(value) => update('tiers', value)} placeholder="For example, 2 or 3" /><Field label="Budget range" value={form.budget} onChange={(value) => update('budget', value)} placeholder="A comfortable planning range" /></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Colour palette / décor" value={form.palette} onChange={(value) => update('palette', value)} placeholder="Ivory, blush, gold..." /><Field label="Preferred flavour" value={form.flavour} onChange={(value) => update('flavour', value)} placeholder="Chocolate, berry, Indian-inspired..." /></div>
        <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#43242f]">Egg / eggless preference</span><select value={form.dietary} onChange={(event) => update('dietary', event.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm text-[#1e1e1e] focus:border-[#d63384] focus:outline-none"><option>Egg / eggless to discuss</option><option>Eggless preferred</option><option>Egg preferred</option></select></label>
        <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#43242f]">Tell us about the cake</span><textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} rows={5} placeholder="Flowers, outfits, invitation, topper, cultural details, delivery or setup requirements..." className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm text-[#1e1e1e] focus:border-[#d63384] focus:outline-none" /></label>
        <div className="rounded-2xl border border-dashed border-[#f0b7c9] bg-[#fff7fa] p-5"><label className="flex cursor-pointer items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#d63384] shadow-sm"><ImagePlus className="h-5 w-5" /></span><span><span className="block text-sm font-bold text-[#43242f]">Add outfit, invitation or décor references</span><span className="mt-1 block text-xs text-gray-500">Choose images here; WhatsApp will ask you to attach them after the message opens.</span></span><input type="file" accept="image/*" multiple className="sr-only" onChange={handleFiles} /></label>{files.length > 0 && <p className="mt-4 text-xs font-semibold text-[#d63384]">Selected: {files.join(', ')}</p>}</div>
        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d63384] px-5 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-[0_12px_25px_rgba(214,51,132,.18)] hover:bg-[#b02266]">{submitted ? <><Check className="h-4 w-4" /> WhatsApp consultation ready</> : <>Send consultation brief <Send className="h-4 w-4" /></>}</button>
      </div>
      <aside className="space-y-5 lg:col-span-4"><div className="rounded-3xl bg-[#fff7fa] p-6"><CalendarDays className="h-6 w-6 text-[#d63384]" /><h2 className="mt-4 font-serif text-2xl font-bold text-[#1e1e1e]">What happens next</h2><div className="mt-5 space-y-4 text-sm leading-6 text-gray-600"><p><b className="text-[#43242f]">1.</b> Your brief opens in WhatsApp for a direct conversation with Cakeasy.</p><p><b className="text-[#43242f]">2.</b> Neha discusses design, servings, flavour, timeline and setup.</p><p><b className="text-[#43242f]">3.</b> You receive a considered quotation before confirming.</p></div></div><div className="rounded-3xl border border-neutral-100 bg-white p-6 text-sm leading-6 text-gray-600"><MapPin className="h-5 w-5 text-[#d63384]" /><p className="mt-3 font-semibold text-[#1e1e1e]">Cakeasy Studio · Greater Noida</p><p className="mt-1">Serving Delhi NCR, with Lucknow roots and a design process built for meaningful celebrations.</p></div></aside>
    </form>
  </div>;
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-[#43242f]">{label}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm text-[#1e1e1e] focus:border-[#d63384] focus:outline-none" /></label>;
}
