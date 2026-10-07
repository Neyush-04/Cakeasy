import { Link } from 'react-router-dom';
import { siteSettings } from '../lib/runtime';
import { whatsappUrl } from '../lib/whatsapp';
import { OPEN_CONSENT_EVENT } from './ConsentBanner';

export type PolicySlug = 'privacy-policy' | 'terms' | 'refund-policy';

export const POLICY_LINKS: { slug: PolicySlug; label: string }[] = [
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Service' },
  { slug: 'refund-policy', label: 'Cancellation & Refund Policy' },
];

const UPDATED = '7 October 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-serif text-xl font-bold text-[#251B21]">{title}</h2>
      <div className="space-y-2 text-sm leading-7 text-gray-600">{children}</div>
    </section>
  );
}

function Privacy() {
  return (
    <>
      <Section title="What we collect">
        <p>When you send an enquiry from this website (the consultation brief, the cake simulator, the contact form or your enquiry list), Cakeasy saves the details you type, such as your name, phone number, email, event date and cake brief, so that Neha can reply and prepare a quotation. The conversation then continues on WhatsApp.</p>
        <p>We also note how you reached the website, for example an Instagram or Google campaign link, the website you came from and the first page you opened. This helps us understand which channels help people find Cakeasy. We do not put your name, phone number or email into links or tracking.</p>
        <p>Photos you choose in the forms are not uploaded to the website. You attach them yourself in WhatsApp.</p>
      </Section>
      <Section title="Where it is stored">
        <p>Enquiries are stored securely in Google Firebase and can only be opened by Cakeasy's owners.</p>
      </Section>
      <Section title="Cookies and measurement">
        <p>Necessary storage remembers your cookie choice. Optional analytics cookies (Google Analytics) and advertising cookies (Meta Pixel) are used only if you accept them. You can change your choice at any time from{' '}
          <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="font-semibold text-[#D63384] underline-offset-2 hover:underline">Cookie preferences</button>.
        </p>
      </Section>
      <Section title="Accounts and payment">
        <p>The website does not offer customer accounts or online payment.</p>
      </Section>
      <Section title="Your choices">
        <p>To see, correct or delete the details of your enquiry, message Cakeasy on{' '}
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="font-semibold text-[#D63384] underline-offset-2 hover:underline">WhatsApp</a>
          {siteSettings.email && <> or email <a href={`mailto:${siteSettings.email}`} className="font-semibold text-[#D63384] underline-offset-2 hover:underline">{siteSettings.email}</a></>}.
        </p>
      </Section>
    </>
  );
}

function Terms() {
  return (
    <>
      <Section title="Orders">
        <p>Cake designs, availability, pricing, delivery and pickup details are confirmed directly with Cakeasy on WhatsApp before an order is accepted.</p>
      </Section>
      <Section title="Ingredients">
        <p>Every Cakeasy cake is eggless by default. Please tell us about any allergy or dietary need in your brief so it can be discussed before the order is accepted.</p>
      </Section>
      <Section title="Website content">
        <p>The cakes shown on this website are Cakeasy's own work. Please do not reuse the photos without permission.</p>
      </Section>
    </>
  );
}

function Refund() {
  return (
    <Section title="Cancellations and refunds">
      <p>Cancellation and refund terms for a custom order are confirmed directly with Cakeasy before the order is accepted.</p>
    </Section>
  );
}

const PAGES: Record<PolicySlug, { title: string; body: () => React.ReactElement }> = {
  'privacy-policy': { title: 'Privacy Policy', body: Privacy },
  terms: { title: 'Terms of Service', body: Terms },
  'refund-policy': { title: 'Cancellation & Refund Policy', body: Refund },
};

export default function PolicyView({ slug }: { slug: PolicySlug }) {
  const page = PAGES[slug];
  const Body = page.body;
  return (
    <article className="mx-auto max-w-3xl space-y-8 pb-20 animate-fadeIn">
      <header className="space-y-2 border-b border-[#EDE3E2] pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D63384]">Cakeasy policies</p>
        <h1 className="font-serif text-4xl font-bold text-[#251B21]">{page.title}</h1>
        <p className="text-xs text-gray-400">Last updated {UPDATED}</p>
      </header>
      <Body />
      <nav aria-label="Other policies" className="flex flex-wrap gap-2 border-t border-[#EDE3E2] pt-6">
        {POLICY_LINKS.filter((link) => link.slug !== slug).map((link) => (
          <Link key={link.slug} to={`/${link.slug}`} className="rounded-full border border-[#EDE3E2] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#43242F] hover:border-[#F0B7C9] hover:text-[#D63384]">{link.label}</Link>
        ))}
      </nav>
    </article>
  );
}
