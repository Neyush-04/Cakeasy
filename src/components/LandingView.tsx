import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, MapPin, MessageCircle } from 'lucide-react';
import type { LandingPage } from '../../shared/landing';
import type { FaqItem } from '../../shared/content';
import { hoursText } from '../../shared/site';
import type { GalleryEntry } from '../lib/content';
import { siteSettings } from '../lib/runtime';
import { whatsappUrl } from '../lib/whatsapp';
import { trackWhatsAppClick } from '../lib/analytics';
import { resolveCakeImage } from '../utils';

interface LandingViewProps {
  page: LandingPage;
  gallery: GalleryEntry[];
  faqs: FaqItem[];
}

export default function LandingView({ page, gallery, faqs }: LandingViewProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);
  const picks = page.galleryIds.map((id) => gallery.find((entry) => entry.id === id)).filter((entry): entry is GalleryEntry => Boolean(entry));

  return (
    <div className="space-y-16 pb-20 animate-fadeIn">
      <section className="rounded-[34px] bg-[#251B21] p-8 text-white sm:p-12">
        <div className="max-w-3xl space-y-5">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#F5C178]">{page.eyebrow}</span>
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">{page.h1}</h1>
          {page.intro.map((text) => <p key={text} className="text-sm leading-7 text-white/75 sm:text-base">{text}</p>)}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link to="/consultation" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D63384] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#B02266]">Book a consultation <ArrowRight className="h-4 w-4" /></Link>
            <a href={whatsappUrl()} onClick={() => trackWhatsAppClick(`landing${page.path}`)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"><MessageCircle className="h-4 w-4" /> Chat on WhatsApp</a>
          </div>
        </div>
      </section>

      {page.sections.map((section) => (
        <section key={section.heading} className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-[#251B21]">{section.heading}</h2>
          {section.paragraphs?.map((text) => <p key={text} className="max-w-3xl text-sm leading-7 text-gray-600">{text}</p>)}
          {section.links && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.links.map((link) => (
                <Link key={link.href} to={link.href} className="group flex items-start justify-between gap-4 rounded-2xl border border-[#EDE3E2] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#D8B4B7]">
                  <span>
                    <span className="block font-serif text-lg font-bold text-[#251B21]">{link.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500">{link.text}</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#D63384] transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          )}
          {section.steps && (
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3 rounded-xl border border-[#EDE3E2] bg-[#FBF8F7] p-4 text-sm font-semibold text-[#43242F]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D63384] text-xs text-white">{index + 1}</span>{step}
                </li>
              ))}
            </ol>
          )}
          {section.showContact && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#EDE3E2] bg-white p-5 text-sm leading-6 text-gray-600"><MapPin className="mb-2 h-5 w-5 text-[#D63384]" /><p className="font-semibold text-[#251B21]">Address</p><p>{siteSettings.address.replace(/^Cakeasy,\s*/, '')}</p>{siteSettings.googleBusinessUrl && <a href={siteSettings.googleBusinessUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold uppercase tracking-wider text-[#D63384]">Open in Google Maps</a>}</div>
              <div className="rounded-2xl border border-[#EDE3E2] bg-white p-5 text-sm leading-6 text-gray-600"><Clock className="mb-2 h-5 w-5 text-[#D63384]" /><p className="font-semibold text-[#251B21]">Hours</p>{hoursText().split(' · ').map((line) => <p key={line}>{line}</p>)}</div>
              <div className="rounded-2xl border border-[#EDE3E2] bg-white p-5 text-sm leading-6 text-gray-600"><MessageCircle className="mb-2 h-5 w-5 text-[#D63384]" /><p className="font-semibold text-[#251B21]">WhatsApp & calls</p><p>{siteSettings.phoneDisplay}</p><a href={whatsappUrl()} onClick={() => trackWhatsAppClick(`landing-contact${page.path}`)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold uppercase tracking-wider text-[#D63384]">Message Cakeasy</a></div>
            </div>
          )}
        </section>
      ))}

      {picks.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <h2 className="font-serif text-3xl font-bold text-[#251B21]">{page.galleryHeading}</h2>
            <Link to="/gallery" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D63384]">View the full gallery <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {picks.map((entry) => (
              <figure key={entry.id} className="overflow-hidden rounded-3xl border border-neutral-100 bg-white">
                <div className="aspect-square bg-[#FFF5F8]/45"><img src={resolveCakeImage(entry.images[0].url)} alt={entry.images[0].alt || entry.caption} loading="lazy" className="h-full w-full object-contain p-2" /></div>
                {entry.caption && <figcaption className="p-4 text-xs leading-5 text-gray-600">{entry.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-center font-serif text-3xl font-bold text-[#251B21]">Questions before you order</h2>
          <div className="divide-y divide-[#EDE3E2] rounded-3xl border border-[#EDE3E2] bg-white">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div key={faq.id}>
                  <button type="button" onClick={() => setOpenFaq(isOpen ? null : faq.id)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                    <span className="text-sm font-semibold text-[#251B21]">{faq.question}</span>
                    <span className={`text-lg leading-none text-[#D63384] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <p className="overflow-hidden px-5 text-sm leading-6 text-gray-600"><span className="block pb-4">{faq.answer}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-[34px] border border-[#EDE3E2] bg-[#FFF7FA] p-8 text-center sm:p-12">
        <Check className="mx-auto h-6 w-6 text-[#D63384]" />
        <h2 className="mt-4 font-serif text-3xl font-bold text-[#251B21]">Tell us what you are celebrating.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600">Share the date, the guests and the story. Neha will help turn it into a cake that feels truly yours.</p>
        <Link to="/consultation" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#D63384] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#B02266]">Start your cake consultation <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </div>
  );
}
