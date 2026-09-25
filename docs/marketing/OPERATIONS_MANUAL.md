# Cakeasy Digital Marketing Operations Manual

For the Cakeasy Studio CMS released on 24 September 2026. It describes what is
live on www.cakeasy.in. Features marked **NOT YET ACTIVE** need a setup step first.

---

## 1. Who controls what

| Tool | Used for | Not used for |
| --- | --- | --- |
| **Cakeasy CMS** (`/admin`) | Enquiries, SEO per page, social previews, redirects, short links, media, business details, tracking IDs, users | Page design, new page layouts, code, domain/DNS |
| **Google Search Console** | Seeing Google searches that show Cakeasy, indexing problems, sitemap | Changing page content |
| **Google Business Profile** | The Google Maps / "near me" listing, reviews, photos, posts, calls and chats | Website content |
| **GA4** | Visits, sources, which pages lead to enquiries (consenting visitors only) | Proving an enquiry exists (the CMS does that) |
| **Meta Pixel / Events Manager** | Measuring and optimising Instagram/Facebook ads | Organic Instagram insights |
| **Developer** | Code, new page types, deployments, Firebase/Vercel settings | Approving claims or prices |
| **Neha (owner)** | Every public claim, price, photo and reply to customers | — |

---

## 2. Signing in and roles

Open **www.cakeasy.in/admin** → **Continue with Google**. Access is granted per
Gmail address in **Users & roles**. Nobody shares a password.

| Role | Can open | Cannot |
| --- | --- | --- |
| **Owner** | Everything: Enquiries, SEO, Redirects, Media, Marketing & tracking, Studio settings, Users & roles, Activity log | — |
| **Content editor** | Dashboard, SEO, Redirects, Media | See enquiries, change contact details, tracking IDs or users |
| **Marketing** | Dashboard, SEO, Redirects, Media, Marketing & tracking | See enquiries, change contact details or users |

- `pixiforu@gmail.com` is the permanent site administrator and cannot be removed
  from the CMS.
- **Pause** someone by clicking their Active badge; **remove** them with the bin
  icon. Access changes apply immediately.
- Give an agency or freelancer the **Marketing** role, never Owner. Enquiries
  contain customers' personal details.
- Sign out (top-right icon) on shared computers.

---

## 3. Enquiries (leads)

Every website enquiry is saved **before** WhatsApp opens. There are four kinds:

| Type in CMS | Comes from | Contact details |
| --- | --- | --- |
| Consultation | `/consultation` three-step brief | Name + phone always, email optional |
| Cake simulator | `/custom` "Open WhatsApp" | Often none. The customer appears on WhatsApp with the reference |
| Contact form | `/contact` | Name + email |
| Enquiry list | The bag icon (selected cakes + simulator designs) | Often none |

