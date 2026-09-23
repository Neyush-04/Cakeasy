import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from '../../../shared/site';
import { db, friendlyError, logAudit, stamp } from '../firebase';
import { Button, Card, Field, Loading, Notice, PageHeader, inputClass, useToast } from '../ui';

const URL_FIELDS: (keyof SiteSettings)[] = ['instagramUrl', 'facebookUrl', 'youtubeUrl', 'pinterestUrl', 'googleBusinessUrl'];

export function validateSiteSettings(form: SiteSettings): string {
  if (!/^\d{10,15}$/.test(form.whatsappNumber)) return 'WhatsApp number: digits only with country code, e.g. 918810795004.';
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) return 'Email address does not look right.';
  for (const key of URL_FIELDS) {
    const value = form[key];
    if (value && !/^https:\/\/[^\s]+$/.test(value)) return 'Social and Google links must start with https://';
  }
  return '';
}

export default function SiteSettingsModule() {
  const notify = useToast();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState<SiteSettings | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'site')).then((snapshot) => {
      const data = { ...DEFAULT_SITE_SETTINGS };
      const stored = snapshot.data() || {};
      for (const key of Object.keys(data) as (keyof SiteSettings)[]) if (typeof stored[key] === 'string') data[key] = stored[key];
      setForm(data);
      setSaved(data);
    }).catch((error) => { notify(friendlyError(error), 'error'); setForm({ ...DEFAULT_SITE_SETTINGS }); });
  }, [notify]);

  if (!form) return <Loading />;
  const set = (key: keyof SiteSettings, value: string) => setForm({ ...form, [key]: value });
  const problem = validateSiteSettings(form);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const save = async () => {
    setBusy(true);
    try {
      const clean = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])) as unknown as SiteSettings;
      await setDoc(doc(db, 'settings', 'site'), { ...clean, ...stamp() });
      setSaved(clean);
      void logAudit('settings.site', 'settings/site');
      notify('Saved. The website shows the new details within about 2 minutes.');
    } catch (error) { notify(friendlyError(error), 'error'); } finally { setBusy(false); }
  };

  const text = (key: keyof SiteSettings, label: string, hint?: string, placeholder?: string) => (
    <Field label={label} hint={hint}>
      <input value={form[key]} onChange={(event) => set(key, event.target.value)} placeholder={placeholder} className={inputClass} />
    </Field>
  );

  return (
    <div>
      <PageHeader
        eyebrow="Business details"
        title="Studio settings"
        description="Contact details used across the website, WhatsApp buttons, the footer, Google's business information and llms.txt. Keep them identical to your Google Business Profile."
        actions={<Button tone="primary" onClick={save} busy={busy} disabled={!dirty || Boolean(problem)}>Save changes</Button>}
      />
      {problem && <div className="mb-4"><Notice tone="red">{problem}</Notice></div>}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="space-y-3 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Orders & contact</p>
          {text('whatsappNumber', 'WhatsApp number', 'Digits only, with country code. Every WhatsApp button uses this.', '918810795004')}
          {text('phoneDisplay', 'Phone as shown on the site', undefined, '+91 88107 95004')}
          {text('email', 'Email')}
        </Card>
        <Card className="space-y-3 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Studio address</p>
          {text('address', 'Address as shown on the site')}
          <div className="grid grid-cols-2 gap-3">
            {text('addressStreet', 'Street')}
            {text('addressLocality', 'City / area')}
            {text('addressRegion', 'State')}
            {text('postalCode', 'PIN code')}
          </div>
          <p className="text-[11px] text-gray-400">The structured fields tell Google exactly where the studio is. They must match your Google Business Profile.</p>
        </Card>
        <Card className="space-y-3 p-4 lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Social profiles</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {text('instagramUrl', 'Instagram link')}
            {text('instagramHandle', 'Instagram handle', undefined, '@cakeasy99')}
            {text('facebookUrl', 'Facebook page link', 'Leave empty to hide the icon.')}
            {text('youtubeUrl', 'YouTube channel link', 'Leave empty to hide the icon.')}
            {text('pinterestUrl', 'Pinterest link')}
            {text('googleBusinessUrl', 'Google Business Profile link', 'From Google Maps → your listing → Share. Helps Google connect the site and the listing.')}
          </div>
        </Card>
      </div>
    </div>
  );
}
