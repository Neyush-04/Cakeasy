import React, { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import { Copy, ExternalLink, Link2 } from 'lucide-react';
import {
  DEFAULT_MARKETING_SETTINGS, GA4_ID_PATTERN, META_PIXEL_PATTERN, PUBLIC_ROUTES, SITE_ORIGIN, VERIFICATION_TOKEN_PATTERN,
  isReservedPath, normalizePath, seoDocId, type MarketingSettings,
} from '../../../shared/site';
import { db, friendlyError, logAudit, stamp } from '../firebase';
import { useSession } from '../session';
import { Badge, Button, Card, Field, Loading, Notice, PageHeader, inputClass, useToast } from '../ui';

const PRESETS = [
  { label: 'Instagram bio', source: 'instagram', medium: 'social', content: 'bio' },
  { label: 'Instagram story / reel', source: 'instagram', medium: 'social', content: 'story' },
  { label: 'Instagram ad', source: 'instagram', medium: 'paid_social', content: '' },
  { label: 'Facebook ad', source: 'facebook', medium: 'paid_social', content: '' },
  { label: 'WhatsApp status / broadcast', source: 'whatsapp', medium: 'social', content: 'status' },
  { label: 'Google Business Profile', source: 'google', medium: 'organic_local', content: 'gbp' },
  { label: 'Google Ads', source: 'google', medium: 'cpc', content: '' },
  { label: 'Printed card / QR code', source: 'print', medium: 'qr', content: 'card' },
  { label: 'Wedding planner / partner', source: 'partner', medium: 'referral', content: '' },
];

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 60);

export function validateMarketing(form: MarketingSettings): string {
  if (form.ga4MeasurementId && !GA4_ID_PATTERN.test(form.ga4MeasurementId)) return 'GA4 Measurement ID looks like G-XXXXXXXXXX.';
  if (form.metaPixelId && !META_PIXEL_PATTERN.test(form.metaPixelId)) return 'Meta Pixel ID is a number of 8–20 digits.';
  if (form.googleSiteVerification && !VERIFICATION_TOKEN_PATTERN.test(form.googleSiteVerification)) return 'Paste only the content value of the Google verification tag, not the whole tag.';
  if (form.bingSiteVerification && !VERIFICATION_TOKEN_PATTERN.test(form.bingSiteVerification)) return 'Paste only the content value of the Bing verification tag.';
  if (form.metaDomainVerification && !VERIFICATION_TOKEN_PATTERN.test(form.metaDomainVerification)) return 'Paste only the content value of the Meta domain verification tag.';
  return '';
}

// Accepts either the bare token or the full <meta ... content="..."> tag.
function extractToken(value: string): string {
  const match = value.match(/content=["']([^"']+)["']/i);
  return (match ? match[1] : value).trim();
}

