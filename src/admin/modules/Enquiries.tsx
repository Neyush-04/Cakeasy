import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc, type Timestamp } from 'firebase/firestore';
import { Download, MessageCircle, Phone, Mail, RefreshCw, X, Trash2 } from 'lucide-react';
import { db, friendlyError, logAudit, stamp } from '../firebase';
import { Badge, Button, Card, EmptyState, Field, Loading, PageHeader, formatDateTime, inputClass, useToast } from '../ui';

export const ENQUIRY_STATUSES = ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'lost', 'spam'] as const;
type Status = typeof ENQUIRY_STATUSES[number];

const STATUS_TONE: Record<Status, 'pink' | 'blue' | 'amber' | 'green' | 'gray' | 'red'> = {
  new: 'pink', contacted: 'blue', quoted: 'amber', confirmed: 'green', completed: 'gray', lost: 'gray', spam: 'red',
};

const KIND_LABEL: Record<string, string> = {
  consultation: 'Consultation', 'custom-cake': 'Cake simulator', contact: 'Contact form', cart: 'Enquiry list',
};

const SOURCE_LABELS: Record<string, string> = {
  utm_campaign: 'Campaign', utm_content: 'Placement', utm_term: 'Keyword', gclid: 'Google Ads click',
  fbclid: 'Meta click', referrer: 'Came from', landingPage: 'First page seen',
};

export interface Enquiry {
  id: string;
  ref: string;
  kind: string;
  name: string;
  phone: string;
  email: string;
  eventDate: string;
  details: Record<string, string>;
  source: Record<string, string>;
  pagePath: string;
  status: Status;
  notes?: string;
  followUpDate?: string;
  createdAt?: Timestamp;
  updatedBy?: string;
}

export function sourceLabel(source: Record<string, string> = {}): string {
  if (source.utm_source) return [source.utm_source, source.utm_medium].filter(Boolean).join(' / ');
  if (source.gclid) return 'Google Ads';
  if (source.fbclid) return 'Facebook / Instagram';
  if (source.referrer) {
    try { return new URL(source.referrer).hostname.replace(/^www\./, ''); } catch { return source.referrer; }
  }
  return 'Direct';
}

function whatsappDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

