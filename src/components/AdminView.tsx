import { ShieldCheck, Lock, Instagram, Database } from 'lucide-react';

export default function AdminView() {
  return (
    <div className="pb-20 animate-fadeIn">
      <section className="max-w-3xl mx-auto bg-white border border-[#FFF5F8] rounded-[32px] p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#FFF5F8] text-[#D63384] flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#D63384]">Owner CMS</p>
            <h1 className="font-serif text-3xl font-bold text-[#1E1E1E]">Secure CMS is being rebuilt</h1>
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          The previous admin panel was removed because it was a browser-only mock with unsafe write access. This page marks the safe owner route while the real CMS is rebuilt with Firebase Auth, an admin role, and server-side Instagram sync.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-pink-50 bg-[#FFF5F8]/40 p-4 space-y-2">
            <Lock className="h-5 w-5 text-[#D63384]" />
            <h2 className="font-bold text-sm text-[#1E1E1E]">Protected login</h2>
            <p className="text-xs text-gray-500">Firebase Auth plus an owner-only admin claim.</p>
          </div>
          <div className="rounded-2xl border border-pink-50 bg-[#FFF5F8]/40 p-4 space-y-2">
            <Instagram className="h-5 w-5 text-[#D63384]" />
            <h2 className="font-bold text-sm text-[#1E1E1E]">Instagram sync</h2>
            <p className="text-xs text-gray-500">Meta API sync from a secure server token.</p>
          </div>
          <div className="rounded-2xl border border-pink-50 bg-[#FFF5F8]/40 p-4 space-y-2">
            <Database className="h-5 w-5 text-[#D63384]" />
            <h2 className="font-bold text-sm text-[#1E1E1E]">Safe content edits</h2>
            <p className="text-xs text-gray-500">Products, gallery, policies, and contact details.</p>
          </div>
        </div>

        <a
          href="https://wa.me/918810795004?text=Please%20activate%20the%20secure%20Cakeasy%20CMS."
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#20ba59] transition-colors"
        >
          Request CMS activation on WhatsApp
        </a>
      </section>
    </div>
  );
}
