// GA4 + Meta Pixel, loaded only after the visitor consents and only when the IDs
// are set in CMS > Marketing & tracking. Never runs on /admin.
//
// Event contract (see docs/marketing/MEASUREMENT_PLAN.md):
//   page_view        every public route change
//   whatsapp_click   engagement only, never a lead
//   generate_lead    one per enquiry actually saved in the CMS (Meta: Lead)
import { marketingSettings } from './runtime';

type Consent = { analytics: boolean; ads: boolean; at: string };
const CONSENT_KEY = 'cakeasy_consent_v1';
const listeners = new Set<() => void>();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: (...args: unknown[]) => void; push?: unknown };
    _fbq?: unknown;
  }
}

const ga4Id = marketingSettings.ga4MeasurementId;
const pixelId = marketingSettings.metaPixelId;
let gaLoaded = false;
let pixelLoaded = false;

export const trackingConfigured = Boolean(ga4Id || pixelId);

function isAdminPath() {
  return window.location.pathname.startsWith('/admin');
}

export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) as Consent : null;
  } catch {
    return null;
  }
}

export function setConsent(analytics: boolean, ads: boolean) {
  const value: Consent = { analytics, ads, at: new Date().toISOString() };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(value)); } catch { /* storage blocked */ }
  applyConsent(value);
  listeners.forEach((listener) => listener());
}

export function onConsentChange(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function loadScript(src: string) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function applyConsent(consent: Consent | null) {
  if (!consent || isAdminPath()) return;

  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.ads ? 'granted' : 'denied',
      ad_user_data: consent.ads ? 'granted' : 'denied',
      ad_personalization: consent.ads ? 'granted' : 'denied',
    });
  }

  if (ga4Id && consent.analytics && !gaLoaded) {
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer!.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: consent.ads ? 'granted' : 'denied',
      ad_user_data: consent.ads ? 'granted' : 'denied',
      ad_personalization: consent.ads ? 'granted' : 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', ga4Id, { send_page_view: false });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`);
  }

  if (pixelId && consent.ads && !pixelLoaded) {
    pixelLoaded = true;
    const fbq: NonNullable<Window['fbq']> = (...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args); else fbq.queue!.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixelId);
  }
}

export function initAnalytics() {
  if (!trackingConfigured) return;
  applyConsent(getConsent());
}

function push(event: string, params: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function trackPageView(path: string, title: string) {
  if (isAdminPath()) return;
  push('page_view', { page_path: path });
  if (gaLoaded && window.gtag) window.gtag('event', 'page_view', { page_path: path, page_title: title, page_location: window.location.href });
  if (pixelLoaded && window.fbq) window.fbq('track', 'PageView');
}

export function trackWhatsAppClick(placement: string) {
  if (isAdminPath()) return;
  push('whatsapp_click', { placement });
  if (gaLoaded && window.gtag) window.gtag('event', 'whatsapp_click', { placement });
  if (pixelLoaded && window.fbq) window.fbq('track', 'Contact');
}

// Call only after the enquiry is confirmed saved.
export function trackLead(kind: string) {
  push('lead_submission_success', { form_id: kind });
  if (gaLoaded && window.gtag) window.gtag('event', 'generate_lead', { form_id: kind });
  if (pixelLoaded && window.fbq) window.fbq('track', 'Lead', { content_name: kind });
}
