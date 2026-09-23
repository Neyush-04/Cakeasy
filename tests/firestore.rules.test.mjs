// Run with: npm run test:rules  (starts the Firestore emulator)
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, test } from 'node:test';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, getDocs, collection, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

let env;

const google = (email) => ({ email, email_verified: true, firebase: { sign_in_provider: 'google.com' } });
const as = (email, claims = google(email)) => env.authenticatedContext(email, claims).firestore();
const anon = () => env.unauthenticatedContext().firestore();

const OWNER = 'pixiforu@gmail.com';
const NEHA = 'cakeasy94@gmail.com';
const EDITOR = 'editor@example.com';
const MARKETER = 'marketer@example.com';
const DISABLED = 'former@example.com';

const stamp = (email) => ({ updatedAt: serverTimestamp(), updatedBy: email });

const enquiry = (overrides = {}) => ({
  kind: 'consultation', name: 'QA Test', phone: '+91 90000 00000', email: '', eventDate: '2026-12-01',
  details: { Venue: 'Greater Noida' }, source: { utm_source: 'instagram' }, pagePath: '/consultation',
  status: 'new', ref: 'CK-ABC123', createdAt: serverTimestamp(), ...overrides,
});

const seo = (email, extra = {}) => ({
  path: '/weddings', title: 'Wedding cakes', description: 'Desc', canonical: '', ogTitle: '', ogDescription: '', ogImage: '',
  index: true, follow: true, jsonLd: '', ...stamp(email), ...extra,
});

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-cakeasy',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8085 },
  });
});

after(async () => { await env?.cleanup(); });

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'cms_users', NEHA), { email: NEHA, role: 'owner', active: true });
    await setDoc(doc(db, 'cms_users', EDITOR), { email: EDITOR, role: 'editor', active: true });
    await setDoc(doc(db, 'cms_users', MARKETER), { email: MARKETER, role: 'marketing', active: true });
    await setDoc(doc(db, 'cms_users', DISABLED), { email: DISABLED, role: 'owner', active: false });
    await setDoc(doc(db, 'enquiries', 'seeded'), { ...enquiry(), createdAt: new Date() });
    await setDoc(doc(db, 'settings', 'site'), { whatsappNumber: '918810795004' });
  });
});

describe('public visitors', () => {
  test('can create a valid enquiry', async () => {
    await assertSucceeds(setDoc(doc(anon(), 'enquiries', 'e1'), enquiry()));
  });
  test('cannot create an enquiry with extra fields, a non-new status or a bad reference', async () => {
    await assertFails(setDoc(doc(anon(), 'enquiries', 'e2'), enquiry({ notes: 'x' })));
    await assertFails(setDoc(doc(anon(), 'enquiries', 'e3'), enquiry({ status: 'confirmed' })));
    await assertFails(setDoc(doc(anon(), 'enquiries', 'e4'), enquiry({ ref: 'hello' })));
    await assertFails(setDoc(doc(anon(), 'enquiries', 'e5'), enquiry({ createdAt: new Date('2020-01-01') })));
  });
  test('cannot read or list enquiries', async () => {
    await assertFails(getDoc(doc(anon(), 'enquiries', 'seeded')));
    await assertFails(getDocs(collection(anon(), 'enquiries')));
  });
  test('can read published settings, SEO and redirects but not write them', async () => {
    await assertSucceeds(getDoc(doc(anon(), 'settings', 'site')));
    await assertSucceeds(getDocs(collection(anon(), 'seo')));
    await assertSucceeds(getDocs(collection(anon(), 'redirects')));
    await assertFails(setDoc(doc(anon(), 'settings', 'site'), { whatsappNumber: '910000000000' }));
  });
  test('cannot read SEO drafts, CMS users or the audit log', async () => {
    await assertFails(getDocs(collection(anon(), 'seo_drafts')));
    await assertFails(getDoc(doc(anon(), 'cms_users', NEHA)));
    await assertFails(getDocs(collection(anon(), 'audit_log')));
  });
});

describe('sign-in requirements', () => {
  test('the bootstrap email signed in with a password (not Google) is refused', async () => {
    const db = as(OWNER, { email: OWNER, email_verified: true, firebase: { sign_in_provider: 'password' } });
    await assertFails(getDoc(doc(db, 'enquiries', 'seeded')));
  });
  test('an unverified Google email is refused', async () => {
    const db = as(OWNER, { email: OWNER, email_verified: false, firebase: { sign_in_provider: 'google.com' } });
    await assertFails(getDoc(doc(db, 'enquiries', 'seeded')));
  });
  test('an unknown Google account has no access', async () => {
    await assertFails(getDoc(doc(as('stranger@example.com'), 'enquiries', 'seeded')));
  });
  test('a deactivated member has no access', async () => {
    await assertFails(getDoc(doc(as(DISABLED), 'enquiries', 'seeded')));
    await assertFails(setDoc(doc(as(DISABLED), 'seo_drafts', 'weddings'), seo(DISABLED)));
  });
});

