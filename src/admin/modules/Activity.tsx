import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, type Timestamp } from 'firebase/firestore';
import { db, friendlyError } from '../firebase';
import { Card, EmptyState, Loading, Notice, PageHeader, formatDateTime } from '../ui';

interface Entry { id: string; actor: string; action: string; target: string; summary?: string; at?: Timestamp }

const LABELS: Record<string, string> = {
  'seo.publish': 'Published SEO', 'seo.draft': 'Saved SEO draft', 'seo.reset': 'Reset SEO to default',
  'redirect.create': 'Added redirect', 'redirect.update': 'Edited redirect', 'redirect.delete': 'Deleted redirect',
  'media.upload': 'Uploaded photo', 'media.delete': 'Deleted photo',
  'settings.site': 'Changed studio settings', 'settings.marketing': 'Changed tracking settings',
  'enquiry.update': 'Updated enquiry', 'enquiry.delete': 'Deleted enquiry', 'enquiries.export': 'Exported enquiries',
  'gallery.import': 'Imported gallery archive', 'gallery.create': 'Added gallery post', 'gallery.update': 'Edited gallery post', 'gallery.delete': 'Removed gallery post',
  'catalogue.import': 'Imported catalogue', 'catalogue.create': 'Added cake', 'catalogue.update': 'Edited cake', 'catalogue.delete': 'Removed cake',
  'faqs.import': 'Added suggested FAQs', 'faq.save': 'Saved FAQ', 'faq.delete': 'Deleted FAQ',
  'user.add': 'Gave access', 'user.update': 'Changed access', 'user.remove': 'Removed access',
};

export default function Activity() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDocs(query(collection(db, 'audit_log'), orderBy('at', 'desc'), limit(200)))
      .then((snapshot) => setEntries(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Entry))))
      .catch((err) => { setError(friendlyError(err)); setEntries([]); });
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Audit" title="Activity log" description="Who changed what in the CMS. Entries cannot be edited or deleted." />
      {error && <Notice tone="red">{error}</Notice>}
      {entries === null ? <Loading /> : entries.length === 0 ? <EmptyState title="No activity yet" /> : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-[#F3ECEA]">
            {entries.map((entry) => (
              <li key={entry.id} className="grid grid-cols-1 gap-1 px-4 py-2.5 text-[13px] sm:grid-cols-[150px_1fr_220px] sm:items-center sm:gap-3">
                <span className="text-[12px] text-gray-500">{formatDateTime(entry.at)}</span>
                <span className="min-w-0"><b className="font-semibold">{LABELS[entry.action] || entry.action}</b> <span className="font-mono text-[12px] text-gray-600">{entry.target}</span>{entry.summary && <span className="block truncate text-[12px] text-gray-400">{entry.summary}</span>}</span>
                <span className="truncate text-[12px] text-gray-500">{entry.actor}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
