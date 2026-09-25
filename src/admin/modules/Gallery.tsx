import React, { useCallback, useEffect, useRef, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, writeBatch } from 'firebase/firestore';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Plus, Star, Trash2, Upload, X } from 'lucide-react';
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS, LIMITS, cleanGalleryItem, type GalleryCategory, type GalleryImage, type GalleryItem } from '../../../shared/content';
import { BUILT_IN_GALLERY } from '../../lib/content';
import { db, friendlyError, logAudit, stamp } from '../firebase';
import { Badge, Button, Card, EmptyState, Field, Loading, Notice, PageHeader, Toggle, inputClass, useToast } from '../ui';
import MediaPicker from './MediaPicker';
import { uploadImage } from './Media';

const newId = () => `g${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function toRecord(item: GalleryItem) {
  const { id: _id, ...rest } = item;
  return { ...rest, ...stamp() };
}

export async function loadGallery(): Promise<GalleryItem[]> {
  const snapshot = await getDocs(query(collection(db, 'gallery'), orderBy('order')));
  return snapshot.docs.map((item) => cleanGalleryItem(item.id, item.data())).filter((item): item is GalleryItem => Boolean(item));
}

export default function GalleryModule() {
  const notify = useToast();
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try { setItems(await loadGallery()); } catch (err) { setError(friendlyError(err)); setItems([]); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const importArchive = async () => {
    if (!window.confirm(`Copy the ${BUILT_IN_GALLERY.length} posts currently shown on the website into the CMS so you can edit them?`)) return;
    setBusy(true);
    try {
      const batch = writeBatch(db);
      BUILT_IN_GALLERY.forEach((entry, index) => {
        batch.set(doc(db, 'gallery', entry.id), {
          caption: '', category: entry.category, year: entry.year, date: entry.date,
          images: entry.images.map((image) => ({ url: image.url, alt: '' })),
          featured: false, published: true, order: (index + 1) * 10, ...stamp(),
        });
      });
      await batch.commit();
      void logAudit('gallery.import', `${BUILT_IN_GALLERY.length} posts`);
      notify('Archive imported. Add real captions and alt text to each post.');
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); } finally { setBusy(false); }
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!items) return;
    const other = items[index + direction];
    const current = items[index];
    if (!other) return;
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'gallery', current.id), toRecord({ ...current, order: other.order }));
      batch.set(doc(db, 'gallery', other.id), toRecord({ ...other, order: current.order === other.order ? current.order + direction : current.order }));
      await batch.commit();
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); }
  };

  const nextOrder = items && items.length ? Math.max(...items.map((item) => item.order)) + 10 : 10;
  const blank: GalleryItem = { id: newId(), caption: '', category: 'wedding', year: String(new Date().getFullYear()), date: '', images: [], featured: false, published: true, order: nextOrder };

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Gallery"
        description="The Cakeasy archive on /gallery. Posts with several photos open like a catalogue. Featured posts show first. Changes appear on the site within about 2 minutes."
        actions={<Button tone="accent" onClick={() => setEditing({ ...blank, id: newId() })}><Plus className="h-3.5 w-3.5" /> New post</Button>}
      />
      {error && <Notice tone="red">{error}</Notice>}
      {items === null ? <Loading /> : items.length === 0 ? (
        <EmptyState title="The website is showing the built-in archive">
          <p>Import the {BUILT_IN_GALLERY.length} posts that are on the site today, then edit captions, categories and order here.</p>
          <Button tone="primary" className="mt-4" onClick={importArchive} busy={busy}>Import current archive</Button>
        </EmptyState>
      ) : (
        <>
          {items.some((item) => !item.caption) && <div className="mb-4"><Notice tone="amber">{items.filter((item) => !item.caption).length} posts have no caption yet. A short caption (occasion, design, place) helps customers and Google.</Notice></div>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, index) => (
              <Card key={item.id} className="overflow-hidden">
                <button onClick={() => setEditing(item)} className="block w-full text-left">
                  <div className="relative aspect-square bg-[#F3ECE7]">
                    <img src={item.images[0]?.url} alt={item.images[0]?.alt || ''} loading="lazy" className="h-full w-full object-contain" />
                    <span className="absolute left-2 top-2 flex gap-1">
                      {item.featured && <Badge tone="amber">Featured</Badge>}
                      {!item.published && <Badge tone="gray">Hidden</Badge>}
                    </span>
                    {item.images.length > 1 && <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white">{item.images.length}</span>}
                  </div>
                  <div className="px-2.5 pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#B02266]">{GALLERY_CATEGORY_LABELS[item.category]} · {item.year || '—'}</p>
                    <p className={`line-clamp-2 min-h-[32px] text-[12px] ${item.caption ? 'text-gray-600' : 'font-semibold text-amber-600'}`}>{item.caption || 'Needs a caption'}</p>
                  </div>
                </button>
                <div className="flex justify-end gap-1 px-2 pb-2">
                  <button onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-1 text-gray-400 hover:bg-[#FBF8F7] hover:text-[#251B21] disabled:opacity-30" aria-label="Move earlier"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button onClick={() => move(index, 1)} disabled={index === items.length - 1} className="rounded p-1 text-gray-400 hover:bg-[#FBF8F7] hover:text-[#251B21] disabled:opacity-30" aria-label="Move later"><ArrowDown className="h-3.5 w-3.5" /></button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
      {editing && <GalleryEditor item={editing} isNew={!items?.some((item) => item.id === editing.id)} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await refresh(); }} />}
    </div>
  );
}

function GalleryEditor({ item, isNew, onClose, onSaved }: { item: GalleryItem; isNew: boolean; onClose: () => void; onSaved: () => Promise<void> }) {
  const notify = useToast();
  const [form, setForm] = useState<GalleryItem>(item);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const set = <K extends keyof GalleryItem>(key: K, value: GalleryItem[K]) => setForm((current) => ({ ...current, [key]: value }));
  const setImages = (images: GalleryImage[]) => set('images', images.slice(0, LIMITS.images));

  const addFiles = async (files: FileList | null) => {
    for (const file of Array.from(files || [])) {
      if (form.images.length + uploading >= LIMITS.images) { notify(`A post can have up to ${LIMITS.images} photos.`, 'error'); break; }
      setUploading((count) => count + 1);
      try {
        const url = await uploadImage(file, form.caption.slice(0, 200), 'gallery');
        setForm((current) => ({ ...current, images: [...current.images, { url, alt: current.caption.slice(0, 200) }].slice(0, LIMITS.images) }));
      } catch (err) { notify(friendlyError(err), 'error'); } finally { setUploading((count) => count - 1); }
    }
    if (fileInput.current) fileInput.current.value = '';
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const images = [...form.images];
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    setImages(images);
  };

  const save = async () => {
    if (!form.images.length) { notify('Add at least one photo.', 'error'); return; }
    setBusy(true);
    try {
      await setDoc(doc(db, 'gallery', form.id), toRecord({ ...form, caption: form.caption.trim(), year: form.year.trim(), date: form.date.trim(), images: form.images.map((image) => ({ url: image.url, alt: image.alt.trim() })) }));
      void logAudit(isNew ? 'gallery.create' : 'gallery.update', form.id, form.caption.slice(0, 80));
      notify(form.published ? 'Saved. On the website within about 2 minutes.' : 'Saved as hidden.');
      await onSaved();
    } catch (err) { notify(friendlyError(err), 'error'); } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!window.confirm('Remove this post from the gallery? (The photos stay in Media.)')) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, 'gallery', form.id));
      void logAudit('gallery.delete', form.id);
      notify('Post removed');
      await onSaved();
    } catch (err) { notify(friendlyError(err), 'error'); setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#251B21]/30" onClick={onClose}>
      <aside role="dialog" aria-label="Edit gallery post" onClick={(event) => event.stopPropagation()} className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl animate-slideIn">
        <div className="flex items-center justify-between border-b border-[#F3ECEA] px-5 py-4">
          <h2 className="font-serif text-xl font-bold">{isNew ? 'New gallery post' : 'Edit gallery post'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-[#FBF8F7]" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#43242F]">Photos ({form.images.length}/{LIMITS.images})</p>
            <div className="space-y-2">
              {form.images.map((image, index) => (
                <div key={`${image.url}-${index}`} className="flex gap-2 rounded-lg border border-[#EDE3E2] p-2">
                  <img src={image.url} alt="" className="h-16 w-16 shrink-0 rounded-md bg-[#F3ECE7] object-contain" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <input value={image.alt} onChange={(event) => setImages(form.images.map((img, i) => (i === index ? { ...img, alt: event.target.value.slice(0, LIMITS.alt) } : img)))} placeholder="Alt text: what is in this photo?" className={inputClass} />
                    <div className="flex items-center gap-1 text-gray-400">
                      {index === 0 && <Badge tone="pink">Cover</Badge>}
                      <button onClick={() => moveImage(index, -1)} disabled={index === 0} className="rounded p-1 hover:text-[#251B21] disabled:opacity-30" aria-label="Move photo left"><ArrowLeft className="h-3.5 w-3.5" /></button>
                      <button onClick={() => moveImage(index, 1)} disabled={index === form.images.length - 1} className="rounded p-1 hover:text-[#251B21] disabled:opacity-30" aria-label="Move photo right"><ArrowRight className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setImages(form.images.filter((_, i) => i !== index))} className="ml-auto rounded p-1 hover:text-red-600" aria-label="Remove photo"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="sr-only" onChange={(event) => addFiles(event.target.files)} />
              <Button onClick={() => fileInput.current?.click()} busy={uploading > 0}><Upload className="h-3.5 w-3.5" /> {uploading ? `Uploading ${uploading}…` : 'Upload photos'}</Button>
              <MediaPicker onPick={(url) => setImages([...form.images, { url, alt: form.caption.slice(0, 200) }])} />
            </div>
          </div>
          <Field label="Caption" count={form.caption.length} max={LIMITS.caption} hint="Occasion + design + a detail, e.g. “Three-tier ivory engagement cake with sugar roses for a Greater Noida celebration”.">
            <textarea value={form.caption} onChange={(event) => set('caption', event.target.value.slice(0, LIMITS.caption))} rows={3} className={`${inputClass} resize-none`} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Category">
              <select value={form.category} onChange={(event) => set('category', event.target.value as GalleryCategory)} className={inputClass}>
                {GALLERY_CATEGORIES.map((value) => <option key={value} value={value}>{GALLERY_CATEGORY_LABELS[value]}</option>)}
              </select>
            </Field>
            <Field label="Year"><input value={form.year} onChange={(event) => set('year', event.target.value.slice(0, LIMITS.year))} placeholder="2026" className={inputClass} /></Field>
            <Field label="Date (optional)"><input value={form.date} onChange={(event) => set('date', event.target.value.slice(0, LIMITS.date))} placeholder="Mar 05, 2026" className={inputClass} /></Field>
          </div>
          <Toggle label="Featured" hint="Shown first in the gallery." checked={form.featured} onChange={(value) => set('featured', value)} />
          <Toggle label="Show on the website" hint="Turn off to hide the post without deleting it." checked={form.published} onChange={(value) => set('published', value)} />
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-[#F3ECEA] px-5 py-3">
          {!isNew ? <Button tone="danger" onClick={remove} disabled={busy}><Trash2 className="h-3.5 w-3.5" /> Remove</Button> : <span />}
          <div className="flex items-center gap-2">
            {form.featured && <Star className="h-4 w-4 text-amber-500" />}
            <Button tone="primary" onClick={save} busy={busy} disabled={uploading > 0}>Save post</Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