export default function MarketingModule() {
  const notify = useToast();
  const [form, setForm] = useState<MarketingSettings | null>(null);
  const [saved, setSaved] = useState<MarketingSettings | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'marketing')).then((snapshot) => {
      const data = { ...DEFAULT_MARKETING_SETTINGS, ...(snapshot.data() || {}) } as MarketingSettings;
      const clean: MarketingSettings = {
        ga4MeasurementId: data.ga4MeasurementId || '', metaPixelId: data.metaPixelId || '', googleSiteVerification: data.googleSiteVerification || '',
        bingSiteVerification: data.bingSiteVerification || '', metaDomainVerification: data.metaDomainVerification || '',
      };
      setForm(clean);
      setSaved(clean);
    }).catch((error) => { notify(friendlyError(error), 'error'); setForm({ ...DEFAULT_MARKETING_SETTINGS }); });
  }, [notify]);

  if (!form) return <Loading />;
  const problem = validateMarketing(form);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const save = async () => {
    setBusy(true);
    try {
      await setDoc(doc(db, 'settings', 'marketing'), { ...form, ...stamp() });
      setSaved(form);
      void logAudit('settings.marketing', 'settings/marketing', `GA4 ${form.ga4MeasurementId || 'off'}, Pixel ${form.metaPixelId || 'off'}`);
      notify('Saved. Live on the website within about 2 minutes.');
    } catch (error) { notify(friendlyError(error), 'error'); } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Growth"
        title="Marketing & tracking"
        description="Connect Google Analytics, the Meta Pixel and search engines without touching code, and build tagged links so every enquiry shows where it came from."
        actions={<Button tone="primary" onClick={save} busy={busy} disabled={!dirty || Boolean(problem)}>Save changes</Button>}
      />
      {problem && <div className="mb-4"><Notice tone="red">{problem}</Notice></div>}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Analytics & ads</p>
            <Badge tone={form.ga4MeasurementId || form.metaPixelId ? 'green' : 'gray'}>{form.ga4MeasurementId || form.metaPixelId ? 'Tracking on' : 'Not connected'}</Badge>
          </div>
          <Field label="Google Analytics 4 Measurement ID" hint="GA4 → Admin → Data streams → Web → Measurement ID.">
            <input value={form.ga4MeasurementId} onChange={(event) => setForm({ ...form, ga4MeasurementId: event.target.value.trim().toUpperCase() })} placeholder="G-XXXXXXXXXX" className={`${inputClass} font-mono`} />
          </Field>
          <Field label="Meta Pixel ID" hint="Meta Events Manager → Data sources → your Pixel → ID.">
            <input value={form.metaPixelId} onChange={(event) => setForm({ ...form, metaPixelId: event.target.value.replace(/\D/g, '') })} placeholder="123456789012345" className={`${inputClass} font-mono`} />
          </Field>
          <Notice tone="blue">
            Tags load only after a visitor accepts cookies, and never inside this CMS. Events sent: <b>page_view</b>, <b>whatsapp_click</b> (engagement), and <b>generate_lead</b> / Meta <b>Lead</b> once per enquiry actually saved here. Mark <b>generate_lead</b> as the key event in GA4.
          </Notice>
        </Card>

        <Card className="space-y-3 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Search engine verification</p>
          <Field label="Google Search Console" hint={<>Search Console → Add property → URL prefix <span className="font-mono">{SITE_ORIGIN}/</span> → HTML tag. Paste the tag or just its content value.</>}>
            <input value={form.googleSiteVerification} onChange={(event) => setForm({ ...form, googleSiteVerification: extractToken(event.target.value) })} placeholder="abc123…" className={`${inputClass} font-mono`} />
          </Field>
          <Field label="Bing Webmaster Tools" hint="Optional. Also powers some AI search answers.">
            <input value={form.bingSiteVerification} onChange={(event) => setForm({ ...form, bingSiteVerification: extractToken(event.target.value) })} placeholder="ABC123…" className={`${inputClass} font-mono`} />
          </Field>
          <Field label="Meta domain verification" hint="Meta Business Suite → Brand safety → Domains → Add → Meta-tag option. Needed before running Instagram/Facebook ads to the site.">
            <input value={form.metaDomainVerification} onChange={(event) => setForm({ ...form, metaDomainVerification: extractToken(event.target.value) })} placeholder="abc123…" className={`${inputClass} font-mono`} />
          </Field>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[12px]">
            {[
              ['Search Console', 'https://search.google.com/search-console'],
              ['Google Business Profile', 'https://business.google.com/'],
              ['PageSpeed Insights', `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(`${SITE_ORIGIN}/`)}`],
              ['Rich Results Test', `https://search.google.com/test/rich-results?url=${encodeURIComponent(`${SITE_ORIGIN}/`)}`],
              ['Sitemap', '/sitemap.xml'],
              ['llms.txt (AI summary)', '/llms.txt'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-1 rounded-lg border border-[#EDE3E2] px-2.5 py-2 font-semibold text-[#43242F] hover:bg-[#FBF8F7]">{label} <ExternalLink className="h-3 w-3 text-gray-400" /></a>
            ))}
          </div>
        </Card>
      </div>

      <CampaignBuilder />
    </div>
  );
}

