import { useEffect } from 'react';
import { absoluteUrl, findRoute, normalizePath, DEFAULT_OG_IMAGE } from '../../shared/site';
import { seoOverrides } from '../lib/runtime';
import { trackPageView } from '../lib/analytics';

// The server sends the correct tags on first load (api/render.ts). This keeps them
// in step during in-app navigation and fires one page_view per route.
function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function PageMeta({ pathname }: { pathname: string }) {
  useEffect(() => {
    const path = normalizePath(pathname);
    const isAdmin = path === '/admin' || path.startsWith('/admin/');
    const route = findRoute(path);
    const override = seoOverrides[path] || {};

    const title = isAdmin ? 'Cakeasy CMS' : override.title || route?.title || 'Page not found | Cakeasy';
    const description = override.description || route?.description || '';
    const index = !isAdmin && Boolean(route) && (override.index ?? route?.index ?? true);
    const follow = !isAdmin && (override.follow ?? true);
    const canonical = override.canonical ? absoluteUrl(override.canonical) : absoluteUrl(path);

    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', `${index ? 'index' : 'noindex'}, ${follow ? 'follow' : 'nofollow'}`);
    setMeta('meta[property="og:title"]', 'property', 'og:title', override.ogTitle || title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', override.ogDescription || description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    setMeta('meta[property="og:image"]', 'property', 'og:image', absoluteUrl(override.ogImage || DEFAULT_OG_IMAGE));

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;

    if (!isAdmin) trackPageView(path, title);
  }, [pathname]);

  return null;
}
