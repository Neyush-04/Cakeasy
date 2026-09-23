import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { PUBLIC_ROUTES } from '../../../shared/site';
import { db } from '../firebase';
import { useSession } from '../session';
import { Badge, Card, Loading, PageHeader, formatDateTime } from '../ui';
import { loadEnquiries, sourceLabel, type Enquiry } from './Enquiries';

interface Checks { gsc: boolean; ga4: boolean; pixel: boolean; gbp: boolean; seoPages: number; instagram: boolean | null }

export default function Dashboard() {
  const session = useSession();
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(session.can('enquiries') ? null : []);
  const [checks, setChecks] = useState<Checks | null>(null);

  useEffect(() => {
    if (session.can('enquiries')) loadEnquiries(300).then(setEnquiries).catch(() => setEnquiries([]));
    Promise.all([
      getDoc(doc(db, 'settings', 'marketing')).then((snap) => snap.data() || {}).catch(() => ({} as Record<string, string>)),
      getDoc(doc(db, 'settings', 'site')).then((snap) => snap.data() || {}).catch(() => ({} as Record<string, string>)),
      getDocs(collection(db, 'seo')).then((snap) => snap.size).catch(() => 0),
      fetch('/api/instagram').then(async (response) => response.ok && Array.isArray((await response.json())?.posts)).catch(() => false),
    ]).then(([marketing, site, seoPages, instagram]) => setChecks({
      gsc: Boolean(marketing.googleSiteVerification), ga4: Boolean(marketing.ga4MeasurementId), pixel: Boolean(marketing.metaPixelId),
      gbp: Boolean(site.googleBusinessUrl), seoPages, instagram,
    }));
  }, [session]);

  const stats = useMemo(() => {
    if (!enquiries) return null;
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    const today = new Date().toISOString().slice(0, 10);
    const thisMonth = enquiries.filter((item) => item.createdAt && item.createdAt.toDate() >= monthStart);
    const sources: Record<string, number> = {};
    thisMonth.forEach((item) => { const label = sourceLabel(item.source); sources[label] = (sources[label] || 0) + 1; });
    const topSource = Object.entries(sources).sort((a, b) => b[1] - a[1])[0];
    return {
      fresh: enquiries.filter((item) => item.status === 'new').length,
      month: thisMonth.length,
      confirmed: thisMonth.filter((item) => item.status === 'confirmed' || item.status === 'completed').length,
      topSource: topSource ? `${topSource[0]} (${topSource[1]})` : '—',
      followUps: enquiries.filter((item) => item.followUpDate && item.followUpDate <= today && !['completed', 'lost', 'spam', 'confirmed'].includes(item.status)),
    };
  }, [enquiries]);

  const firstName = (session.user.displayName || '').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <PageHeader eyebrow="Cakeasy studio" title={`${greeting}${firstName ? `, ${firstName}` : ''}`} description="What needs attention today, and how the website is growing." />

      {session.can('enquiries') && (
        stats === null ? <Loading /> : (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label="New enquiries" value={stats.fresh} to="/admin/enquiries" highlight={stats.fresh > 0} />
              <Stat label="Enquiries this month" value={stats.month} />
              <Stat label="Confirmed this month" value={stats.confirmed} />
              <Stat label="Top source this month" value={stats.topSource} small />
            </div>

            {stats.followUps.length > 0 && (
              <Card className="mt-4 p-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-amber-700">Follow-ups due</p>
                <ul className="space-y-1 text-[13px]">
                  {stats.followUps.slice(0, 5).map((item) => <li key={item.id}><span className="font-mono text-[#B02266]">{item.ref}</span> · {item.name || 'No name'} · due {item.followUpDate}</li>)}
                </ul>
              </Card>
            )}

            <Card className="mt-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#F3ECEA] px-4 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Latest enquiries</p>
                <Link to="/admin/enquiries" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#D63384]">All enquiries <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
              {enquiries && enquiries.length ? (
                <ul className="divide-y divide-[#F3ECEA]">
                  {enquiries.slice(0, 6).map((item) => (
                    <li key={item.id} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
                      <span className="w-20 shrink-0 font-mono text-[12px] text-[#B02266]">{item.ref}</span>
                      <span className="min-w-0 flex-1 truncate font-semibold">{item.name || 'Name not given'}<span className="font-normal text-gray-500"> · {sourceLabel(item.source)}</span></span>
                      <span className="hidden text-[12px] text-gray-500 sm:inline">{formatDateTime(item.createdAt)}</span>
                      <Badge tone={item.status === 'new' ? 'pink' : 'gray'}>{item.status}</Badge>
                    </li>
                  ))}
                </ul>
              ) : <p className="px-4 py-6 text-[13px] text-gray-500">No website enquiries yet. They appear here the moment a customer sends a brief.</p>}
            </Card>
          </>
        )
      )}

      <Card className="mt-4 p-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Growth checklist</p>
        {checks === null ? <Loading /> : (
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Check done={checks.gsc} label="Verify the site in Google Search Console" to={session.can('marketing') ? '/admin/marketing' : undefined} />
            <Check done={checks.gbp} label="Link your Google Business Profile" to={session.can('settings') ? '/admin/settings' : undefined} />
            <Check done={checks.ga4} label="Connect Google Analytics 4" to={session.can('marketing') ? '/admin/marketing' : undefined} />
            <Check done={checks.pixel} label="Connect the Meta Pixel (Instagram ads)" to={session.can('marketing') ? '/admin/marketing' : undefined} />
            <Check done={checks.seoPages >= 3} label={`Review SEO on your key pages (${checks.seoPages}/${PUBLIC_ROUTES.length} customised)`} to="/admin/seo" />
            <Check done={checks.instagram === true} label={checks.instagram === null ? 'Instagram sync: could not check' : 'Instagram gallery sync is live'} />
          </ul>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value, to, highlight, small }: { label: string; value: React.ReactNode; to?: string; highlight?: boolean; small?: boolean }) {
  const body = (
    <Card className={`h-full p-4 ${highlight ? 'border-[#F0B7C9] bg-[#FFF7FA]' : ''} ${to ? 'hover:border-[#D63384]' : ''}`}>
      <p className="text-[11px] font-semibold text-gray-500">{label}</p>
      <p className={`mt-1 font-serif font-bold text-[#251B21] ${small ? 'truncate text-base' : 'text-3xl'}`}>{value}</p>
    </Card>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

function Check({ done, label, to }: { done: boolean; label: string; to?: string }) {
  const content = (
    <span className="flex items-center gap-2 text-[13px]">
      {done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <Circle className="h-4 w-4 shrink-0 text-gray-300" />}
      <span className={done ? 'text-gray-500 line-through decoration-gray-300' : 'text-[#251B21]'}>{label}</span>
    </span>
  );
  return <li>{to && !done ? <Link to={to} className="block rounded-lg px-2 py-1.5 hover:bg-[#FBF8F7]">{content}</Link> : <div className="px-2 py-1.5">{content}</div>}</li>;
}