function CampaignBuilder() {
  const notify = useToast();
  const session = useSession();
  const [page, setPage] = useState('/consultation');
  const [preset, setPreset] = useState(0);
  const [campaign, setCampaign] = useState('');
  const [shortPath, setShortPath] = useState('');
  const [busy, setBusy] = useState(false);
  const chosen = PRESETS[preset];

  const destination = useMemo(() => {
    const params = new URLSearchParams({ utm_source: chosen.source, utm_medium: chosen.medium });
    if (campaign) params.set('utm_campaign', slugify(campaign));
    if (chosen.content) params.set('utm_content', chosen.content);
    return `${page}?${params.toString()}`;
  }, [page, chosen, campaign]);

  const copy = (text: string) => { void navigator.clipboard.writeText(text); notify('Link copied'); };

  const createShortLink = async () => {
    const source = normalizePath(shortPath);
    if (!/^\/[a-z0-9_-]{2,40}$/.test(source)) { notify('Short link: 2–40 lowercase letters, numbers or -, e.g. /insta', 'error'); return; }
    if (isReservedPath(source) || PUBLIC_ROUTES.some((route) => route.path === source)) { notify('That address is already a page. Choose another.', 'error'); return; }
    setBusy(true);
    try {
      const existing = await getDocs(collection(db, 'redirects'));
      if (existing.docs.some((item) => item.data().source === source)) { notify('That short link already exists. Edit it in Redirects.', 'error'); return; }
      await setDoc(doc(db, 'redirects', seoDocId(source)), { source, destination, code: 302, enabled: true, note: `${chosen.label}${campaign ? ` · ${campaign}` : ''}`.slice(0, 200), ...stamp() });
      void logAudit('redirect.create', source, `short link → ${destination}`);
      notify(`Short link ${SITE_ORIGIN.replace('https://', '')}${source} will work within about 2 minutes.`);
      setShortPath('');
    } catch (error) { notify(friendlyError(error), 'error'); } finally { setBusy(false); }
  };

  return (
    <Card className="mt-5 space-y-4 p-4">
      <div>
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400"><Link2 className="h-3.5 w-3.5" /> Campaign link builder</p>
        <p className="mt-1 text-[12px] text-gray-500">Use a tagged link wherever you share the website. Enquiries from it then show their source in Enquiries and in GA4.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field label="Page">
          <select value={page} onChange={(event) => setPage(event.target.value)} className={inputClass}>
            {PUBLIC_ROUTES.map((route) => <option key={route.path} value={route.path}>{route.path === '/' ? 'Home' : route.path}</option>)}
          </select>
        </Field>
        <Field label="Where it will be shared">
          <select value={preset} onChange={(event) => setPreset(Number(event.target.value))} className={inputClass}>
            {PRESETS.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
          </select>
        </Field>
        <Field label="Campaign name (optional)" hint="e.g. wedding season 2026, diwali hampers">
          <input value={campaign} onChange={(event) => setCampaign(event.target.value.slice(0, 60))} className={inputClass} />
        </Field>
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-[#FBF8F7] p-3 sm:flex-row sm:items-center">
        <code className="min-w-0 flex-1 break-all text-[12px] text-[#43242F]">{SITE_ORIGIN}{destination}</code>
        <Button onClick={() => copy(`${SITE_ORIGIN}${destination}`)}><Copy className="h-3.5 w-3.5" /> Copy</Button>
      </div>
      {session.can('redirects') && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Field label="Optional short link" hint="Easier to type and fits a QR code. Creates a temporary redirect you can change later.">
            <div className="flex items-center gap-1"><span className="text-[12px] text-gray-400">cakeasy.in</span><input value={shortPath} onChange={(event) => setShortPath(event.target.value.toLowerCase())} placeholder="/insta" className={`${inputClass} font-mono`} /></div>
          </Field>
          <Button onClick={createShortLink} busy={busy} disabled={!shortPath}>Create short link</Button>
        </div>
      )}
    </Card>
  );
}
