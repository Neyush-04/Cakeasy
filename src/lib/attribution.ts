// Remembers how a visitor arrived (campaign tags, referring site, first page) for the
// length of their browser session, so an enquiry can be credited to its source.
// No personal data is stored here.
import { UTM_KEYS } from '../../shared/site';

const KEY = 'cakeasy_attribution_v1';

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | 'referrer' | 'landingPage', string>>;

function read(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Attribution : null;
  } catch {
    return null;
  }
}

export function captureAttribution(): void {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) return;
  const params = new URLSearchParams(window.location.search);
  const campaign: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) campaign[key] = value.slice(0, 120);
  }

  const existing = read();
  // A new campaign click replaces the session's source; otherwise keep the first touch.
  if (existing && Object.keys(campaign).length === 0) return;

  let referrer = '';
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.host !== window.location.host) referrer = ref.origin;
  } catch { /* ignore */ }

  const value: Attribution = { ...campaign, landingPage: window.location.pathname };
  if (referrer) value.referrer = referrer;
  try { sessionStorage.setItem(KEY, JSON.stringify(value)); } catch { /* storage blocked */ }
}

export function getAttribution(): Attribution {
  return read() || {};
}
