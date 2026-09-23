import React, { useCallback, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { findRoute, isReservedPath, normalizePath, seoDocId } from '../../../shared/site';
import { db, friendlyError, logAudit, stamp } from '../firebase';
import { Badge, Button, Card, EmptyState, Field, Loading, Notice, PageHeader, Toggle, inputClass, useToast } from '../ui';

interface RedirectRecord { id: string; source: string; destination: string; code: 301 | 302 | 307 | 308; enabled: boolean; note?: string; updatedBy?: string }

const blank: Omit<RedirectRecord, 'id'> = { source: '', destination: '', code: 301, enabled: true, note: '' };

export function validateRedirect(form: Omit<RedirectRecord, 'id'>, all: RedirectRecord[], editingId: string | null): string {
  const source = normalizePath(form.source);
  const destination = form.destination.trim();
  if (!form.source.trim().startsWith('/')) return 'The old address must start with / (for example /old-offer).';
  if (!/^\/[a-z0-9/_-]{1,199}$/.test(source)) return 'The old address can only use lowercase letters, numbers, - and /.';
  if (!destination.startsWith('/') || destination.startsWith('//')) return 'The new address must be a page on this website, starting with /.';
  if (!/^\/[A-Za-z0-9/_\-?=&#.%]{0,299}$/.test(destination)) return 'The new address contains characters that are not allowed.';
  if (source === '/' || isReservedPath(source)) return 'That address is protected and cannot be redirected.';
  if (normalizePath(destination) === source) return 'A page cannot redirect to itself.';
  const others = all.filter((item) => item.id !== editingId && item.enabled);
  if (others.some((item) => normalizePath(item.source) === source)) return 'There is already a redirect from this address.';
  if (form.enabled && others.some((item) => normalizePath(item.source) === normalizePath(destination))) return 'The new address is itself redirected. Point straight to the final page instead.';
  if (form.enabled && others.some((item) => normalizePath(item.destination) === source)) return 'Another redirect points to this address, which would create a chain. Update that one to the final page instead.';
  return '';
}

export default function Redirects() {
  const notify = useToast();
  const [items, setItems] = useState<RedirectRecord[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<RedirectRecord | 'new' | null>(null);

  const refresh = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'redirects'));
      setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as RedirectRecord)).sort((a, b) => a.source.localeCompare(b.source)));
    } catch (err) { setError(friendlyError(err)); setItems([]); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const remove = async (item: RedirectRecord) => {
    if (!window.confirm(`Delete the redirect from ${item.source}? Visitors to that address will see “page not found”.`)) return;
    try {
      await deleteDoc(doc(db, 'redirects', item.id));
      void logAudit('redirect.delete', item.source);
      notify('Redirect deleted');
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Links"
        title="Redirects"
        description="Send an old or campaign address to the right page, so shared links, printed QR codes and Google results keep working. Campaign tags (utm_…) are carried over automatically."
        actions={<Button tone="accent" onClick={() => setEditing('new')}><Plus className="h-3.5 w-3.5" /> New redirect</Button>}
      />
      {error && <Notice tone="red">{error}</Notice>}
      {editing && (
        <RedirectForm
          record={editing === 'new' ? null : editing}
          all={items || []}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await refresh(); }}
        />
      )}
      {items === null ? <Loading /> : items.length === 0 ? (
        <EmptyState title="No redirects yet">Example: send <span className="font-mono">/insta</span> to <span className="font-mono">/consultation?utm_source=instagram&amp;utm_medium=bio</span> for a short link in your Instagram bio.</EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-[#F3ECEA]">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
                <button onClick={() => setEditing(item)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <span className="truncate font-mono text-[12px] font-semibold">{item.source}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="truncate font-mono text-[12px] text-gray-600">{item.destination}</span>
                </button>
                <span className="flex items-center gap-2">
                  {item.note && <span className="hidden max-w-[180px] truncate text-[12px] text-gray-400 md:inline">{item.note}</span>}
                  <Badge tone="gray">{item.code === 301 || item.code === 308 ? 'Permanent' : 'Temporary'}</Badge>
                  <Badge tone={item.enabled ? 'green' : 'gray'}>{item.enabled ? 'On' : 'Off'}</Badge>
                  <button onClick={() => remove(item)} className="rounded p-1 text-gray-400 hover:text-red-600" aria-label={`Delete redirect from ${item.source}`}><Trash2 className="h-4 w-4" /></button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function RedirectForm({ record, all, onClose, onSaved }: { record: RedirectRecord | null; all: RedirectRecord[]; onClose: () => void; onSaved: () => Promise<void> }) {
  const notify = useToast();
  const [form, setForm] = useState<Omit<RedirectRecord, 'id'>>(record ? { source: record.source, destination: record.destination, code: record.code, enabled: record.enabled, note: record.note || '' } : blank);
  const [busy, setBusy] = useState(false);
  const problem = form.source || form.destination ? validateRedirect(form, all, record?.id || null) : '';
  const shadowsPage = form.source && findRoute(form.source);

  const save = async () => {
    const message = validateRedirect(form, all, record?.id || null);
    if (message) { notify(message, 'error'); return; }
    setBusy(true);
    try {
      const source = normalizePath(form.source);
      const id = record?.id || seoDocId(source);
      await setDoc(doc(db, 'redirects', id), { source, destination: form.destination.trim(), code: form.code, enabled: form.enabled, note: (form.note || '').trim(), ...stamp() });
      void logAudit(record ? 'redirect.update' : 'redirect.create', source, `→ ${form.destination.trim()}`);
      notify('Redirect saved. It works within about 2 minutes.');
      await onSaved();
    } catch (err) { notify(friendlyError(err), 'error'); } finally { setBusy(false); }
  };

  return (
    <Card className="mb-4 space-y-3 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Old address" hint="Only the part after cakeasy.in, e.g. /wedding-offer">
          <input value={form.source} disabled={Boolean(record)} onChange={(event) => setForm({ ...form, source: event.target.value.toLowerCase().slice(0, 200) })} placeholder="/old-page" className={`${inputClass} font-mono`} />
        </Field>
        <Field label="Send visitors to" hint="A page on this website, e.g. /weddings">
          <input value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value.slice(0, 300) })} placeholder="/weddings" className={`${inputClass} font-mono`} />
        </Field>
        <Field label="Type">
          <select value={form.code} onChange={(event) => setForm({ ...form, code: Number(event.target.value) as RedirectRecord['code'] })} className={inputClass}>
            <option value={301}>Permanent (301): the page moved for good</option>
            <option value={302}>Temporary (302): a short campaign or seasonal link</option>
          </select>
        </Field>
        <Field label="Note (optional)" hint="Why this exists, e.g. “Diwali 2026 print flyer QR”.">
          <input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value.slice(0, 200) })} className={inputClass} />
        </Field>
      </div>
      <Toggle label="Redirect is on" checked={form.enabled} onChange={(value) => setForm({ ...form, enabled: value })} />
      {shadowsPage && !problem && <Notice tone="amber">{normalizePath(form.source)} is a live page. Turning this on sends its visitors elsewhere, and it will drop out of the sitemap.</Notice>}
      {problem && <Notice tone="red">{problem}</Notice>}
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button tone="primary" onClick={save} busy={busy} disabled={Boolean(problem) || !form.source || !form.destination}>Save redirect</Button>
      </div>
    </Card>
  );
}
