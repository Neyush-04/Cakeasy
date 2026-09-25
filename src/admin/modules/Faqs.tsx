import React, { useCallback, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, writeBatch } from 'firebase/firestore';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { LIMITS, cleanFaqItem, type FaqItem } from '../../../shared/content';
import { db, friendlyError, logAudit, stamp } from '../firebase';
import { Badge, Button, Card, EmptyState, Field, Loading, Notice, PageHeader, Toggle, inputClass, useToast } from '../ui';

const newId = () => `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// Starter drafts: they only restate facts already confirmed on the website.
const STARTER_FAQS: Omit<FaqItem, 'id' | 'order' | 'published'>[] = [
  { question: 'Are Cakeasy cakes eggless?', answer: 'Yes. Every Cakeasy cake is eggless by default. If you have an allergy or another dietary need, mention it in your brief and Neha will confirm what is possible.' },
  { question: 'How do I order a custom cake?', answer: 'Send a brief from the consultation page, the cake simulator or WhatsApp. Neha replies on WhatsApp to discuss the design, servings, flavour and date, and shares a quotation before anything is confirmed.' },
  { question: 'How far in advance should I book?', answer: 'Share your date as early as you can, especially for weddings and multi-tier cakes. Cakeasy confirms availability on WhatsApp before accepting an order.' },
  { question: 'Can I share inspiration photos?', answer: 'Yes. Mention your references in the consultation brief or the cake simulator, then attach the photos in the WhatsApp chat that opens.' },
  { question: 'Do you deliver, or can I pick up?', answer: 'Pickup and delivery are discussed and confirmed on WhatsApp before the order is accepted, including any venue setup for wedding cakes.' },
  { question: 'Where is Cakeasy based?', answer: 'Cakeasy is a premium home cake boutique in Greater Noida, serving Delhi NCR. It began in Lucknow in 2021.' },
];

function toRecord(item: FaqItem) {
  const { id: _id, ...rest } = item;
  return { ...rest, ...stamp() };
}

export default function FaqsModule() {
  const notify = useToast();
  const [items, setItems] = useState<FaqItem[] | null>(null);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<FaqItem | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'faqs'), orderBy('order')));
      setItems(snapshot.docs.map((item) => cleanFaqItem(item.id, item.data())).filter((item): item is FaqItem => Boolean(item)));
    } catch (err) { setError(friendlyError(err)); setItems([]); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const addStarters = async () => {
    setBusy(true);
    try {
      const batch = writeBatch(db);
      STARTER_FAQS.forEach((faq, index) => batch.set(doc(db, 'faqs', newId() + index), { ...faq, published: false, order: (index + 1) * 10, ...stamp() }));
      await batch.commit();
      void logAudit('faqs.import', `${STARTER_FAQS.length} drafts`);
      notify('Starter FAQs added as hidden drafts. Review each one, then switch it on.');
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); } finally { setBusy(false); }
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.question.trim() || !draft.answer.trim()) { notify('Add both a question and an answer.', 'error'); return; }
    setBusy(true);
    try {
      await setDoc(doc(db, 'faqs', draft.id), toRecord({ ...draft, question: draft.question.trim(), answer: draft.answer.trim() }));
      void logAudit('faq.save', draft.question.slice(0, 80));
      notify(draft.published ? 'Saved. Shown on /consultation within about 2 minutes.' : 'Saved as hidden.');
      setEditingId(null);
      setDraft(null);
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); } finally { setBusy(false); }
  };

  const togglePublished = async (item: FaqItem) => {
    try {
      await setDoc(doc(db, 'faqs', item.id), toRecord({ ...item, published: !item.published }));
      void logAudit('faq.save', item.question.slice(0, 80), item.published ? 'hidden' : 'shown');
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); }
  };

  const remove = async (item: FaqItem) => {
    if (!window.confirm(`Delete “${item.question}”?`)) return;
    try {
      await deleteDoc(doc(db, 'faqs', item.id));
      void logAudit('faq.delete', item.question.slice(0, 80));
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); }
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!items) return;
    const current = items[index];
    const other = items[index + direction];
    if (!other) return;
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'faqs', current.id), toRecord({ ...current, order: other.order }));
      batch.set(doc(db, 'faqs', other.id), toRecord({ ...other, order: current.order === other.order ? current.order + direction : current.order }));
      await batch.commit();
      await refresh();
    } catch (err) { notify(friendlyError(err), 'error'); }
  };

  const startNew = () => {
    const order = items && items.length ? Math.max(...items.map((item) => item.order)) + 10 : 10;
    const item = { id: newId(), question: '', answer: '', published: true, order };
    setEditingId(item.id);
    setDraft(item);
  };

  const editor = draft && (
    <Card className="space-y-3 border-[#F0B7C9] p-4">
      <Field label="Question" count={draft.question.length} max={LIMITS.question}>
        <input value={draft.question} onChange={(event) => setDraft({ ...draft, question: event.target.value.slice(0, LIMITS.question) })} className={inputClass} />
      </Field>
      <Field label="Answer" count={draft.answer.length} max={LIMITS.answer} hint="Answer as Neha would on WhatsApp. Only state what is true today.">
        <textarea value={draft.answer} onChange={(event) => setDraft({ ...draft, answer: event.target.value.slice(0, LIMITS.answer) })} rows={4} className={`${inputClass} resize-none`} />
      </Field>
      <Toggle label="Show on the website" checked={draft.published} onChange={(value) => setDraft({ ...draft, published: value })} />
      <div className="flex justify-end gap-2">
        <Button onClick={() => { setEditingId(null); setDraft(null); }}>Cancel</Button>
        <Button tone="primary" onClick={save} busy={busy}>Save FAQ</Button>
      </div>
    </Card>
  );

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="FAQs"
        description="Questions answered on the consultation page. Visible FAQs are also shared with Google as FAQ data, so keep every answer accurate."
        actions={<Button tone="accent" onClick={startNew} disabled={Boolean(draft)}><Plus className="h-3.5 w-3.5" /> New FAQ</Button>}
      />
      {error && <Notice tone="red">{error}</Notice>}
      {draft && !items?.some((item) => item.id === draft.id) && <div className="mb-4">{editor}</div>}
      {items === null ? <Loading /> : items.length === 0 && !draft ? (
        <EmptyState title="No FAQs yet">
          <p>Start with six suggested questions (eggless, ordering, booking, inspiration photos, delivery, location). They're added hidden so you can check them first.</p>
          <Button tone="primary" className="mt-4" onClick={addStarters} busy={busy}>Add suggested FAQs</Button>
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => editingId === item.id ? <div key={item.id}>{editor}</div> : (
            <Card key={item.id} className="flex items-start gap-3 p-3">
              <button onClick={() => { setEditingId(item.id); setDraft(item); }} className="min-w-0 flex-1 text-left">
                <p className="text-[13px] font-semibold">{item.question}</p>
                <p className="line-clamp-2 text-[12px] text-gray-500">{item.answer}</p>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => togglePublished(item)} title={item.published ? 'Click to hide' : 'Click to show'}><Badge tone={item.published ? 'green' : 'gray'}>{item.published ? 'Shown' : 'Hidden'}</Badge></button>
                <button onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-1 text-gray-400 hover:text-[#251B21] disabled:opacity-30" aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(index, 1)} disabled={index === items.length - 1} className="rounded p-1 text-gray-400 hover:text-[#251B21] disabled:opacity-30" aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => remove(item)} className="rounded p-1 text-gray-400 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
