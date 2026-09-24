# HANDOFF — Cakeasy

_Last updated: 2026-09-24 by Claude (CMS foundation + SEO engine release). Update this file whenever you stop working._

## What this is
The **live** website for Cakeasy, a bespoke wedding & celebration cake studio run by founder/main baker **Neha Chaudhary**. Its story runs Lucknow (2021) → Delhi NCR → Greater Noida. Instagram: `@cakeasy99`. Treat changes as production-priority: the site is live.

## Where things live
- Local: `C:\Users\pixif\Documents\Cakeasy`
- GitHub: `Neyush-04/Cakeasy`, branch `main`. Pushes auto-deploy to Vercel. Live domain **https://www.cakeasy.in** (apex redirects to www; `cakeasy.vercel.app` also works).
- Vercel previews (non-main branches) are behind Vercel login. Claude checked them through Claude in Chrome with Piyush's session.
- Firebase project `gen-lang-client-0442655314`, **named** Firestore DB `ai-studio-cakeasy-d3f45449-f679-491a-bb46-52a2d38aeb77` (Enterprise edition). Firebase CLI on this PC is logged in as pixiforu@gmail.com.
- Print collateral: `output/`. Audit + plan: `AUDIT.md`, `ROADMAP.md`.
- **Digital marketing kit** (how to use the CMS for SEO, Google, campaigns and measurement): `docs/marketing/README.md`.
- Reference project with the same CMS/marketing-kit ideas: `C:\Users\pixif\Documents\Baba website - Delta Project` (see its `docs/DIGITAL_MARKETING_OPERATIONS_MANUAL.md`).

## Stack / architecture
Vite 6 + React 19 + React Router 7, Tailwind 4, `motion`. Vercel functions in `api/` (TypeScript, ESM: import siblings with `.js` extensions).
- **`api/render.ts`**: every page request is rewritten to it (see `vercel.json`). It injects per-page SEO (title, description, canonical, robots, OG/Twitter, Bakery JSON-LD) plus `window.__CAKEASY__` (site settings, tracking IDs, SEO overrides) into `dist/app-shell.html`, applies CMS redirects, and returns real 404s. The build renames `dist/index.html` to `app-shell.html` (`scripts/finalize-build.mjs`) so "/" also goes through it.
- `api/sitemap.ts`, `api/llms.ts`, `api/enquiry.ts` (saves leads, returns `CK-XXXXXX` ref), `api/instagram.js`.
- Server functions read and write Firestore with **unauthenticated REST** (`shared/firestore-rest.ts`), so `firestore.rules` decide everything. No service account needed. Collection reads use `runQuery`: plain ListDocuments is refused for unauthenticated callers on this DB.
- `shared/site.ts` holds the route list, default SEO copy, default contact settings and the bootstrap owner email. It is used by both the browser and the functions.
- **CMS** at `/admin` (`src/admin/`, lazy-loaded, Firebase JS SDK only there). Google sign-in. Roles live in Firestore `cms_users/{email}`: `owner` (everything), `editor` (SEO/redirects/media), `marketing` (+ tracking IDs). `pixiforu@gmail.com` is the permanent bootstrap owner, hard-coded in `firestore.rules`, `storage.rules` and `shared/site.ts`.
- Collections: `settings/site`, `settings/marketing`, `seo` (live) + `seo_drafts`, `redirects`, `media`, `enquiries`, `cms_users`, `audit_log`, plus legacy `products`, `instagram_posts`, `orders`, `coupons`.
- Tracking (`src/lib/analytics.ts`): GA4 + Meta Pixel load only after cookie consent, and only when IDs are set in CMS → Marketing. Events: `page_view`, `whatsapp_click`, `generate_lead`/Meta `Lead` (only when an enquiry is saved). Also pushes `lead_submission_success` to dataLayer for a future GTM.
- UTM/referrer/landing page are captured per session (`src/lib/attribution.ts`) and stored on each enquiry.

