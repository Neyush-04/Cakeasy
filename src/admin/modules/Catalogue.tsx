import React, { useCallback, useEffect, useRef, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, writeBatch } from 'firebase/firestore';
import { ArrowDown, ArrowUp, Plus, Trash2, Upload, X } from 'lucide-react';
import { CATALOGUE_CATEGORIES, CATALOGUE_CATEGORY_LABELS, LIMITS, cleanCatalogueItem, type CatalogueCategory, type CatalogueItem } from '../../../shared/content';
import { ALL_PRODUCTS } from '../../data';
import { db, friendlyError, logAudit, stamp } from '../firebase';
import { Badge, Button, Card, EmptyState, Field, Loading, Notice, PageHeader, Toggle, inputClass, useToast } from '../ui';
import MediaPicker from './MediaPicker';
import { uploadImage } from './Media';

const newId = () => `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function toRecord(item: CatalogueItem) {
  const { id: _id, ...rest } = item;
  return { ...rest, ...stamp() };
}

export default function CatalogueModule() {
  const notify = useToast();
  const [items, setItems] = useState<CatalogueItem[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<CatalogueItem | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'catalogue'), orderBy('order')));
      setItems(snapshot.docs.map((item) => cleanCatalogueItem(item.id, item.data())).filter((item): item is CatalogueItem => Boolean(item)));
    } catch (err) { setError(friendlyError(err)); setItems([]); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const importCurrent = async () => {
    if (!window.confirm(`Copy the ${ALL_PRODUCTS.length} cakes currently on /catalog into the CMS? Check each price afterwards.`)) return;
    setBusy(true);
    try {
      const batch = writeBatch(db);
      ALL_PRODUCTS.forEach((product, index) => {
        batch.set(doc(db, 'catalogue', product.id), {
          name: product.name, description: product.description, priceRange: product.priceRange, category: product.category,
          image: product.image, popularFlavors: product.popularFlavors, published: true, order: (index + 1) * 10, ...stamp(),
        });
      });
      await batch.commit();
      void logAudit('catalogue.import', `${ALL_PRODUCTS.length} items`);
      notify('Catalogue imported. Please check names, descriptions and prices.');
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); } finally { setBusy(false); }
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!items) return;
    const current = items[index];
    const other = items[index + direction];
    if (!other) return;
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'catalogue', current.id), toRecord({ ...current, order: other.order }));
      batch.set(doc(db, 'catalogue', other.id), toRecord({ ...other, order: current.order === other.order ? current.order + direction : current.order }));
      await batch.commit();
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); }
  };

  const nextOrder = items && items.length ? Math.max(...items.map((item) => item.order)) + 10 : 10;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Catalogue"
        description="The cakes on /catalog. Prices show as written, so use a range or “On request” rather than a figure Neha hasn't confirmed."
        actions={<Button tone="accent" onClick={() => setEditing({ id: newId(), name: '', description: '', priceRange: '', category: 'celebration', image: '', popularFlavors: [], published: true, order: nextOrder })}><Plus className="h-3.5 w-3.5" /> New cake</Button>}
      />
      {error && <Notice tone="red">{error}</Notice>}
      {items === null ? <Loading /> : items.length === 0 ? (
        <EmptyState title="The website is showing the built-in catalogue">
          <p>Import the {ALL_PRODUCTS.length} cakes that are on /catalog today, then edit them here.</p>
          <Button tone="primary" className="mt-4" onClick={importCurrent} busy={busy}>Import current catalogue</Button>
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-[#F3ECEA]">
            {items.map((item, index) => (
              <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
                <button onClick={() => setEditing(item)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-lg bg-[#F3ECE7] object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold">{item.name}</span>
                    <span className="block truncate text-[12px] text-gray-500">{CATALOGUE_CATEGORY_LABELS[item.category]} · {item.priceRange || 'No price shown'}</span>
                  </span>
                </button>
                {!item.published && <Badge tone="gray">Hidden</Badge>}
                <button onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-1 text-gray-400 hover:text-[#251B21] disabled:opacity-30" aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(index, 1)} disabled={index === items.length - 1} className="rounded p-1 text-gray-400 hover:text-[#251B21] disabled:opacity-30" aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {editing && <CatalogueEditor item={editing} isNew={!items?.some((item) => item.id === editing.id)} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await refresh(); }} />}
    </div>
  );
}

function CatalogueEditor({ item, isNew, onClose, onSaved }: { item: CatalogueItem; isNew: boolean; onClose: () => void; onSaved: () => Promise<void> }) {
  const notify = useToast();
  const [form, setForm] = useState<CatalogueItem>(item);
  const [flavours, setFlavours] = useState(item.popularFlavors.join(', '));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const set = <K extends keyof CatalogueItem>(key: K, value: CatalogueItem[K]) => setForm((current) => ({ ...current, [key]: value }));

  const upload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try { set('image', await uploadImage(file, form.name, 'catalogue')); } catch (err) { notify(friendlyError(err), 'error'); } finally { setUploading(false); }
    if (fileInput.current) fileInput.current.value = '';
  };

  const save = async () => {
    if (!form.name.trim()) { notify('Add a name.', 'error'); return; }
    if (!form.image) { notify('Add a photo.', 'error'); return; }
    setBusy(true);
    try {
      const popularFlavors = flavours.split(',').map((flavour) => flavour.trim().slice(0, LIMITS.flavor)).filter(Boolean).slice(0, LIMITS.flavors);
      await setDoc(doc(db, 'catalogue', form.id), toRecord({ ...form, name: form.name.trim(), description: form.description.trim(), priceRange: form.priceRange.trim(), popularFlavors }));
      void logAudit(isNew ? 'catalogue.create' : 'catalogue.update', form.name);
      notify('Saved. On the website within about 2 minutes.');
      await onSaved();
    } catch (err) { notify(friendlyError(err), 'error'); } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!window.confirm(`Remove “${form.name}” from the catalogue?`)) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, 'catalogue', form.id));
      void logAudit('catalogue.delete', form.name);
      notify('Removed');
      await onSaved();
    } catch (err) { notify(friendlyError(err), 'error'); setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#251B21]/30" onClick={onClose}>
      <aside role="dialog" aria-label="Edit cake" onClick={(event) => event.stopPropagation()} className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-slideIn">
        <div className="flex items-center justify-between border-b border-[#F3ECEA] px-5 py-4">
          <h2 className="font-serif text-xl font-bold">{isNew ? 'New cake' : 'Edit cake'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-[#FBF8F7]" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F3ECE7]">{form.image && <img src={form.image} alt="" className="h-full w-full object-cover" />}</div>
            <div className="flex flex-wrap gap-2">
              <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => upload(event.target.files)} />
              <Button onClick={() => fileInput.current?.click()} busy={uploading}><Upload className="h-3.5 w-3.5" /> Upload photo</Button>
              <MediaPicker onPick={(url) => set('image', url)} />
            </div>
          </div>
          <Field label="Name" count={form.name.length} max={LIMITS.name}><input value={form.name} onChange={(event) => set('name', event.target.value.slice(0, LIMITS.name))} className={inputClass} /></Field>
          <Field label="Description" count={form.description.length} max={LIMITS.description}>
            <textarea value={form.description} onChange={(event) => set('description', event.target.value.slice(0, LIMITS.description))} rows={4} className={`${inputClass} resize-none`} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price shown" hint="e.g. “From ₹1,499” or “On request”. Leave empty to hide.">
              <input value={form.priceRange} onChange={(event) => set('priceRange', event.target.value.slice(0, LIMITS.priceRange))} className={inputClass} />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(event) => set('category', event.target.value as CatalogueCategory)} className={inputClass}>
                {CATALOGUE_CATEGORIES.map((value) => <option key={value} value={value}>{CATALOGUE_CATEGORY_LABELS[value]}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Popular flavours" hint="Separate with commas.">
            <input value={flavours} onChange={(event) => setFlavours(event.target.value)} className={inputClass} />
          </Field>
          <Toggle label="Show on the website" checked={form.published} onChange={(value) => set('published', value)} />
        </div>
        <div className="flex items-center justify-between border-t border-[#F3ECEA] px-5 py-3">
          {!isNew ? <Button tone="danger" onClick={remove} disabled={busy}><Trash2 className="h-3.5 w-3.5" /> Remove</Button> : <span />}
          <Button tone="primary" onClick={save} busy={busy} disabled={uploading}>Save cake</Button>
        </div>
      </aside>
    </div>
  );
}
