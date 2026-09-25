import React, { useCallback, useEffect, useRef, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc, type Timestamp } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Copy, Trash2, Upload } from 'lucide-react';
import { db, friendlyError, logAudit, stamp, storage } from '../firebase';
import { Button, Card, EmptyState, Field, Loading, Notice, PageHeader, inputClass, useToast } from '../ui';

export interface MediaItem {
  id: string;
  url: string;
  storagePath: string;
  name: string;
  contentType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  category?: string;
  updatedAt?: Timestamp;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 15 * 1024 * 1024;

export async function loadMedia(): Promise<MediaItem[]> {
  const snapshot = await getDocs(query(collection(db, 'media'), orderBy('updatedAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as MediaItem));
}

function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { resolve({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(url); };
    image.onerror = () => { resolve({ width: 0, height: 0 }); URL.revokeObjectURL(url); };
    image.src = url;
  });
}

export function checkImageFile(file: File): string {
  if (!ACCEPTED.includes(file.type)) return `${file.name}: use JPEG, PNG, WebP or AVIF.`;
  if (file.size > MAX_BYTES) return `${file.name}: larger than 15 MB.`;
  return '';
}

// Uploads one image to Storage and records it in the Media library. Returns its public URL.
export async function uploadImage(file: File, alt = '', category = ''): Promise<string> {
  const problem = checkImageFile(file);
  if (problem) throw new Error(problem);
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/-+/g, '-').slice(-80);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const storagePath = `media/${id}-${safeName}`;
  const dims = await readDimensions(file);
  await uploadBytes(ref(storage, storagePath), file, { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' });
  const url = await getDownloadURL(ref(storage, storagePath));
  await setDoc(doc(db, 'media', id), { url, storagePath, name: file.name.slice(0, 200), contentType: file.type, size: file.size, width: dims.width, height: dims.height, alt: alt.slice(0, 200), caption: '', category: category.slice(0, 60), ...stamp() });
  void logAudit('media.upload', file.name);
  return url;
}

export default function MediaLibrary() {
  const notify = useToast();
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(0);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try { setItems(await loadMedia()); } catch (err) { setError(friendlyError(err)); setItems([]); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const upload = async (files: FileList | null) => {
    const list = Array.from(files || []);
    for (const file of list) {
      const problem = checkImageFile(file);
      if (problem) { notify(problem, 'error'); continue; }
      setUploading((count) => count + 1);
      try {
        await uploadImage(file);
        notify(`${file.name} uploaded. Add alt text so Google and screen readers understand it.`);
      } catch (err) {
        notify(`${file.name}: ${friendlyError(err)}`, 'error');
      } finally {
        setUploading((count) => count - 1);
      }
    }
    if (input.current) input.current.value = '';
    await refresh();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Library"
        title="Media"
        description="Photos for social previews and upcoming pages. Always add alt text: a short, honest description of the cake in the photo."
        actions={<>
          <input ref={input} type="file" accept={ACCEPTED.join(',')} multiple className="sr-only" onChange={(event) => upload(event.target.files)} />
          <Button tone="accent" onClick={() => input.current?.click()} busy={uploading > 0}><Upload className="h-3.5 w-3.5" /> {uploading ? `Uploading ${uploading}…` : 'Upload photos'}</Button>
        </>}
      />
      {error && <Notice tone="red">{error}</Notice>}
      {items === null ? <Loading /> : items.length === 0 ? (
        <EmptyState title="No uploads yet">Upload JPEG, PNG, WebP or AVIF photos up to 15 MB. Landscape 1200 × 630 works best for link previews.</EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <button key={item.id} onClick={() => setSelected(item)} className="group overflow-hidden rounded-xl border border-[#EDE3E2] bg-white text-left hover:border-[#D63384]">
              <div className="aspect-square bg-[#F3ECE7]"><img src={item.url} alt={item.alt || ''} loading="lazy" className="h-full w-full object-cover" /></div>
              <div className="px-2.5 py-2">
                <p className="truncate text-[12px] font-semibold">{item.name}</p>
                <p className={`truncate text-[11px] ${item.alt ? 'text-gray-500' : 'font-semibold text-amber-600'}`}>{item.alt || 'Needs alt text'}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {selected && <MediaDetail item={selected} onClose={() => setSelected(null)} onChanged={refresh} />}
    </div>
  );
}

function MediaDetail({ item, onClose, onChanged }: { item: MediaItem; onClose: () => void; onChanged: () => Promise<void> }) {
  const notify = useToast();
  const [alt, setAlt] = useState(item.alt || '');
  const [caption, setCaption] = useState(item.caption || '');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await updateDoc(doc(db, 'media', item.id), { alt: alt.trim(), caption: caption.trim(), ...stamp() });
      await onChanged();
      notify('Saved');
      onClose();
    } catch (err) { notify(friendlyError(err), 'error'); } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${item.name}? Pages or previews using it will lose the image.`)) return;
    setBusy(true);
    try {
      await deleteObject(ref(storage, item.storagePath)).catch(() => undefined);
      await deleteDoc(doc(db, 'media', item.id));
      void logAudit('media.delete', item.name);
      await onChanged();
      notify('Deleted');
      onClose();
    } catch (err) { notify(friendlyError(err), 'error'); setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#251B21]/40 p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl overflow-hidden">
        <div onClick={(event) => event.stopPropagation()} className="grid grid-cols-1 sm:grid-cols-2">
          <div className="bg-[#F3ECE7]"><img src={item.url} alt={alt} className="h-full max-h-[70vh] w-full object-contain" /></div>
          <div className="space-y-3 p-4">
            <p className="truncate text-[13px] font-semibold">{item.name}</p>
            <p className="text-[11px] text-gray-500">{item.width && item.height ? `${item.width} × ${item.height} px · ` : ''}{(item.size / 1024 / 1024).toFixed(2)} MB</p>
            <Field label="Alt text" count={alt.length} max={125} hint="What is in the photo, e.g. “Three-tier ivory wedding cake with blush roses”.">
              <input value={alt} onChange={(event) => setAlt(event.target.value.slice(0, 200))} className={inputClass} />
            </Field>
            <Field label="Caption (optional)">
              <input value={caption} onChange={(event) => setCaption(event.target.value.slice(0, 300))} className={inputClass} />
            </Field>
            <Button onClick={() => { void navigator.clipboard.writeText(item.url); notify('Image address copied'); }}><Copy className="h-3.5 w-3.5" /> Copy image address</Button>
            <div className="flex items-center justify-between gap-2 border-t border-[#F3ECEA] pt-3">
              <Button tone="danger" onClick={remove} disabled={busy}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
              <div className="flex gap-2"><Button onClick={onClose}>Cancel</Button><Button tone="primary" onClick={save} busy={busy}>Save</Button></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
