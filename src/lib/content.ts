// Published CMS content (gallery, catalogue, FAQs) from /api/content, fetched once per
// visit. Anything the CMS hasn't filled yet falls back to the built-in site content.
import { useEffect, useState } from 'react';
import type { GalleryCategory, GalleryImage, PublicContent } from '../../shared/content';
import { ARCHIVE_CATEGORY_BY_ID, INSTAGRAM_POSTS } from '../data';
import type { InstagramPost } from '../types';

export interface GalleryEntry {
  id: string;
  caption: string;
  category: GalleryCategory;
  year: string;
  date: string;
  images: GalleryImage[];
  featured: boolean;
}

let request: Promise<PublicContent | null> | null = null;

function loadContent(): Promise<PublicContent | null> {
  if (!request) {
    request = fetch('/api/content', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() as Promise<PublicContent> : null))
      .catch(() => null);
  }
  return request;
}

export function usePublicContent(): PublicContent | null {
  const [content, setContent] = useState<PublicContent | null>(null);
  useEffect(() => {
    let alive = true;
    loadContent().then((value) => { if (alive) setContent(value); });
    return () => { alive = false; };
  }, []);
  return content;
}

function yearOf(date: string): string {
  const match = date.match(/\b(20\d{2})\b/);
  return match ? match[1] : '';
}

// Built-in archive (or the Instagram sync) in the same shape as CMS gallery items.
export function postsToEntries(posts: InstagramPost[]): GalleryEntry[] {
  return posts.map((post) => {
    const images = (post.images?.length ? post.images : [post.imageUrl]).map((url) => ({ url, alt: post.caption }));
    return {
      id: post.id,
      caption: post.caption,
      category: (ARCHIVE_CATEGORY_BY_ID[post.id] as GalleryCategory) || 'designer',
      year: yearOf(post.date),
      date: post.date,
      images,
      featured: false,
    };
  });
}

export const BUILT_IN_GALLERY: GalleryEntry[] = postsToEntries(INSTAGRAM_POSTS);
