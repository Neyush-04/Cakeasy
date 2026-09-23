import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Send, Check } from 'lucide-react';
import { sendEnquiry } from '../lib/whatsapp';
import { siteSettings } from '../lib/runtime';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message || submittedMessage) return;
    setSubmittedMessage(true);

    await sendEnquiry(
      { kind: 'contact', name, email, details: { Message: message } },
      (ref) => [
        'Hello Cakeasy, I would like to make an enquiry.',
        ref ? `Reference: ${ref}` : '',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Message: ${message}`,
      ].filter((line, index) => index !== 1 || line).join('\n'),
    );
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmittedMessage(false);
    }, 4000);
  };

  return (
    <div className="space-y-16 pb-20 animate-fadeIn">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">Contact Cakeasy</span>
            <h1 className="font-serif text-3xl font-bold text-[#1E1E1E]">Order by WhatsApp</h1>
            <p className="text-xs text-gray-500">
              Share your occasion, preferred date, flavour ideas, and design references. Cakeasy will confirm pricing, pickup or delivery, and availability directly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 bg-white border border-[#FFF5F8] rounded-2xl">
              <MapPin className="h-5 w-5 text-[#D63384] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-sm text-[#1E1E1E]">Studio Address</h2>
                <p className="text-xs text-gray-500 mt-0.5">{siteSettings.address.replace(/^Cakeasy,\s*/, '')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white border border-[#FFF5F8] rounded-2xl">
              <Phone className="h-5 w-5 text-[#D63384] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-sm text-[#1E1E1E]">WhatsApp & Calls</h2>
                <p className="text-xs text-gray-500 mt-0.5">{siteSettings.phoneDisplay}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white border border-[#FFF5F8] rounded-2xl">
              <Mail className="h-5 w-5 text-[#D63384] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-sm text-[#1E1E1E]">Email</h2>
                <p className="text-xs text-gray-500 mt-0.5">{siteSettings.email}</p>
              </div>
            </div>

            <a
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-4 p-5 bg-white border border-[#FFF5F8] rounded-2xl hover:border-[#F6B8C8] transition-colors"
            >
              <Instagram className="h-5 w-5 text-[#D63384] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-sm text-[#1E1E1E]">Instagram</h2>
                <p className="text-xs text-gray-500 mt-0.5">{siteSettings.instagramHandle}</p>
              </div>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#FFF5F8] shadow-sm space-y-6">
          <div className="space-y-1.5">
            <h2 className="font-serif font-bold text-xl text-[#1E1E1E]">Send an enquiry</h2>
            <p className="text-xs text-gray-500">Your enquiry is saved for Cakeasy, then WhatsApp opens with your message ready to send.</p>
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
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Order Details</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Occasion, date, servings, flavour, design idea, pickup or delivery preference..."
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
                  <Check className="h-4 w-4 animate-scaleIn" /> WhatsApp opened
                </>
              ) : (
                <>
                  Continue on WhatsApp <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
