import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react';
import { DEFAULT_OG_IMAGE, PUBLIC_ROUTES, SITE_ORIGIN, absoluteUrl, seoDocId, type SeoRecord } from '../../../shared/site';
import { parseJsonLd } from '../../../shared/head';
import { db, friendlyError, logAudit, stamp } from '../firebase';
import { Badge, Button, Card, Field, Loading, Notice, PageHeader, Toggle, inputClass, useToast } from '../ui';
import MediaPicker from './MediaPicker';

type Stored = SeoRecord & { updatedBy?: string };

const EMPTY: Omit<SeoRecord, 'path'> = { title: '', description: '', canonical: '', ogTitle: '', ogDescription: '', ogImage: '', index: true, follow: true, jsonLd: '' };
const FIELDS: (keyof SeoRecord)[] = ['path', 'title', 'description', 'canonical', 'ogTitle', 'ogDescription', 'ogImage', 'index', 'follow', 'jsonLd'];

function pick(record: Partial<Stored>): Stored {
  const out = { ...EMPTY, path: record.path || '/' } as Stored;
  for (const key of FIELDS) if (record[key] !== undefined) (out as unknown as Record<string, unknown>)[key] = record[key];
  if (record.updatedBy) out.updatedBy = record.updatedBy;
  return out;
}

function same(a?: SeoRecord, b?: SeoRecord) {
  return Boolean(a && b) && FIELDS.every((key) => a![key] === b![key]);
}

export function seoHealth(title: string, description: string): { tone: 'green' | 'amber'; issues: string[] } {
  const issues: string[] = [];
  if (title.length > 60) issues.push('Title may be cut off in Google (over 60 characters).');
  if (title.length < 20) issues.push('Title is very short.');
  if (!description) issues.push('No meta description.');
  else if (description.length > 160) issues.push('Description may be cut off (over 160 characters).');
  else if (description.length < 70) issues.push('Description is short; aim for 120–160 characters.');
  return { tone: issues.length ? 'amber' : 'green', issues };
}