describe('owners', () => {
  test('bootstrap owner and Neha can read and update enquiries', async () => {
    await assertSucceeds(getDoc(doc(as(OWNER), 'enquiries', 'seeded')));
    await assertSucceeds(updateDoc(doc(as(NEHA), 'enquiries', 'seeded'), { status: 'contacted', notes: 'Called', ...stamp(NEHA) }));
  });
  test('cannot rewrite the customer details of an enquiry', async () => {
    await assertFails(updateDoc(doc(as(NEHA), 'enquiries', 'seeded'), { name: 'Changed', ...stamp(NEHA) }));
  });
  test('updates must be stamped with the signed-in email', async () => {
    await assertFails(updateDoc(doc(as(NEHA), 'enquiries', 'seeded'), { status: 'contacted', updatedAt: serverTimestamp(), updatedBy: OWNER }));
  });
  test('can manage users but cannot create a record for the bootstrap owner or an unknown role', async () => {
    await assertSucceeds(setDoc(doc(as(NEHA), 'cms_users', 'new@example.com'), { email: 'new@example.com', role: 'editor', active: true, name: 'New', ...stamp(NEHA) }));
    await assertFails(setDoc(doc(as(NEHA), 'cms_users', OWNER), { email: OWNER, role: 'editor', active: false, ...stamp(NEHA) }));
    await assertFails(setDoc(doc(as(NEHA), 'cms_users', 'x@example.com'), { email: 'x@example.com', role: 'superuser', active: true, ...stamp(NEHA) }));
  });
  test('cannot delete their own user record', async () => {
    await assertFails(deleteDoc(doc(as(NEHA), 'cms_users', NEHA)));
  });
  test('can save valid site settings; an invalid WhatsApp number is refused', async () => {
    await assertSucceeds(setDoc(doc(as(NEHA), 'settings', 'site'), { whatsappNumber: '918810795004', email: 'cakeasy94@gmail.com', ...stamp(NEHA) }));
    await assertFails(setDoc(doc(as(NEHA), 'settings', 'site'), { whatsappNumber: 'call me', ...stamp(NEHA) }));
  });
});

describe('editors', () => {
  test('can save and publish SEO', async () => {
    await assertSucceeds(setDoc(doc(as(EDITOR), 'seo_drafts', 'weddings'), seo(EDITOR)));
    await assertSucceeds(setDoc(doc(as(EDITOR), 'seo', 'weddings'), seo(EDITOR, { publishedAt: serverTimestamp() })));
  });
  test('cannot read enquiries, change settings or manage users', async () => {
    await assertFails(getDoc(doc(as(EDITOR), 'enquiries', 'seeded')));
    await assertFails(setDoc(doc(as(EDITOR), 'settings', 'site'), { whatsappNumber: '918810795004', ...stamp(EDITOR) }));
    await assertFails(setDoc(doc(as(EDITOR), 'settings', 'marketing'), { ga4MeasurementId: '', metaPixelId: '', googleSiteVerification: '', bingSiteVerification: '', ...stamp(EDITOR) }));
    await assertFails(setDoc(doc(as(EDITOR), 'cms_users', 'y@example.com'), { email: 'y@example.com', role: 'owner', active: true, ...stamp(EDITOR) }));
  });
  test('SEO with an invalid path or oversized title is refused', async () => {
    await assertFails(setDoc(doc(as(EDITOR), 'seo_drafts', 'bad'), seo(EDITOR, { path: 'https://evil.example' })));
    await assertFails(setDoc(doc(as(EDITOR), 'seo_drafts', 'long'), seo(EDITOR, { title: 'x'.repeat(200) })));
  });
});

describe('marketing', () => {
  test('can save tracking IDs; invalid IDs are refused', async () => {
    const ok = { ga4MeasurementId: 'G-ABC123XYZ', metaPixelId: '123456789012345', googleSiteVerification: '', bingSiteVerification: '', ...stamp(MARKETER) };
    await assertSucceeds(setDoc(doc(as(MARKETER), 'settings', 'marketing'), ok));
    await assertFails(setDoc(doc(as(MARKETER), 'settings', 'marketing'), { ...ok, metaPixelId: '<script>' }));
  });
  test('can manage internal redirects only', async () => {
    const rule = { source: '/old-page', destination: '/weddings', code: 301, enabled: true, ...stamp(MARKETER) };
    await assertSucceeds(setDoc(doc(as(MARKETER), 'redirects', 'r1'), rule));
    await assertFails(setDoc(doc(as(MARKETER), 'redirects', 'r2'), { ...rule, destination: 'https://elsewhere.example' }));
    await assertFails(setDoc(doc(as(MARKETER), 'redirects', 'r3'), { ...rule, code: 200 }));
  });
  test('cannot read enquiries or change contact settings', async () => {
    await assertFails(getDoc(doc(as(MARKETER), 'enquiries', 'seeded')));
    await assertFails(setDoc(doc(as(MARKETER), 'settings', 'site'), { whatsappNumber: '918810795004', ...stamp(MARKETER) }));
  });
});

describe('audit log', () => {
  test('staff can append entries only as themselves', async () => {
    await assertSucceeds(setDoc(doc(as(EDITOR), 'audit_log', 'a1'), { actor: EDITOR, action: 'seo.publish', target: '/weddings', at: serverTimestamp() }));
    await assertFails(setDoc(doc(as(EDITOR), 'audit_log', 'a2'), { actor: NEHA, action: 'seo.publish', target: '/weddings', at: serverTimestamp() }));
  });
  test('entries cannot be edited or deleted', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => setDoc(doc(ctx.firestore(), 'audit_log', 'a3'), { actor: NEHA, action: 'x', target: 'y', at: new Date() }));
    await assertFails(updateDoc(doc(as(NEHA), 'audit_log', 'a3'), { action: 'changed' }));
    await assertFails(deleteDoc(doc(as(NEHA), 'audit_log', 'a3')));
  });
});
