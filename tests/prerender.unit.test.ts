import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderBody } from '../api/_lib/prerender.ts';
import { injectIntoShell, resolveSeo } from '../shared/head.ts';
import { DEFAULT_MARKETING_SETTINGS, DEFAULT_SITE_SETTINGS, PUBLIC_ROUTES, findRoute } from '../shared/site.ts';
import { LANDING_PAGES } from '../shared/landing.ts';

const site = { ...DEFAULT_SITE_SETTINGS, googleBusinessUrl: 'https://maps.google.com/?cid=1' };
const empty = { gallery: [], catalogue: [], faqs: [] };
const words = (html: string) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

test('every public page gets real HTML content with one h1 and site links', () => {
  for (const route of PUBLIC_ROUTES) {
    const html = renderBody(route.path, 'public', empty, site);
    assert.ok(words(html) > 40, `${route.path} has too little content (${words(html)} words)`);
    assert.equal((html.match(/<h1/g) || []).length, 1, `${route.path} should have exactly one h1`);
    assert.ok(html.includes('href="/eggless-cakes"'), `${route.path} should link to the eggless page`);
  }
});

test('the CMS is never pre-rendered; 404s get a helpful body', () => {
  assert.equal(renderBody('/admin', 'admin', empty, site), '');
  assert.ok(renderBody('/nope', 'not-found', empty, site).includes("isn't on the menu"));
});

test('landing pages are public routes and render their own copy', () => {
  for (const page of Object.values(LANDING_PAGES)) {
    assert.ok(findRoute(page.path), `${page.path} must be in PUBLIC_ROUTES`);
    const html = renderBody(page.path, 'public', empty, site);
    assert.ok(html.includes(page.h1.replace('’', '&#39;').slice(0, 20)) || html.includes(page.h1.slice(0, 20)));
    assert.ok(html.includes('Greater Noida'));
  }
});

test('CMS text is escaped in pre-rendered HTML', () => {
  const html = renderBody('/consultation', 'public', { ...empty, faqs: [{ id: 'f', question: '<script>x</script>', answer: 'Yes', published: true, order: 1 }] }, site);
  assert.ok(!html.includes('<script>x</script>'));
});

test('the business schema carries location, hours and the Maps link; inner pages get breadcrumbs', () => {
  const home = resolveSeo({ path: '/', kind: 'public', route: findRoute('/'), site });
  const bakery = home.jsonLd[0] as Record<string, any>;
  assert.equal(bakery.geo.latitude, 28.4484242);
  assert.equal(bakery.openingHoursSpecification.length, 2);
  assert.equal(bakery.hasMap, 'https://maps.google.com/?cid=1');
  const inner = resolveSeo({ path: '/eggless-cakes', kind: 'public', route: findRoute('/eggless-cakes'), site });
  assert.ok(inner.jsonLd.some((item) => (item as Record<string, unknown>)['@type'] === 'BreadcrumbList'));
});

test('the pre-rendered body lands inside #root', () => {
  const shell = '<html><head><!--seo:start--><!--seo:end--></head><body><div id="root"></div></body></html>';
  const out = injectIntoShell(shell, '<title>x</title>', { site, marketing: DEFAULT_MARKETING_SETTINGS, seo: {} }, '<main>hello</main>');
  assert.ok(out.includes('<div id="root"><main>hello</main></div>'));
});