export async function loadEnquiries(max = 500): Promise<Enquiry[]> {
  const snapshot = await getDocs(query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'), limit(max)));
  return snapshot.docs.map((item) => ({ id: item.id, details: {}, source: {}, ...item.data() } as Enquiry));
}

export default function Enquiries() {
  const notify = useToast();
  const [items, setItems] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'all' | Status>('all');
  const [kind, setKind] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError('');
    try { setItems(await loadEnquiries()); } catch (err) { setError(friendlyError(err)); setItems([]); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = useMemo(() => (items || []).filter((item) => {
    if (status !== 'all' && item.status !== status) return false;
    if (kind !== 'all' && item.kind !== kind) return false;
    if (search) {
      const needle = search.toLowerCase();
      return [item.ref, item.name, item.phone, item.email, ...Object.values(item.details || {})].some((value) => String(value || '').toLowerCase().includes(needle));
    }
    return true;
  }), [items, status, kind, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items?.length || 0 };
    for (const item of items || []) map[item.status] = (map[item.status] || 0) + 1;
    return map;
  }, [items]);

  const selected = items?.find((item) => item.id === selectedId) || null;

  const exportCsv = () => {
    const detailKeys = Array.from(new Set(filtered.flatMap((item) => Object.keys(item.details || {}))));
    const header = ['Reference', 'Received', 'Status', 'Type', 'Name', 'Phone', 'Email', 'Event date', 'Source', 'Campaign', 'Landing page', 'Page', ...detailKeys, 'Notes', 'Follow-up'];
    const rows = filtered.map((item) => [
      item.ref, formatDateTime(item.createdAt), item.status, KIND_LABEL[item.kind] || item.kind, item.name, item.phone, item.email, item.eventDate,
      sourceLabel(item.source), item.source?.utm_campaign || '', item.source?.landingPage || '', item.pagePath,
      ...detailKeys.map((key) => item.details?.[key] || ''), item.notes || '', item.followUpDate || '',
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([String.fromCharCode(0xfeff) + csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `cakeasy-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    void logAudit('enquiries.export', `${filtered.length} rows`);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Leads"
        title="Enquiries"
        description="Every consultation brief, simulator design, contact message and enquiry list sent from the website. The customer then continues on WhatsApp with the same reference."
        actions={<>
          <Button onClick={refresh}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          <Button onClick={exportCsv} disabled={!filtered.length}><Download className="h-3.5 w-3.5" /> Export CSV</Button>
        </>}
      />

      <div className="no-scrollbar mb-3 flex gap-1 overflow-x-auto pb-1">
        {(['all', ...ENQUIRY_STATUSES] as const).map((value) => (
          <button key={value} onClick={() => setStatus(value)} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold capitalize ${status === value ? 'bg-[#251B21] text-white' : 'bg-white text-gray-500 ring-1 ring-[#EDE3E2] hover:text-[#251B21]'}`}>
            {value} <span className="ml-0.5 opacity-60">{counts[value] || 0}</span>
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_200px]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, reference or brief…" className={inputClass} />
        <select value={kind} onChange={(event) => setKind(event.target.value)} className={inputClass}>
          <option value="all">All enquiry types</option>
          {Object.entries(KIND_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      {error && <p className="mb-3 text-[13px] text-red-600">{error}</p>}
      {items === null ? <Loading /> : filtered.length === 0 ? (
        <EmptyState title={items.length ? 'No enquiries match' : 'No enquiries yet'}>
          {items.length ? 'Try another status or search.' : 'New website enquiries will appear here as soon as a customer sends a brief.'}
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[110px_1.4fr_1fr_110px_1fr_130px_100px] gap-3 border-b border-[#F3ECEA] bg-[#FBF8F7] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 xl:grid">
            <span>Reference</span><span>Customer</span><span>Type</span><span>Event</span><span>Source</span><span>Received</span><span>Status</span>
          </div>
          <ul className="divide-y divide-[#F3ECEA]">
            {filtered.map((item) => (
              <li key={item.id}>
                <button onClick={() => setSelectedId(item.id)} className="grid w-full grid-cols-[1fr_auto] gap-x-3 gap-y-1 px-4 py-3 text-left hover:bg-[#FBF8F7] xl:grid-cols-[110px_1.4fr_1fr_110px_1fr_130px_100px] xl:items-center">
                  <span className="font-mono text-[12px] font-semibold text-[#B02266]">{item.ref}</span>
                  <span className="order-first col-span-2 min-w-0 xl:order-none xl:col-span-1">
                    <span className="block truncate text-[13px] font-semibold">{item.name || 'Name not given'}</span>
                    <span className="block truncate text-[12px] text-gray-500">{item.phone || item.email || 'Will message on WhatsApp'}</span>
                  </span>
                  <span className="text-[12px] text-gray-600">{KIND_LABEL[item.kind] || item.kind}</span>
                  <span className="text-[12px] text-gray-600">{item.eventDate || '—'}</span>
                  <span className="truncate text-[12px] text-gray-600">{sourceLabel(item.source)}</span>
                  <span className="text-[12px] text-gray-500">{formatDateTime(item.createdAt)}</span>
                  <span><Badge tone={STATUS_TONE[item.status] || 'gray'}>{item.status}</Badge></span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {selected && (
        <EnquiryPanel
          key={selected.id}
          enquiry={selected}
          onClose={() => setSelectedId(null)}
          onSaved={(patch) => setItems((current) => current?.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)) || null)}
          onDeleted={() => { setItems((current) => current?.filter((item) => item.id !== selected.id) || null); setSelectedId(null); notify('Enquiry deleted'); }}
        />
      )}
    </div>
  );
}

function EnquiryPanel({ enquiry, onClose, onSaved, onDeleted }: { enquiry: Enquiry; onClose: () => void; onSaved: (patch: Partial<Enquiry>) => void; onDeleted: () => void }) {
  const notify = useToast();
  const [status, setStatus] = useState<Status>(enquiry.status);
  const [notes, setNotes] = useState(enquiry.notes || '');
  const [followUpDate, setFollowUpDate] = useState(enquiry.followUpDate || '');
  const [busy, setBusy] = useState(false);
  const dirty = status !== enquiry.status || notes !== (enquiry.notes || '') || followUpDate !== (enquiry.followUpDate || '');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const save = async () => {
    setBusy(true);
    try {
      await updateDoc(doc(db, 'enquiries', enquiry.id), { status, notes, followUpDate, ...stamp() });
      onSaved({ status, notes, followUpDate });
      void logAudit('enquiry.update', enquiry.ref, `status: ${status}`);
      notify('Enquiry updated');
    } catch (error) {
      notify(friendlyError(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete enquiry ${enquiry.ref} permanently? Only do this if the customer asked, or it is spam.`)) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, 'enquiries', enquiry.id));
      void logAudit('enquiry.delete', enquiry.ref);
      onDeleted();
    } catch (error) {
      notify(friendlyError(error), 'error');
      setBusy(false);
    }
  };

  const phoneDigits = whatsappDigits(enquiry.phone || '');
  const firstName = (enquiry.name || '').split(' ')[0];
  const replyText = `Hi${firstName ? ` ${firstName}` : ''}, this is Neha from Cakeasy about your enquiry ${enquiry.ref}.`;
  const details = Object.entries(enquiry.details || {}).filter(([, value]) => value);
  const source = Object.entries(enquiry.source || {});

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#251B21]/30" onClick={onClose}>
      <aside role="dialog" aria-label={`Enquiry ${enquiry.ref}`} onClick={(event) => event.stopPropagation()} className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-slideIn">
        <div className="flex items-start justify-between gap-3 border-b border-[#F3ECEA] px-5 py-4">
          <div>
            <p className="font-mono text-[12px] font-semibold text-[#B02266]">{enquiry.ref}</p>
            <h2 className="font-serif text-xl font-bold">{enquiry.name || 'Name not given'}</h2>
            <p className="text-[12px] text-gray-500">{KIND_LABEL[enquiry.kind] || enquiry.kind} · {formatDateTime(enquiry.createdAt)}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-[#FBF8F7] hover:text-[#251B21]" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {phoneDigits && <a href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(replyText)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#20ba59]"><MessageCircle className="h-3.5 w-3.5" /> Reply on WhatsApp</a>}
            {enquiry.phone && <a href={`tel:${enquiry.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7DEDC] px-3 py-2 text-[12px] font-semibold hover:bg-[#FBF8F7]"><Phone className="h-3.5 w-3.5" /> {enquiry.phone}</a>}
            {enquiry.email && <a href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Your Cakeasy enquiry ${enquiry.ref}`)}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7DEDC] px-3 py-2 text-[12px] font-semibold hover:bg-[#FBF8F7]"><Mail className="h-3.5 w-3.5" /> Email</a>}
          </div>
          {!enquiry.phone && !enquiry.email && <p className="text-[12px] text-gray-500">No contact details were typed. The customer was sent to WhatsApp with reference {enquiry.ref}; look for it in the chat.</p>}

          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Brief</h3>
            <dl className="divide-y divide-[#F3ECEA] rounded-lg border border-[#EDE3E2] text-[13px]">
              {enquiry.eventDate && <Row label="Event date" value={enquiry.eventDate} />}
              {details.map(([key, value]) => <Row key={key} label={key} value={value} />)}
              {!details.length && !enquiry.eventDate && <p className="px-3 py-2 text-gray-400">No brief details.</p>}
            </dl>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">How they found Cakeasy</h3>
            <dl className="divide-y divide-[#F3ECEA] rounded-lg border border-[#EDE3E2] text-[13px]">
              <Row label="Source" value={sourceLabel(enquiry.source)} />
              {source.filter(([key]) => key !== 'utm_source' && key !== 'utm_medium').map(([key, value]) => <Row key={key} label={SOURCE_LABELS[key] || key} value={value} />)}
              <Row label="Sent from page" value={enquiry.pagePath} />
            </dl>
          </section>

          <section className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Follow-up</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status">
                <select value={status} onChange={(event) => setStatus(event.target.value as Status)} className={`${inputClass} capitalize`}>
                  {ENQUIRY_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </Field>
              <Field label="Follow up on">
                <input type="date" value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} className={inputClass} />
              </Field>
            </div>
            <Field label="Private notes" count={notes.length} max={4000}>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value.slice(0, 4000))} rows={4} placeholder="Quote sent, tasting booked, design changes…" className={`${inputClass} resize-none`} />
            </Field>
            {enquiry.updatedBy && <p className="text-[11px] text-gray-400">Last updated by {enquiry.updatedBy}</p>}
          </section>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-[#F3ECEA] px-5 py-3">
          <Button tone="danger" onClick={remove} disabled={busy}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
          <Button tone="primary" onClick={save} busy={busy} disabled={!dirty}>Save changes</Button>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 px-3 py-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-[#251B21]">{value}</dd>
    </div>
  );
}
