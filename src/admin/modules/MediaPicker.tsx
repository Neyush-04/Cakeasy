import React, { useEffect, useState } from 'react';
import { Images, X } from 'lucide-react';
import { INSTAGRAM_POSTS } from '../../data';
import { friendlyError } from '../firebase';
import { Button, Loading } from '../ui';
import { loadMedia, type MediaItem } from './Media';

const SITE_PHOTOS = Array.from(new Set(INSTAGRAM_POSTS.flatMap((post) => post.images?.length ? post.images : [post.imageUrl]))).filter((url) => url.startsWith('/'));

export default function MediaPicker({ onPick }: { onPick: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'uploads' | 'site'>('site');
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || items) return;
    loadMedia().then((list) => { setItems(list); if (list.length) setTab('uploads'); }).catch((err) => { setError(friendlyError(err)); setItems([]); });
  }, [open, items]);

  const choose = (url: string) => { onPick(url); setOpen(false); };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="shrink-0"><Images className="h-3.5 w-3.5" /> Choose</Button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#251B21]/40 p-4" onClick={() => setOpen(false)}>
          <div onClick={(event) => event.stopPropagation()} className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-[#F3ECEA] px-4 py-3">
              <div className="flex gap-1">
                {(['uploads', 'site'] as const).map((value) => (
                  <button key={value} onClick={() => setTab(value)} className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${tab === value ? 'bg-[#251B21] text-white' : 'text-gray-500 hover:bg-[#FBF8F7]'}`}>
                    {value === 'uploads' ? 'Media uploads' : 'Website photos'}
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1 text-gray-400 hover:text-[#251B21]"><X className="h-5 w-5" /></button>
            </div>
            <div className="overflow-y-auto p-4">
              {tab === 'uploads' && (items === null ? <Loading /> : error ? <p className="text-[13px] text-red-600">{error}</p> : items.length === 0 ? (
                <p className="text-[13px] text-gray-500">No uploads yet. Upload photos in Media, or pick a website photo.</p>
              ) : (
                <Grid urls={items.map((item) => ({ url: item.url, label: item.alt || item.name }))} onPick={choose} />
              ))}
              {tab === 'site' && <Grid urls={SITE_PHOTOS.map((url) => ({ url, label: url }))} onPick={choose} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Grid({ urls, onPick }: { urls: { url: string; label: string }[]; onPick: (url: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {urls.map(({ url, label }) => (
        <button key={url} onClick={() => onPick(url)} title={label} className="aspect-square overflow-hidden rounded-lg border border-[#EDE3E2] bg-[#F3ECE7] hover:ring-2 hover:ring-[#D63384]">
          <img src={url} alt={label} loading="lazy" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  );
}
