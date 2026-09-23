// Published CMS content for the server functions, with a short in-memory cache per instance.
import { getDocument, listDocuments, type PlainDoc } from '../../shared/firestore-rest.js';
import { sanitizeMarketing } from '../../shared/head.js';
import {
  DEFAULT_MARKETING_SETTINGS, DEFAULT_SITE_SETTINGS, normalizePath,
  type MarketingSettings, type SeoRecord, type SiteSettings,
} from '../../shared/site.js';

const TTL_MS = 60_000;
const cache = new Map<string, { at: number; value: unknown }>();

async function cached<T>(key: string, load: () => Promise<T>, fallback: T): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  try {
    const value = await load();
    cache.set(key, { at: Date.now(), value });
    return value;
  } catch (error) {
    console.error(`[content] ${key}:`, error instanceof Error ? error.message : error);
    // Serve the last good value if there is one, otherwise the built-in defaults.
    return hit ? hit.value as T : fallback;
  }
}

function pickStrings<T extends object>(defaults: T, doc: PlainDoc | null): T {
  const out = { ...defaults } as Record<string, unknown>;
  if (!doc) return out as T;
  for (const key of Object.keys(defaults)) {
    const value = doc[key];
    if (typeof value === 'string') out[key] = value.trim();
  }
  return out as T;
}

export function getSiteSettings(): Promise<SiteSettings> {
  return cached('site', async () => {
    const merged = pickStrings(DEFAULT_SITE_SETTINGS, await getDocument('settings', 'site'));
    // Never let an emptied CMS field remove the WhatsApp order path.
    if (!/^\d{10,15}$/.test(merged.whatsappNumber)) merged.whatsappNumber = DEFAULT_SITE_SETTINGS.whatsappNumber;
    return merged;
  }, DEFAULT_SITE_SETTINGS);
}

export function getMarketingSettings(): Promise<MarketingSettings> {
  return cached('marketing', async () => sanitizeMarketing(pickStrings(DEFAULT_MARKETING_SETTINGS, await getDocument('settings', 'marketing'))), DEFAULT_MARKETING_SETTINGS);
}

export function getSeoOverrides(): Promise<Record<string, Partial<SeoRecord>>> {
  return cached('seo', async () => {
    const map: Record<string, Partial<SeoRecord>> = {};
    for (const doc of await listDocuments('seo')) {
      if (typeof doc.path !== 'string') continue;
      map[normalizePath(doc.path)] = {
        title: str(doc.title), description: str(doc.description), canonical: str(doc.canonical),
        ogTitle: str(doc.ogTitle), ogDescription: str(doc.ogDescription), ogImage: str(doc.ogImage),
        index: typeof doc.index === 'boolean' ? doc.index : undefined,
        follow: typeof doc.follow === 'boolean' ? doc.follow : undefined,
        jsonLd: str(doc.jsonLd),
      };
    }
    return map;
  }, {});
}

export interface RedirectRule { source: string; destination: string; code: 301 | 302 | 307 | 308 }

export function getRedirects(): Promise<Map<string, RedirectRule>> {
  return cached('redirects', async () => {
    const map = new Map<string, RedirectRule>();
    for (const doc of await listDocuments('redirects')) {
      if (doc.enabled !== true || typeof doc.source !== 'string' || typeof doc.destination !== 'string') continue;
      const code = [301, 302, 307, 308].includes(Number(doc.code)) ? Number(doc.code) as RedirectRule['code'] : 301;
      map.set(normalizePath(doc.source), { source: normalizePath(doc.source), destination: doc.destination, code });
    }
    return map;
  }, new Map());
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
