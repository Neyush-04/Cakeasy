// Settings injected into each page by api/render.ts (window.__CAKEASY__), with
// built-in defaults for local development and as a safety net.
import {
  DEFAULT_MARKETING_SETTINGS, DEFAULT_SITE_SETTINGS,
  type MarketingSettings, type PublicRuntime, type SeoRecord, type SiteSettings,
} from '../../shared/site';

declare global {
  interface Window { __CAKEASY__?: Partial<PublicRuntime> }
}

const injected = typeof window !== 'undefined' ? window.__CAKEASY__ : undefined;

export const siteSettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS, ...(injected?.site || {}) };
export const marketingSettings: MarketingSettings = { ...DEFAULT_MARKETING_SETTINGS, ...(injected?.marketing || {}) };
export const seoOverrides: Record<string, Partial<SeoRecord>> = injected?.seo || {};
