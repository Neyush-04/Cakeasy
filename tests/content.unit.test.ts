import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanCatalogueItem, cleanFaqItem, cleanGalleryItem, faqJsonLd, safeImageUrl } from '../shared/content.ts';

test('only site paths and https images are allowed', () => {
  assert.equal(safeImageUrl('/gallery/1/img1.jpg'), '/gallery/1/img1.jpg');
  assert.equal(safeImageUrl('https://firebasestorage.googleapis.com/v0/b/x/o/a.jpg'), 'https://firebasestorage.googleapis.com/v0/b/x/o/a.jpg');
  assert.equal(safeImageUrl('javascript:alert(1)'), '');
  assert.equal(safeImageUrl('http://insecure.example/a.jpg'), '');
  assert.equal(safeImageUrl('//evil.example/a.jpg'), '');
  assert.equal(safeImageUrl('/a.jpg" onerror="x'), '');
});

test('gallery items drop unsafe images and unknown categories', () => {
  const item = cleanGalleryItem('g1', {
    caption: ' Engagement cake ', category: 'hacked', year: '2026', date: 'Mar 05, 2026', published: true, featured: 'yes', order: 3,
    images: [{ url: 'javascript:alert(1)', alt: 'bad' }, { url: '/gallery/9/img1.jpg', alt: 'Three-tier cake' }],
  });
  assert.ok(item);
  assert.equal(item!.caption, 'Engagement cake');
  assert.equal(item!.category, 'designer');
  assert.equal(item!.featured, false);
  assert.deepEqual(item!.images, [{ url: '/gallery/9/img1.jpg', alt: 'Three-tier cake' }]);
  assert.equal(cleanGalleryItem('g2', { images: [{ url: 'javascript:x' }] }), null);
});

test('catalogue items need a name and a safe image', () => {
  assert.equal(cleanCatalogueItem('c1', { name: '', image: '/catalog/product1.jpg' }), null);
  assert.equal(cleanCatalogueItem('c2', { name: 'Bento', image: 'data:image/png;base64,xx' }), null);
  const item = cleanCatalogueItem('c3', { name: 'Bento', image: '/catalog/product1.jpg', category: 'bento', popularFlavors: ['Vanilla', 5, ''], published: true });
  assert.deepEqual(item!.popularFlavors, ['Vanilla']);
});

test('FAQ schema lists exactly the published FAQs given', () => {
  assert.equal(faqJsonLd([]), null);
  const faq = cleanFaqItem('f1', { question: 'Are your cakes eggless?', answer: 'Yes, by default.', published: true, order: 1 })!;
  const schema = faqJsonLd([faq]) as { '@type': string; mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema.mainEntity[0].name, 'Are your cakes eggless?');
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, 'Yes, by default.');
  assert.equal(cleanFaqItem('f2', { question: 'Q?', answer: '' }), null);
});
