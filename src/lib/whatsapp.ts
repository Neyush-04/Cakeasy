// WhatsApp is Cakeasy's order channel. Enquiry forms save to the CMS first, then
// hand the visitor to WhatsApp with the brief (and a reference number) pre-filled.
import { getAttribution } from './attribution';
import { trackLead, trackWhatsAppClick } from './analytics';
import { siteSettings } from './runtime';

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${siteSettings.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export interface EnquiryInput {
  kind: 'consultation' | 'custom-cake' | 'contact' | 'cart';
  name?: string;
  phone?: string;
  email?: string;
  eventDate?: string;
  details: Record<string, string>;
}

const SAVE_TIMEOUT_MS = 3000;

async function saveEnquiry(input: EnquiryInput): Promise<string | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), SAVE_TIMEOUT_MS);
  try {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ ...input, source: getAttribution(), pagePath: window.location.pathname }),
    });
    if (!response.ok) return null;
    const payload = await response.json() as { ref?: string };
    return payload.ref || null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

// Must be called directly from a click/submit handler so the new tab is not blocked.
// The tab opens immediately, the enquiry is saved (max ~3s), then the tab goes to WhatsApp.
// If saving fails the visitor still reaches WhatsApp: no enquiry is ever lost to an error.
export async function sendEnquiry(input: EnquiryInput, buildMessage: (ref: string | null) => string): Promise<string | null> {
  const tab = window.open('', '_blank');
  if (tab) {
    try {
      tab.opener = null;
      tab.document.title = 'Opening WhatsApp…';
      tab.document.body.style.cssText = 'font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#43242F';
      tab.document.body.textContent = 'Opening WhatsApp…';
    } catch { /* cross-origin or blocked: fine */ }
  }

  const ref = await saveEnquiry(input);
  if (ref) trackLead(input.kind);
  trackWhatsAppClick(`form:${input.kind}`);

  const url = whatsappUrl(buildMessage(ref));
  if (tab && !tab.closed) tab.location.href = url;
  else window.location.href = url;
  return ref;
}

// For plain "Chat on WhatsApp" buttons/links.
export function openWhatsApp(placement: string, text?: string) {
  trackWhatsAppClick(placement);
  window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');
}