export default function SeoManager() {
  const [live, setLive] = useState<Record<string, SeoRecord> | null>(null);
  const [drafts, setDrafts] = useState<Record<string, SeoRecord>>({});
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [liveSnap, draftSnap] = await Promise.all([getDocs(collection(db, 'seo')), getDocs(collection(db, 'seo_drafts'))]);
      const liveMap: Record<string, SeoRecord> = {};
      const draftMap: Record<string, SeoRecord> = {};
      liveSnap.forEach((item) => { const data = pick(item.data() as Stored); liveMap[data.path] = data; });
      draftSnap.forEach((item) => { const data = pick(item.data() as Stored); draftMap[data.path] = data; });
      setLive(liveMap);
      setDrafts(draftMap);
    } catch (err) {
      setError(friendlyError(err));
      setLive({});
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const rows = useMemo(() => PUBLIC_ROUTES.map((route) => {
    const liveRecord = live?.[route.path];
    const draft = drafts[route.path];
    const effectiveTitle = liveRecord?.title || route.title;
    const effectiveDescription = liveRecord?.description || route.description;
    const indexed = liveRecord?.index ?? route.index;
    let state: { label: string; tone: 'gray' | 'green' | 'amber' | 'pink' } = { label: 'Default', tone: 'gray' };
    if (liveRecord && draft && !same(liveRecord, draft)) state = { label: 'Unpublished changes', tone: 'amber' };
    else if (liveRecord) state = { label: 'Custom · live', tone: 'green' };
    else if (draft) state = { label: 'Draft', tone: 'pink' };
    return { route, effectiveTitle, effectiveDescription, indexed, state, health: seoHealth(effectiveTitle, effectiveDescription) };
  }), [live, drafts]);

  const titleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rows.forEach((row) => { counts[row.effectiveTitle] = (counts[row.effectiveTitle] || 0) + 1; });
    return counts;
  }, [rows]);

  if (editing) {
    const route = PUBLIC_ROUTES.find((item) => item.path === editing)!;
    return (
      <SeoEditor
        route={route}
        live={live?.[editing]}
        draft={drafts[editing]}
        onBack={() => setEditing(null)}
        onChanged={refresh}
      />
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Search & social"
        title="SEO"
        description="The title and description Google shows, the preview WhatsApp, Instagram and Facebook show when a link is shared, and whether a page should appear in search. Pages use sensible defaults until you customise them."
        actions={<>
          <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#E7DEDC] bg-white px-3 py-2 text-[12px] font-semibold text-[#43242F] hover:bg-[#FBF8F7]">Sitemap <ExternalLink className="h-3.5 w-3.5" /></a>
        </>}
      />
      {error && <Notice tone="red">{error}</Notice>}
      {live === null ? <Loading /> : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-[#F3ECEA]">
            {rows.map(({ route, effectiveTitle, effectiveDescription, indexed, state, health }) => (
              <li key={route.path}>
                <button onClick={() => setEditing(route.path)} className="flex w-full flex-col gap-1.5 px-4 py-3 text-left hover:bg-[#FBF8F7] sm:flex-row sm:items-center sm:gap-4">
                  <span className="w-44 shrink-0 font-mono text-[12px] text-gray-500">{route.path}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-[#251B21]">{effectiveTitle}</span>
                    <span className="block truncate text-[12px] text-gray-500">{effectiveDescription}</span>
                  </span>
                  <span className="flex shrink-0 flex-wrap gap-1.5">
                    {!indexed && <Badge tone="gray">Hidden from search</Badge>}
                    {titleCounts[effectiveTitle] > 1 && <Badge tone="amber">Duplicate title</Badge>}
                    <Badge tone={health.tone}>{health.issues.length ? `${health.issues.length} tip${health.issues.length > 1 ? 's' : ''}` : 'Healthy'}</Badge>
                    <Badge tone={state.tone}>{state.label}</Badge>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function SeoEditor({ route, live, draft, onBack, onChanged }: {
  route: (typeof PUBLIC_ROUTES)[number];
  live?: SeoRecord;
  draft?: SeoRecord;
  onBack: () => void;
  onChanged: () => Promise<void>;
}) {
  const notify = useToast();
  const initial = draft || live || { ...EMPTY, path: route.path };
  const [form, setForm] = useState<SeoRecord>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const set = <K extends keyof SeoRecord>(key: K, value: SeoRecord[K]) => setForm((current) => ({ ...current, [key]: value }));

  const title = form.title || route.title;
  const description = form.description || route.description;
  const health = seoHealth(title, description);
  const jsonLdError = form.jsonLd.trim() && parseJsonLd(form.jsonLd).length === 0 ? 'Not valid JSON-LD. It needs to be a JSON object (or list) with "@type".' : '';
  const canonicalError = form.canonical && !(form.canonical.startsWith('/') || form.canonical.startsWith(SITE_ORIGIN)) ? `Use a path like /weddings or a full ${SITE_ORIGIN} address.` : '';
  const invalid = Boolean(jsonLdError || canonicalError);
  const id = seoDocId(route.path);
  const changedFromLive = !same(form, live);

  const run = async (label: string, action: () => Promise<void>, message: string) => {
    setBusy(label);
    try {
      await action();
      await onChanged();
      notify(message);
    } catch (error) {
      notify(friendlyError(error), 'error');
    } finally {
      setBusy(null);
    }
  };

  const clean = (): SeoRecord => ({ ...form, path: route.path, title: form.title.trim(), description: form.description.trim(), canonical: form.canonical.trim(), ogTitle: form.ogTitle.trim(), ogDescription: form.ogDescription.trim(), ogImage: form.ogImage.trim(), jsonLd: form.jsonLd.trim() });

  const saveDraft = () => run('draft', async () => {
    await setDoc(doc(db, 'seo_drafts', id), { ...clean(), ...stamp() });
    void logAudit('seo.draft', route.path);
  }, 'Draft saved. It is not live until you publish.');

  const publish = () => run('publish', async () => {
    await setDoc(doc(db, 'seo', id), { ...clean(), ...stamp(), publishedAt: serverTimestamp() });
    await deleteDoc(doc(db, 'seo_drafts', id)).catch(() => undefined);
    void logAudit('seo.publish', route.path, `title: ${clean().title || '(default)'}`);
  }, 'Published. Google and social previews use it within about 2 minutes.');

  const discardDraft = () => run('discard', async () => {
    await deleteDoc(doc(db, 'seo_drafts', id));
    setForm(live || { ...EMPTY, path: route.path });
  }, 'Draft discarded');

  const resetToDefault = () => {
    if (!window.confirm(`Remove the custom SEO for ${route.path} and go back to the built-in defaults?`)) return;
    void run('reset', async () => {
      await Promise.all([deleteDoc(doc(db, 'seo', id)), deleteDoc(doc(db, 'seo_drafts', id)).catch(() => undefined)]);
      setForm({ ...EMPTY, path: route.path });
      void logAudit('seo.reset', route.path);
    }, 'Back to the default SEO');
  };

  const ogImage = absoluteUrl(form.ogImage || DEFAULT_OG_IMAGE);

  return (
    <div>
      <button onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-[12px] font-semibold text-gray-500 hover:text-[#251B21]"><ArrowLeft className="h-3.5 w-3.5" /> All pages</button>
      <PageHeader
        eyebrow={route.path}
        title="Edit page SEO"
        description="Leave a field empty to use the default shown in grey. Save draft keeps changes private; Publish makes them live."
        actions={<a href={route.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#E7DEDC] bg-white px-3 py-2 text-[12px] font-semibold text-[#43242F] hover:bg-[#FBF8F7]">Open page <ExternalLink className="h-3.5 w-3.5" /></a>}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card className="space-y-4 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Google search result</p>
            <Field label="SEO title" count={title.length} max={60} hint="Shown as the blue link in Google and in the browser tab. Put the most important words first.">
              <input value={form.title} onChange={(event) => set('title', event.target.value.slice(0, 120))} placeholder={route.title} className={inputClass} />
            </Field>
            <Field label="Meta description" count={description.length} max={160} hint="The grey summary under the link. Describe what the page really offers; it helps people choose to click.">
              <textarea value={form.description} onChange={(event) => set('description', event.target.value.slice(0, 320))} placeholder={route.description} rows={3} className={`${inputClass} resize-none`} />
            </Field>
            {health.issues.length > 0 && <Notice tone="amber"><ul className="list-disc space-y-0.5 pl-4">{health.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></Notice>}
          </Card>

          <Card className="space-y-4 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Link preview on WhatsApp, Instagram & Facebook</p>
            <Field label="Share title" hint="Optional. Falls back to the SEO title.">
              <input value={form.ogTitle} onChange={(event) => set('ogTitle', event.target.value.slice(0, 120))} placeholder={title} className={inputClass} />
            </Field>
            <Field label="Share description" hint="Optional. Falls back to the meta description.">
              <textarea value={form.ogDescription} onChange={(event) => set('ogDescription', event.target.value.slice(0, 320))} placeholder={description} rows={2} className={`${inputClass} resize-none`} />
            </Field>
            <Field label="Share image" hint="A landscape photo works best (1200 × 630). Pick from the media library or use a site path such as /gallery/9/img1.jpg.">
              <div className="flex gap-2">
                <input value={form.ogImage} onChange={(event) => set('ogImage', event.target.value.slice(0, 500))} placeholder={DEFAULT_OG_IMAGE} className={inputClass} />
                <MediaPicker onPick={(url) => set('ogImage', url)} />
              </div>
            </Field>
          </Card>

          <Card className="space-y-3 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Search visibility</p>
            <Toggle label="Show this page in search results" hint="Turn off only for pages you do not want people to find on Google." checked={form.index} onChange={(value) => set('index', value)} />
            <Toggle label="Let search engines follow links on this page" hint="Leave on unless an SEO specialist advises otherwise." checked={form.follow} onChange={(value) => set('follow', value)} />
            <Field label="Canonical URL" hint="Advanced. Leave empty; the page's own address is used.">
              <input value={form.canonical} onChange={(event) => set('canonical', event.target.value.slice(0, 300))} placeholder={absoluteUrl(route.path)} className={inputClass} />
            </Field>
            {canonicalError && <p className="text-[12px] text-red-600">{canonicalError}</p>}
            <Field label="Extra structured data (JSON-LD)" hint="Advanced. Only describe things visible on the page. Never add ratings, reviews or prices that are not real. The bakery details are added automatically.">
              <textarea value={form.jsonLd} onChange={(event) => set('jsonLd', event.target.value.slice(0, 20000))} rows={4} spellCheck={false} placeholder='{"@context":"https://schema.org","@type":"FAQPage", ...}' className={`${inputClass} resize-y font-mono text-[12px]`} />
            </Field>
            {jsonLdError && <p className="text-[12px] text-red-600">{jsonLdError}</p>}
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Google preview</p>
            <div className="flex items-center gap-2 text-[12px] text-gray-600"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF0F6]"><Globe className="h-3.5 w-3.5 text-[#D63384]" /></span><span><span className="block leading-tight text-[#202124]">Cakeasy</span><span className="block leading-tight">{absoluteUrl(route.path).replace('https://', '')}</span></span></div>
            <p className="mt-1.5 line-clamp-2 text-[17px] leading-6 text-[#1a0dab]">{title}</p>
            <p className="line-clamp-2 text-[13px] leading-5 text-[#4d5156]">{description}</p>
            {!form.index && <p className="mt-2 text-[11px] font-semibold text-amber-700">Hidden from search results.</p>}
          </Card>

          <Card className="overflow-hidden">
            <div className="aspect-[1.91/1] bg-[#F3ECE7]"><img src={ogImage} alt="" className="h-full w-full object-cover" /></div>
            <div className="bg-[#F0F2F5] px-3 py-2">
              <p className="text-[11px] uppercase text-gray-500">cakeasy.in</p>
              <p className="line-clamp-1 text-[14px] font-semibold text-[#050505]">{form.ogTitle || title}</p>
              <p className="line-clamp-1 text-[12px] text-gray-600">{form.ogDescription || description}</p>
            </div>
          </Card>

          <Card className="space-y-2 p-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={saveDraft} busy={busy === 'draft'} disabled={invalid || Boolean(busy)}>Save draft</Button>
              <Button tone="accent" onClick={publish} busy={busy === 'publish'} disabled={invalid || Boolean(busy) || (!changedFromLive && Boolean(live))}>Publish</Button>
            </div>
            <div className="flex flex-wrap gap-3 pt-1 text-[12px]">
              {draft && <button onClick={discardDraft} disabled={Boolean(busy)} className="font-semibold text-gray-500 hover:text-[#251B21]">Discard draft</button>}
              {(live || draft) && <button onClick={resetToDefault} disabled={Boolean(busy)} className="font-semibold text-red-600 hover:text-red-700">Reset to default</button>}
            </div>
            <p className="text-[11px] leading-4 text-gray-400">{live ? `Live version by ${(live as Stored).updatedBy || 'the team'}.` : 'Using built-in defaults.'} {draft ? 'You have an unpublished draft.' : ''}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
