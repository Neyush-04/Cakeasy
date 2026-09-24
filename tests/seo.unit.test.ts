import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildHeadHtml, injectIntoShell, parseJsonLd, resolveSeo, safeJson, sanitizeMarketing } from '../shared/head.ts';
import { DEFAULT_MARKETING_SETTINGS, DEFAULT_SITE_SETTINGS, findRoute, isReservedPath, normalizePath, seoDocId } from '../shared/site.ts';
import { validateEnquiry } from '../api/enquiry.ts';

const site = DEFAULT_SITE_SETTINGS;

test('paths are normalised consistently', () => {
  assert.equal(normalizePath('/Weddings/'), '/weddings');
  assert.equal(normalizePath('weddings?utm_source=x#top'), '/weddings');
  assert.equal(normalizePath('//cakes//designer'), '/cakes/designer');
  assert.equal(seoDocId('/'), 'home');
  assert.equal(seoDocId('/cakes/designer'), 'cakes__designer');
});

test('reserved paths protect system routes but not the gallery page', () => {
  assert.equal(isReservedPath('/admin'), true);
  assert.equal(isReservedPath('/admin/seo'), true);
  assert.equal(isReservedPath('/api/enquiry'), true);
  assert.equal(isReservedPath('/gallery/1/img1.jpg'), true);
  assert.equal(isReservedPath('/gallery'), false);
  assert.equal(isReservedPath('/wedding-offer'), false);
});

test('each public route gets its own title, canonical and indexable robots tag', () => {
  const seo = resolveSeo({ path: '/weddings', kind: 'public', route: findRoute('/weddings'), site });
  assert.equal(seo.title, 'Wedding & Milestone Cakes | Cakeasy');
  assert.equal(seo.canonical, 'https://www.cakeasy.in/weddings');
  assert.match(seo.robots, /^index, follow/);
});

test('CMS overrides win, and noindex is respected', () => {
  const seo = resolveSeo({
    path: '/weddings', kind: 'public', route: findRoute('/weddings'), site,
    override: { title: 'Wedding Cakes in Greater Noida | Cakeasy', index: false, ogImage: '/gallery/9/img1.jpg' },
  });
  assert.equal(seo.title, 'Wedding Cakes in Greater Noida | Cakeasy');
  assert.equal(seo.robots, 'noindex, follow');
  assert.equal(seo.ogImage, 'https://www.cakeasy.in/gallery/9/img1.jpg');
});

test('a canonical pointing to another website is ignored', () => {
  const seo = resolveSeo({ path: '/about', kind: 'public', route: findRoute('/about'), site, override: { canonical: 'https://evil.example/page' } });
  assert.equal(seo.canonical, 'https://www.cakeasy.in/about');
});

test('unknown pages and the CMS are never indexable', () => {
  assert.equal(resolveSeo({ path: '/nope', kind: 'not-found', site }).robots, 'noindex, follow');
  assert.equal(resolveSeo({ path: '/admin', kind: 'admin', site }).robots, 'noindex, nofollow');
});

test('head HTML escapes CMS text and cannot break out of script tags', () => {
  const seo = resolveSeo({ path: '/', kind: 'public', route: findRoute('/'), site, override: { title: '"><script>alert(1)</script>' } });
  const html = buildHeadHtml(seo, DEFAULT_MARKETING_SETTINGS);
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!safeJson({ a: '</script><script>x' }).includes('</script>'));
});

test('the bakery schema carries the real address and no ratings', () => {
  const seo = resolveSeo({ path: '/', kind: 'public', route: findRoute('/'), site });
  const bakery = seo.jsonLd[0] as Record<string, any>;
  assert.equal(bakery['@type'], 'Bakery');
  assert.equal(bakery.address.addressLocality, 'Greater Noida');
  assert.equal(bakery.address.addressRegion, 'Uttar Pradesh');
  assert.equal('aggregateRating' in bakery, false);
  assert.equal('review' in bakery, false);
});

test('invalid JSON-LD from the CMS is dropped', () => {
  assert.deepEqual(parseJsonLd('not json'), []);
  assert.deepEqual(parseJsonLd('{"name":"no type"}'), []);
  assert.equal(parseJsonLd('{"@context":"https://schema.org","@type":"FAQPage"}').length, 1);
});

test('tracking IDs are validated before reaching the page', () => {
  const clean = sanitizeMarketing({ ga4MeasurementId: 'g-abc123', metaPixelId: '<script>', googleSiteVerification: 'token_123456' });
  assert.equal(clean.ga4MeasurementId, 'G-ABC123');
  assert.equal(clean.metaPixelId, '');
  const html = buildHeadHtml(resolveSeo({ path: '/', kind: 'public', route: findRoute('/'), site }), clean);
  assert.ok(html.includes('google-site-verification" content="token_123456"'));
  const meta = buildHeadHtml(resolveSeo({ path: '/', kind: 'public', route: findRoute('/'), site }), sanitizeMarketing({ metaDomainVerification: 'abc123def456' }));
  assert.ok(meta.includes('facebook-domain-verification" content="abc123def456"'));
  const bad = buildHeadHtml(resolveSeo({ path: '/', kind: 'public', route: findRoute('/'), site }), sanitizeMarketing({ metaDomainVerification: '"><script>' }));
  assert.ok(!bad.includes('facebook-domain-verification'));
});

test('the shell gets SEO between the markers plus runtime settings', () => {
  const shell = '<html><head><!--seo:start--><title>old</title><!--seo:end--></head><body></body></html>';
  const out = injectIntoShell(shell, '<title>new</title>', { site, marketing: DEFAULT_MARKETING_SETTINGS, seo: {} });
  assert.ok(out.includes('<title>new</title>'));
  assert.ok(!out.includes('<title>old</title>'));
  assert.ok(out.includes('window.__CAKEASY__='));
});

test('enquiry validation requires contact details and strips junk', () => {
  assert.ok('error' in validateEnquiry({ kind: 'hack' }));
  assert.ok('error' in validateEnquiry({ kind: 'consultation', name: 'A' }));
  assert.ok('error' in validateEnquiry({ kind: 'contact', name: 'A', email: 'not-an-email' }));
  const ok = validateEnquiry({
    kind: 'consultation', name: '  Aditi  ', phone: '+91 98100 00000', details: { Venue: 'Noida', '<bad key>': 'x', Empty: '' },
    source: { utm_source: 'instagram', evil: 'x' },
  });
  assert.ok('value' in ok);
  if ('value' in ok) {
    assert.equal(ok.value.name, 'Aditi');
    assert.deepEqual(ok.value.details, { Venue: 'Noida' });
    assert.deepEqual(ok.value.source, { utm_source: 'instagram' });
    assert.equal(ok.value.status, 'new');
  }
  assert.ok('value' in validateEnquiry({ kind: 'custom-cake', details: { Flavour: 'Vanilla' } }));
});