## Commands
```
npm run dev          # vite on :3000
npm run lint         # tsc --noEmit
npm test             # unit tests (SEO engine, enquiry validation)
npm run test:rules   # Firestore rules tests on the emulator (uses firebase-tools@13: this PC has Java 17)
npm run build        # vite build + rename index.html -> app-shell.html
npm run serve:prod   # after build: local copy of Vercel routing on :4173 (real api handlers)
npx firebase-tools deploy --only firestore:rules --project gen-lang-client-0442655314
```
CMS QA without real Google: run `npx firebase-tools@13.35.1 emulators:start --only auth,firestore,storage --project gen-lang-client-0442655314`, then run Vite with `VITE_USE_EMULATORS=true`. In the browser console, `await __cmsTestSignIn('pixiforu@gmail.com')`. This is dev-only and stripped from production builds.
(PowerShell may block `npm.ps1`. Use `npm.cmd`.)

## Brand & content rules (from Piyush)
- **Homepage hero must feature Neha herself.** She is the face of the brand.
- The original watercolor/floral Cakeasy logo is the source of truth (`src/assets/brand/`). Never redraw it.
- Top bar: all social icons, with **WhatsApp bold and prominent**. Orders, contact and custom-cake enquiries go to **WhatsApp** (there's no checkout).
- Categories: **Wedding & Milestone Cakes** (`/weddings`), **Designer** (`/cakes/designer`), **Bento** (`/cakes/bento`). `/cakes/wedding` 301-redirects to `/weddings`.
- Gallery tells the story from 2021. Multi-photo posts open like an Amazon product catalogue. Photos are shown uncropped.
- No fabricated reviews, stats, delivery/refund/eggless claims. No ratings in schema.
- Judge design as the bride, a parent buying a kid's designer cake, a wife surprising her husband, etc. It must feel luxury.

## Done
- Earlier: security hardening, baker-story homepage, story gallery, Instagram sync with fallback, cake simulator, `/weddings`, `/consultation`, print collateral pack.
- 2026-09-24: **CMS foundation + SEO engine** (see architecture above). Firestore rules deployed to production (23 emulator tests pass). Enquiries are saved before WhatsApp opens (all 4 flows), with a fallback that still opens WhatsApp if saving fails. Nav/footer/home links are now crawlable `<a>` links. Privacy text updated for saved enquiries and cookies.

- 2026-09-24: **Digital marketing kit** in `docs/marketing/` (README, QUICK_START, OPERATIONS_MANUAL, SEARCH_AND_GOOGLE_BUSINESS_PLAYBOOK, CAMPAIGN_LINKS_GUIDE, LOCAL_SEO_KEYWORD_MAP, MEASUREMENT_PLAN). Added a Meta domain verification field (CMS → Marketing). In Firebase Auth, Google was already enabled; Claude added `www.cakeasy.in`, `cakeasy.in` and `cakeasy.vercel.app` to the authorised domains (via Piyush's Chrome, with his OK).

## Open / next
1. **Media uploads**: Firebase Storage requires upgrading the project from Spark to **Blaze** (pay-as-you-go; small usage is typically free). This is Piyush's decision. After upgrading: Storage → Get started, then `npx firebase-tools deploy --only storage --project gen-lang-client-0442655314`. The alternative is Vercel Blob (needs a store and token in Vercel).
2. Delete the 3 QA enquiries in CMS → Enquiries (named "QA Test (Claude)…": CK-1371A3, CK-23030A, CK-1B0925).
3. Marketing setup from the kit: verify Search Console, submit the sitemap, set up the Google Business Profile and link it, then connect GA4/Pixel. Paste the suggested SEO titles from `LOCAL_SEO_KEYWORD_MAP.md` once Neha approves them.
4. Phase 4: content modules (cakes/catalogue, gallery archive metadata, FAQs, landing-page builder), then new SEO landing pages.
5. Performance: public JS bundle is ~535 KB (159 KB gz). Route-level code splitting would help. Images are unoptimised JPEGs.
6. Instagram access token: store it only in Vercel as `INSTAGRAM_ACCESS_TOKEN` (+ `INSTAGRAM_MEDIA_LIMIT=50`). `/api/instagram` returns 503 until then (the site falls back to the local gallery).
7. Spam protection for `/api/enquiry` is basic (validation, per-instance rate limit; the API accepts a `website` honeypot field but the forms don't send one yet). Consider Firebase App Check / Turnstile if spam appears.
