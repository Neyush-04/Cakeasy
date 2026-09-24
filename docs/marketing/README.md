# Cakeasy Digital Marketing Kit

Everything needed to grow Cakeasy's website enquiries without touching code.
Written for Neha (owner), anyone helping with Instagram, Google or ads, and the
developer who supports them.

| Document | Read it when | Who |
| --- | --- | --- |
| [QUICK_START.md](QUICK_START.md) | First day. One page, the ten things that matter. | Everyone |
| [OPERATIONS_MANUAL.md](OPERATIONS_MANUAL.md) | You need the exact steps for a CMS task. | Owner, marketing |
| [SEARCH_AND_GOOGLE_BUSINESS_PLAYBOOK.md](SEARCH_AND_GOOGLE_BUSINESS_PLAYBOOK.md) | Setting up Google Search Console and the Google Business Profile, and asking for reviews. | Owner |
| [CAMPAIGN_LINKS_GUIDE.md](CAMPAIGN_LINKS_GUIDE.md) | Sharing a link on Instagram, WhatsApp, print or ads. | Owner, marketing |
| [LOCAL_SEO_KEYWORD_MAP.md](LOCAL_SEO_KEYWORD_MAP.md) | Choosing page titles, writing captions, planning new pages. | Owner, marketing |
| [MEASUREMENT_PLAN.md](MEASUREMENT_PLAN.md) | Connecting GA4 / Meta Pixel and writing the monthly report. | Owner, marketing, developer |

## The one rule behind all of it

**Cakeasy sells through trust.** Every page, post, ad and review must be real:
real cakes, real photos, real prices only when Neha has confirmed them, real
customer words. Never publish invented reviews, ratings, "orders delivered"
counts, delivery promises, eggless or allergen claims, or offers that have not
been agreed. Google, Meta and customers all punish fake signals, and one
screenshot of a false claim can undo a year of good work.

## How the pieces fit

```
Instagram / WhatsApp / Google / print ──(tagged link)──▶ www.cakeasy.in page
                                                            │
                          customer fills consultation / simulator / contact
                                                            │
                      enquiry saved in CMS with a CK-XXXXXX reference + source
                                                            │
                        WhatsApp opens with the brief ──▶ Neha replies, quotes
                                                            │
                       CMS › Enquiries status: contacted → quoted → confirmed
```

- **The CMS** (`www.cakeasy.in/admin`) is the source of truth for enquiries
  and for what Google shows about each page.
- **GA4 and the Meta Pixel** measure visits and ad results, but only for
  visitors who accept cookies. Their numbers will always be lower than the CMS.
  That is expected.
- **Search Console and Google Business Profile** show how people find Cakeasy
  on Google Search and Google Maps.

## Current status (update this when it changes)

| Item | Status |
| --- | --- |
| CMS, SEO per page, redirects, enquiries | Live since 24 Sep 2026 |
| Google sign-in for the CMS | Enabled; www.cakeasy.in, cakeasy.in and cakeasy.vercel.app authorised |
| Meta domain verification field | Available in CMS › Marketing & tracking |
| Google Search Console | **Not yet verified.** See the playbook, step 1 |
| Google Business Profile link on the site | **Not yet added** (CMS › Studio settings) |
| GA4 | **Not connected** (no Measurement ID yet) |
| Meta Pixel | **Not connected** (no Pixel ID yet) |
| Media uploads | **Waiting.** Firebase Storage needs the Blaze plan; website photos can still be picked for previews |
| Instagram live gallery | **Waiting.** Needs `INSTAGRAM_ACCESS_TOKEN` in Vercel; the site shows the curated archive meanwhile |
