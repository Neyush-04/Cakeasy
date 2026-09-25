import { useEffect, useState } from 'react';
import { getConsent, setConsent, trackingConfigured } from '../lib/analytics';

export const OPEN_CONSENT_EVENT = 'cakeasy:open-consent';

export default function ConsentBanner() {
  const [open, setOpen] = useState(() => trackingConfigured && !getConsent());
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const reopen = () => {
      const current = getConsent();
      setAnalytics(current?.analytics ?? true);
      setAds(current?.ads ?? false);
      setCustom(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open || !trackingConfigured) return null;

  const save = (a: boolean, m: boolean) => {
    setConsent(a, m);
    setOpen(false);
  };

  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie preferences" className="fixed bottom-3 left-3 right-[88px] z-[60] sm:right-auto sm:left-5 sm:bottom-5 sm:max-w-sm animate-fadeIn">
      <div className="rounded-2xl border border-[#EDE3E2] bg-white p-4 shadow-[0_12px_40px_rgba(37,27,33,0.14)]">
        <p className="text-[13px] font-semibold text-[#251B21]">Cookies on Cakeasy</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          We use optional cookies to understand visits and measure our ads. Your enquiry works either way.
        </p>

        {custom && (
          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
            <Toggle label="Site analytics" hint="Which pages help people plan their cake" checked={analytics} onChange={setAnalytics} />
            <Toggle label="Advertising" hint="Measures Instagram / Google ad results" checked={ads} onChange={setAds} />
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {custom ? (
            <button onClick={() => save(analytics, ads)} className="rounded-full bg-[#251B21] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-[#43242F]">Save choices</button>
          ) : (
            <>
              <button onClick={() => save(true, true)} className="rounded-full bg-[#251B21] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-[#43242F]">Accept</button>
              <button onClick={() => save(false, false)} className="rounded-full border border-[#EDE3E2] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#43242F] hover:bg-[#FFF7FA]">Only necessary</button>
              <button onClick={() => setCustom(true)} className="px-2 py-2 text-[11px] font-semibold text-gray-500 underline-offset-2 hover:text-[#D63384] hover:underline">Choose</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span>
        <span className="block text-xs font-semibold text-[#43242F]">{label}</span>
        <span className="block text-[11px] text-gray-400">{hint}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[#D63384]" />
    </label>
  );
}