**Daily routine**
1. Open **Enquiries** (or the Dashboard's "New enquiries").
2. Match the `CK-XXXXXX` reference with the WhatsApp chat.
3. **Reply on WhatsApp** opens a chat with a polite first line if the customer
   typed a phone number.
4. Set **Status**:
   `new` → `contacted` → `quoted` → `confirmed` → `completed`, or `lost` /
   `spam`.
5. Add **Private notes** (quote sent, tasting booked, design changes) and a
   **Follow up on** date. The Dashboard lists follow-ups that are due.

**"How they found Cakeasy"** shows the campaign tag, the referring site, and
the first page the customer saw. *Direct* means no tag and no referrer, for
example someone who typed the address or came from a WhatsApp chat.

**Export CSV** downloads the filtered list (it opens in Excel or Google Sheets).
Store exports privately and delete them when done.

**Deleting**: only when a customer asks for their details to be removed, or for
spam and tests. Otherwise set `lost`. Every delete is recorded in the Activity log.

**If the save fails** (no internet, a Google outage), the customer still reaches
WhatsApp, just without a reference. Nothing is lost; that enquiry exists only in
WhatsApp.

---

## 4. SEO: how each page appears on Google and in shared links

Open **SEO**. Each page shows its path, its current Google title and
description, and badges:

- **Default**: using the built-in copy. **Custom · live**: your version is
  published. **Draft**: saved but not live. **Unpublished changes**: the live
  version differs from your draft.
- **Healthy / N tips**: length checks. **Duplicate title**: two pages share a
  title; make each unique.
- **Hidden from search**: that page is set to noindex.

### Fields

| Field | What it does | Guidance |
| --- | --- | --- |
| SEO title | The blue link in Google and the browser tab | 50–60 characters. Put the main words first: *what* + *where* + Cakeasy. One page, one idea |
| Meta description | The grey text under the link | 120–160 characters. Say what the page really offers and invite the next step. Google may rewrite it |
| Share title / description | WhatsApp, Instagram and Facebook link previews | Optional. They fall back to the SEO title and description |
| Share image | The picture in link previews | A real Cakeasy cake, landscape, ideally 1200 × 630. **Choose** from Media uploads or website photos |
| Show this page in search results | index / noindex | Leave on for every real page. Turn off only for pages that should not be found |
| Let search engines follow links | follow / nofollow | Leave on |
| Canonical URL | Tells Google which address is the "real" one | **Leave empty.** Only change it on a developer's advice |
| Extra structured data (JSON-LD) | Machine-readable facts | Advanced. The bakery's name, address, founder and social links are added automatically. Never add ratings, reviews, prices or offers that are not real and visible on the page |

### Buttons
- **Save draft** stores changes privately; the live site is unchanged.
- **Publish** makes it live on the site within about 2–3 minutes. Google picks it
  up on its next visit, which can take days; see the playbook to speed that up.
- **Discard draft** throws away the draft and keeps the live version.
- **Reset to default** removes your custom SEO and restores the built-in copy.

### What the site does automatically
- Each page sends Google its own title, description, canonical address and
  preview tags, and the bakery's business details (schema).
- Unknown addresses return a real "404 not found", so Google doesn't index junk.
- `www.cakeasy.in/sitemap.xml` lists every indexable page and updates itself.
  Pages set to *Hidden from search*, or redirected, drop out automatically.
- `www.cakeasy.in/llms.txt` gives AI assistants (ChatGPT, Gemini, Perplexity) a
  factual summary: how to order, contact details and the pages.
- `/admin` is never indexed.

---

## 5. Share previews (WhatsApp, Instagram DMs, Facebook)

1. Set **Share image**, and optionally the share title and description, in SEO → **Publish**.
2. Paste the link into a WhatsApp chat to yourself to check the preview.
3. Apps cache previews. If an old preview persists, use the Facebook Sharing Debugger
   (<https://developers.facebook.com/tools/debug/>) → **Scrape again**. WhatsApp
   may keep an old preview for a few days for links already shared.

---

## 6. Redirects and short links

**Use redirects** when a page moves, when an old link is printed somewhere, or
for short campaign links.

**Redirects** › **New redirect**:

| Field | Example | Notes |
| --- | --- | --- |
| Old address | `/wedding-offer` | Starts with `/`; lowercase letters, numbers and `-` only |
| Send visitors to | `/weddings` or `/consultation?utm_source=print&utm_medium=qr` | Must be a page on this site |
| Type | Permanent (301) / Temporary (302) | Permanent = moved for good. Temporary = campaigns and seasonal links |
| Note | "Diwali 2026 flyer QR" | Why it exists |
| Redirect is on | on/off | Turn off instead of deleting while unsure |

The CMS **blocks**: redirects to itself, loops, chains (A→B→C), duplicates, and
protected addresses (`/admin`, `/api`, image folders, `/`). If you redirect a
live page, it warns you, and the page leaves the sitemap.

Campaign tags on the incoming link (`utm_…`, `gclid`, `fbclid`) are carried over
to the destination automatically.

**Short links** (faster): Marketing & tracking › Campaign link builder ›
**Create short link**. These are temporary redirects you can change later,
which is ideal for QR codes on boxes, cards and banners.

Built-in, permanent: `/cakes/wedding` → `/weddings`.

---

## 7. Media library

> **NOT YET ACTIVE.** Uploads need Firebase Storage, which needs the Blaze
> (pay-as-you-go) plan. Until then, share images can be chosen from **Website
> photos** in the picker.

Once active: **Media** › **Upload photos** (JPEG, PNG, WebP or AVIF, up to 15 MB).
Then open each photo and add **Alt text**: a short, honest description such as
"Three-tier ivory wedding cake with blush roses". Alt text helps Google Images
and people using screen readers.

- Upload only Cakeasy's own photos, or photos the photographer allowed you to use.
- Don't upload photos showing customers' faces, invitations with names, or phone
  numbers unless the customer agreed.
- Deleting a photo breaks any preview using it.

---

## 8. Studio settings (owner)

The WhatsApp number, phone, email, address and social profile links used across
the site, the footer, the WhatsApp buttons, Google's business data and
`llms.txt`.

- **WhatsApp number**: digits only, with country code (`918810795004`). Every
  WhatsApp button uses it.
- **Structured address** (street, city, state, PIN): what Google reads. Keep it
  **identical** to the Google Business Profile (the same "NAP": name, address,
  phone).
- **Social links**: leave empty to hide an icon. A Facebook or YouTube icon
  appears in the top bar and footer when filled.
- **Google Business Profile link**: paste the share link from Google Maps.

---

## 9. Marketing & tracking

| Field | Where to find it | Effect |
| --- | --- | --- |
| GA4 Measurement ID `G-…` | GA4 › Admin › Data streams › Web | Turns on Google Analytics (after cookie consent) |
| Meta Pixel ID | Meta Events Manager › Data sources | Turns on the Pixel (after advertising consent) |
| Google Search Console | Search Console › HTML tag method | Adds the verification tag to every page |
| Bing Webmaster Tools | Bing › Meta tag method | Adds the Bing tag |
| Meta domain verification | Meta Business Suite › Brand safety › Domains › Meta-tag | Needed before running ads that link to the site |

You can paste the whole `<meta …>` tag. The CMS keeps only the code inside it.

**Cookie banner**: it appears automatically once a GA4 or Pixel ID is set, and
offers **Accept**, **Only necessary** and **Choose**. Visitors can change their
choice from **Cookie preferences** in the footer. Nothing loads before consent,
and nothing ever loads inside `/admin`.

The event list and GA4/Meta setup are in [MEASUREMENT_PLAN.md](MEASUREMENT_PLAN.md).

---

## 10. Instagram → website workflow

Instagram is Cakeasy's shop window; the website turns interest into a brief.

- **Bio link**: a short link such as `cakeasy.in/insta` pointing to
  `/consultation?utm_source=instagram&utm_medium=social&utm_content=bio`.
  Change its destination in Redirects for seasonal pushes (e.g. wedding season →
  `/weddings`).
- **Stories / reels**: use a link sticker with a tagged link (`utm_content=story`).
- **Captions**: describe the cake in words people search for ("three-tier
  ivory wedding cake for a Greater Noida wedding"). Mention the occasion and
  the design idea, never private customer details.
- **Highlights**: Weddings, Designer, Birthdays, Bento. They mirror the
  website categories.
- **Live gallery**: once `INSTAGRAM_ACCESS_TOKEN` is set in Vercel, new posts
  appear in the website gallery automatically. Until then the curated archive
  shows.

## 11. WhatsApp

- WhatsApp Business profile: the same name, address, website
  (`www.cakeasy.in`) and hours as Google.
- Quick replies: a saved reply for "Thank you for your brief CK-…, Neha will
  share design options and a quotation shortly".
- **Status / broadcasts**: use tagged links (`utm_source=whatsapp`) so you can see
  which broadcast brought enquiries.
- Never forward customer photos or details to other customers.

---

## 12. Campaign launch checklist

- [ ] The destination page reads well on a phone: headline, photos, WhatsApp/consultation button.
- [ ] SEO title, description and share image published for that page.
- [ ] Tagged link built (see [CAMPAIGN_LINKS_GUIDE.md](CAMPAIGN_LINKS_GUIDE.md)); short link created if it goes on print or QR.
- [ ] One test enquiry through the link shows the right source in Enquiries; then mark it spam.
- [ ] If ads run: Pixel connected, domain verified, `Lead` visible in Meta Events Manager › Test events.
- [ ] Neha knows the dates and can reply quickly. Response speed wins cake orders.
- [ ] After the campaign: the short link points somewhere sensible (never a dead page).

## 13. Page pre-publish checklist (SEO)

- [ ] The title is unique, under 60 characters, and says what + where.
- [ ] The description is 120–160 characters and matches what's on the page.
- [ ] The share image is a real Cakeasy cake.
- [ ] Search visibility is on (unless deliberately hidden).
- [ ] No claim that Neha hasn't confirmed (prices, delivery areas, eggless, lead times).
- [ ] Published, then checked: open the page, view it on a phone, paste the link into WhatsApp.

## 14. What must never happen

- Fake or paid-for reviews, ratings, "500+ happy customers" style numbers, or
  stock photos presented as Cakeasy cakes.
- Scripts, pixels or embed codes pasted into any text field.
- Customer names, phone numbers or emails in links, captions, or tracking tags.
- Duplicate GA4/Pixel installs (for example also adding them through another tool).
  One installation only: the CMS fields.
- Counting WhatsApp button clicks as orders. Only a saved enquiry is a lead.
- Sharing `/admin` screenshots that show customer details.

## 15. Troubleshooting

| Problem | Check first | Ask the developer when |
| --- | --- | --- |
| A change isn't showing | Did you **Publish** (not just Save draft)? Wait 3 minutes, then refresh | Still old after 10 minutes |
| "Your role does not allow this change" | Your role (Users & roles) or an invalid field | The owner gets it too |
| No CMS access | Is your exact Gmail in Users & roles and set to Active? | The owner can't sign in |
| Old WhatsApp preview | Facebook Sharing Debugger › Scrape again | The page source shows the wrong image |
| Enquiry without a reference in WhatsApp | The save failed or timed out; handle it on WhatsApp | It happens repeatedly |
| Redirect not working | Redirect is on? Exact old address? Wait 3 minutes | Still failing after 10 minutes |
| Page missing from Google | Search Console › URL Inspection (see the playbook) | Inspection shows an error |
| Cookie banner not showing | It only appears once a GA4 or Pixel ID is saved | IDs are saved but no banner |
